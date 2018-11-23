import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';
import {SBProjectNameStorageManager} from './manager/SBProjectNameStrageManager';
import {Observable} from 'rxjs/internal/Observable';

const sbRequests: ScrapboxRequest[] = [];

$(window).on('load', function() {
  requestSBPageBySavedProjects();

  $('#app-container').on('DOMSubtreeModified propertychange', function(e) {
    // linesが変更された時にリンクを更新する
    if (e.target.className === 'lines') {
      replaceEmptyLinkIfEnabled();
    }
  });
});

$(window).keyup(function (e) {
  replaceEmptyLinkIfEnabled();
});

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

  // まだ生成されていなかったら、補完用のpopupを生成する
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

  $('.portal-page-button').mousedown( e => {
    console.log('click!!!!!!!', e.target.innerText);
    $(targetEmptyLinkElement).html(
      `<span class="c1">A</span>`
    );
    console.log(targetEmptyLinkElement);
  });
};
