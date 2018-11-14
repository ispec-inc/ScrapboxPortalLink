import * as $ from 'jquery';
import {Page} from '../model/page';
import {PageList} from '../model/page_list';

export class ScrapboxRequest {

  static scrapboxBaseUrl: string = '';

  projectName: string;
  pageList: PageList = new PageList();

  constructor() {
    this.projectName = 'help-jp';
    $.getJSON(`https://scrapbox.io/api/pages/${this.projectName}`, function (json) {
      this.pageList = $.extend(new PageList(), json);
    });
  }

  public pageUrl(title: string): string | null {
    if (this.pageList.hasPage(title)) {
      return this.projectName + title;
    }

    return null;
  }
}
