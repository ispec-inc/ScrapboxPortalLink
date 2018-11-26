import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';
import {SBProjectNameStorageManager} from './manager/SBProjectNameStrageManager';
import {Observable, zip} from 'rxjs';
import {Link} from './model/link';
import {Subject} from 'rxjs/internal/Subject';
import {distinctUntilChanged, skip, take, throttle, throttleTime} from 'rxjs/operators';
import {generate} from 'rxjs/internal/observable/generate';

/**
 * グローバル変数定義
 */

const sbRequests: ScrapboxRequest[] = [];
const pageLinkSubject: Subject<LinkElement[]> = new Subject<LinkElement[]>();


/**
 * インターフェース定義
 */

interface LinkElement {
  name: string;
  labelElement: HTMLElement;
}

const initLinkElement = function(name: string, labelElement: HTMLElement): LinkElement {
  return {name: name, labelElement: labelElement};
};


/**
  LifeCycle メソッド
  Rxオブジェクトの監視
 */

$(window).on('load', function() {
  requestSBPageBySavedProjects();

  $('#app-container').on('DOMSubtreeModified propertychange', function(e) {
    // linesが変更された時にリンクを更新する
    if (e.target.className === 'lines') {
      updatePortalLinks();
    }
  });

  pageLinkSubject
    .pipe(distinctUntilChanged((prev, current) => prev.length === current.length))
    .pipe(throttleTime(5000))
    .subscribe(pageLinks => {
      appendLinkIfNeeded(pageLinks);
    });

});

$(window).keyup(function (e) {
  // console.log(e.keyCode); // 49

  updatePortalLinks();
});

$(document).mousedown(e => {
  removeCandidatePopup();
});



/**
 * 関数
 */
const updatePortalLinksIfReactDrawDone = function() {
  if ($('.lines').children().length === 0) {
    setTimeout(function () {
      updatePortalLinksIfReactDrawDone();
    }, 1000);
  } else {
    updatePortalLinks();
  }
};

const updatePortalLinks = function() {
  replaceEmptyLinkIfEnabled();
  setLinkPageSubject($('.grid')[1]);
};

const requestSBPageBySavedProjects = function () {

  const completeReqSubject: Subject<void> = new Subject<void>();

  SBProjectNameStorageManager.getProjectNames(function (projectNames: string[]) {

    // projectNames.forEach(function (name: string) {
      // const scbRequest = new ScrapboxRequest(name, function () {
      //   replaceEmptyLinkIfEnabled();
      // });
      //
      // sbRequests.push(scbRequest);
    // });

    for (let i = 0; i < projectNames.length; i++) {
      const scbRequest = new ScrapboxRequest(projectNames[i], function () {
        completeReqSubject.next();
      });

      sbRequests.push(scbRequest);
    }

    completeReqSubject
      .pipe(skip(projectNames.length - 1))
      .subscribe(function () {
        updatePortalLinksIfReactDrawDone();
      });

  });
};

const replaceEmptyLinkIfEnabled = function(): void {
  const emptyPageElements = findEmptyPageLink();

  let currentEditingElement: HTMLElement;

  emptyPageElements.forEach(element => {
    const validateTitle = element.innerText.match(/\[(.+)\]/);
    let isEditing: boolean = false;
    let pageTitle: string = element.innerText;

    if (validateTitle) {
      currentEditingElement = element;
      isEditing = true;
      pageTitle = validateTitle[1];
    }

    let candidatePageNames: string[] = [];

    for (const sbRequest of sbRequests) {
      if (isEditing) {
        candidatePageNames = candidatePageNames.concat(sbRequest.likePage(pageTitle));
      }

      const pageLink = sbRequest.pageUrl(pageTitle);

      if (pageLink) {
        element.setAttribute('href', pageLink);
        element.classList.add('portal-page-link');
        break;
      }
    }

    fetchCandidatePopup(candidatePageNames, currentEditingElement);
  });
};

const findEmptyPageLink = function(): HTMLElement[] {
  return $('.empty-page-link').get();
};

const fetchCandidatePopup = function (candidatePageNames: string[], targetEmptyLinkElement: HTMLElement) {
  candidatePageNames.sort((a, b) => a.length - b.length);
  candidatePageNames.length = 30;

  const buttonContainer = $('.portal-button-container');

  // 生成されていなかったら、補完用のpopupを生成する
  if (buttonContainer.length === 0) {
    const popUpElement = '<div class="portal-popup-menu"><div class="portal-button-container"></div></div>';
    $('.cursor').append(popUpElement);
  }

  $('.portal-page-button').remove();

  candidatePageNames.forEach(pageName => {
    const currentCandidates = buttonContainer.children('div');
    for (let i = 0; i < currentCandidates.length; i++) {
      if (currentCandidates.get(i).innerText === pageName) {
        return;
      }
    }

    $('.portal-button-container').append(`<div class="portal-page-button">${pageName}</div>`);
  });
};

const removeCandidatePopup = function() {
  $('.portal-popup-menu').remove();
};

const setLinkPageSubject = function(gridElement: HTMLElement) {

  const portalLinks = $('.portal-page-link');

  const relationLabels = $(gridElement).children('.relation-label');
  let linkElements: LinkElement[] = [];
  for (let i = 0; i < relationLabels.length; i++) {
    const relationLabelElement = relationLabels[i];
    const titleElement = $(relationLabels[i]).find('.title').first();
    const linkName = titleElement.text();

    if (linkName === 'Links') {
      for (let i = 0; i < portalLinks.length; i++) {
        linkElements.push(initLinkElement(portalLinks[i].innerText, relationLabelElement));
      }
    } else if (linkName !== 'New Links') {
      linkElements.push(initLinkElement(linkName, relationLabelElement));
    }
  }

  pageLinkSubject.next(linkElements);
};

const appendLinkIfNeeded = function (linkElements: LinkElement[]) {
  $('.portal-link-item').remove();

  linkElements.forEach(linkElement => {
    sbRequests.forEach(req => {
      if (req.projectName === getCurrentProjectName()) { return; }

      if (linkElement.labelElement.innerText === 'Links\n') {
        const link = req.pageToLink(linkElement.name);
        if (link) {
          const generatedLink: string = generatePageListItem(link, req.projectName);
          const lastItem = $(linkElement.labelElement).nextUntil('.splitter').last();
          lastItem.after(generatedLink);
        }
      } else {
        req.requestRelatedPages(linkElement.name)
          .subscribe(links => {
            if (links.length === 0) { return; }

            const generatedLinks: string[] = links.map(link => generatePageListItem(link, req.projectName));

            const lastItem = $(linkElement.labelElement).nextUntil('.splitter').last();
            lastItem.after(generatedLinks.reduce((prev, current) => prev + current));
          });
      }
    });
  });
};

const generatePageListItem = function (link: Link, projectName: string): string {
  let pageListItem = `
    <li class="page-list-item grid-style-item portal-link-item">
      <a href="/${projectName}/${link.title}" rel="route">
      <div class="hover"></div>
      <div class="content">
        <div class="header"><div class="title">${link.title}</div></div>`

  if (link.image) {
    pageListItem += `<div class="icon"><img src="${link.image}" class="lazy-load-img"></div>`;
  } else {
    pageListItem += `<div class="description">`;
    link.descriptions.forEach(description => {
      pageListItem += `<p>${description}</p>`;
    });
    pageListItem += `</div>`;
  }

  pageListItem += `
      <div class="project-name"><span>${projectName}</span></div>
      </div>
      </a>
    </li>`;

  return pageListItem;
};

const getCurrentProjectName = function (): string {
  return location.pathname.split('/')[1];
};
