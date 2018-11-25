import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';
import {SBProjectNameStorageManager} from './manager/SBProjectNameStrageManager';
import {Observable, zip} from 'rxjs';
import {Link} from './model/link';
import {Subject} from 'rxjs/internal/Subject';
import {distinctUntilChanged} from 'rxjs/operators';

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


/**
  LifeCycle メソッド
  Rxオブジェクトの監視
 */

$(window).on('load', function() {
  requestSBPageBySavedProjects();

  $('#app-container').on('DOMSubtreeModified propertychange', function(e) {
    // linesが変更された時にリンクを更新する
    if (e.target.className === 'lines') {
      replaceEmptyLinkIfEnabled();
    }

    if (e.target.className === 'grid') {
      setLinkPageSubject(e.target);
    }
  });

  pageLinkSubject
    .pipe(distinctUntilChanged((prev, current) => prev.length === current.length))
    .subscribe(pageLinks => {
    console.log('りんくへんこうされたー', pageLinks.length);
  });
});

$(window).keyup(function (e) {
  console.log(e.keyCode);

  if (e.keyCode === 49) {
    console.log($('.grid'));
    appendLinkIfNeeded($('.grid')[1]);
  }

  replaceEmptyLinkIfEnabled();
});

$(document).mousedown(e => {
  removeCandidatePopup();
});




/**
 * 関数
 */


const requestSBPageBySavedProjects = function () {

  SBProjectNameStorageManager.getProjectNames(function (projectNames: string[]) {

    projectNames.forEach(function (name: string) {
      const scbRequest = new ScrapboxRequest(name, function () {
        replaceEmptyLinkIfEnabled();
      });

      sbRequests.push(scbRequest);
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
  const relationLabels = $(gridElement).children('.relation-label');
  let linkElements: LinkElement[] = [];
  for (let i = 0; i < relationLabels.length; i++) {
    const relationLabelElement = relationLabels[i];
    const titleElement = $(relationLabels[i]).find('.title').first();
    const linkName = titleElement.text();
    if (linkName !== 'New Links') {
      linkElements.push({name: linkName, labelElement: relationLabelElement});
    }
  }

  pageLinkSubject.next(linkElements);
};

const appendLinkIfNeeded = function (gridElement: HTMLElement) {
  const relationLabels = $(gridElement).children('.relation-label');

  const newTag = `
    <li class="page-list-item grid-style-item">
      <a href="/murawaki/E3%82%AF" rel="route">
      <div class="hover"></div>
      <div class="content">
        <div class="header"><div class="title">情報と価値の非中央集権ネットワーク</div></div>
        <div class="description">
        <p>コンセプト</p>
        <p>本質的なものに、もっと本質的な価値を。</p>
        </div></div></a></li>`;
  //
  const relationLabelElement = relationLabels[0];
  $(relationLabelElement).parent().append(newTag);

  let linkNames: string[] = [];
  for (let i = 0; i < relationLabels.length; i++) {
    const relationLabelElement = relationLabels[i];
    const linkName = $(relationLabels[i]).find('.title').first().text();
    if (linkName !== 'New Links') {
      linkNames.push(linkName);
    }
  }

  const linkReqObservers: Observable<Link[]>[] = sbRequests.map(request => {
    return request.requestRelatedPages(linkNames[0]);
  });

  linkReqObservers.forEach(observable => {
    observable.subscribe((links: Link[]) => {
      for (let i = 0; i < relationLabels.length; i++) {
        const relationLabelElement = relationLabels[i];
        // relationLabelElement.parentElement!.append('<li class="page-list-item grid-style-item"><a href="/murawaki/E3%82%AF" rel="route"><div class="hover"></div> <div class="content"> <div class="header"><div class="title">情報と価値の非中央集権ネットワーク</div> </div> <div class="description"><p>コンセプト</p> <p>本質的なものに、もっと本質的な価値を。</p> </div> </div> </a> </li>');
      }
    });
  });
};
