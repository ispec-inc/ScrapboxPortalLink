import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';

let scbRequest = new ScrapboxRequest(function () {});

$(window).on('load', function() {
  setTimeout(function () {
    scbRequest = new ScrapboxRequest(function () {
      console.log('first!');
      replaceEmptyLinkIfEnabled();
    });
  }, 1000);
});


$(window).keydown(function(e) {
  replaceEmptyLinkIfEnabled();
});

function replaceEmptyLinkIfEnabled(): void {
  const emptyPageElements = findEmptyPageLink();

  console.log(emptyPageElements);

  emptyPageElements.forEach(element => {
    const pageTitle = element.innerText;
    const pageLink = scbRequest.pageUrl(pageTitle);

    if (pageLink) {
      element.setAttribute('href', pageLink);
      element.classList.add('portal-page-link');
    }
  });
}

function findEmptyPageLink(): HTMLElement[] {
  return $('.empty-page-link').get();
}

