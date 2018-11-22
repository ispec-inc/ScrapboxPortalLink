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

  emptyPageElements.forEach(element => {
    const validateTitle = element.innerText.match(/\[(.+)\]/);
    let isEditing: boolean = false;
    let pageTitle: string = element.innerText;

    if (validateTitle) {
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

    candidatePageNames.forEach(pageName => {
      const currentCandidates = $('.button-container').children('div');
      for (let i = 0; i < currentCandidates.length; i++) {
        if (currentCandidates.get(i).innerText === pageName) {
          return;
        }
      }

      $('.button-container').append(`<div class="button">${pageName}</div>`);
    });
  });
};

const findEmptyPageLink = function(): HTMLElement[] {
  return $('.empty-page-link').get();
};
