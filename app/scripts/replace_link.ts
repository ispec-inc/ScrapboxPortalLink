import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';

const scbRequest = new ScrapboxRequest();

$(window).keydown(function(e) {
  const emptyPageElements = findEmptyPageLink();

  emptyPageElements.forEach(element => {
    console.log(element.innerText);
  });
});

function findEmptyPageLink(): HTMLElement[] {
  return $('.empty-page-link').get();
}
