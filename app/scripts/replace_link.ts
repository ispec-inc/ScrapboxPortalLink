import * as $ from 'jquery';
import { ScrapboxRequest } from './request/scrapbox_request';

console.log('hellooooooo');
const scbRequest = new ScrapboxRequest();

$(window).keydown(function(e) {
  const emptyPageElements = findEmptyPageLink();
});

function findEmptyPageLink(): object[] {
  return $('.empty-page-link').get();
}
