import * as $ from 'jquery';
import {Page} from '../model/page';
import {PageList} from '../model/page_list';

export class ScrapboxRequest {

  pageList: PageList = new PageList();

  constructor() {
    $.getJSON('https://scrapbox.io/api/pages/help-jp', function (json) {
      this.pageList = $.extend(new PageList(), json);
    });
  }
}
