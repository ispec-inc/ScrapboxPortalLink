import * as $ from 'jquery';
import {Page} from '../model/page';
import {Pagelist} from '../model/page_list';

export class ScrapboxRequest {

  constructor() {

    $.getJSON('https://scrapbox.io/api/pages/help-jp', function (json) {
      // const pages: Pagelist = JSON.parse(json) as Pagelist;
      // console.log('gettteeed', pages);

      console.log(json);

      let pageList = $.extend(new Pagelist(), json);

      console.log(pageList);
    });
  }
}
