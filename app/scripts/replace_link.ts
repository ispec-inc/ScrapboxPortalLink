import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';
import {SBProjectNameStorageManager} from './manager/SBProjectNameStrageManager';

const sbRequests: ScrapboxRequest[] = [];

$(window).on('load', function() {

  SBProjectNameStorageManager.getProjectNames(function (projectNames: string[]) {
    projectNames.forEach(function (name: string) {
      const scbRequest = new ScrapboxRequest(name, function () {
        replaceEmptyLinkIfEnabled();
      });

      sbRequests.push(scbRequest);
    });
  });

  // linesが変更された時にリンクを更新する
  $('#app-container').on('DOMSubtreeModified propertychange', function(e) {
    if (e.target.className === 'lines') {
      replaceEmptyLinkIfEnabled();
    }
  });
});

const replaceEmptyLinkIfEnabled = function(): void {
  const emptyPageElements = findEmptyPageLink();

  emptyPageElements.forEach(element => {
    const pageTitle = element.innerText;

    for (const sbRequest of sbRequests) {
      const pageLink = sbRequest.pageUrl(pageTitle);

      if (pageLink) {
        element.setAttribute('href', pageLink);
        element.classList.add('portal-page-link');
        break;
      }
    }
  });
};

const findEmptyPageLink = function(): HTMLElement[] {
  return $('.empty-page-link').get();
};

// actions
$(window).keydown(function(e) {
  replaceEmptyLinkIfEnabled();
});

