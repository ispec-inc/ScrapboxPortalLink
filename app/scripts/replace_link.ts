import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';

const scbRequest = new ScrapboxRequest();

$(window).keydown(function(e) {
  const emptyPageElements = findEmptyPageLink();

  emptyPageElements.forEach(element => {
    const pageTitle = element.innerText;
    const pageLink = scbRequest.pageUrl(pageTitle);
    console.log(pageLink);
  });
});

function findEmptyPageLink(): HTMLElement[] {
  return $('.empty-page-link').get();
}
