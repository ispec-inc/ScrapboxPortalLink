import * as $ from 'jquery';
import {Page} from '../model/page';
import {PageList} from '../model/page_list';

export class ScrapboxRequest {

  static scrapboxBaseUrl: string = 'https://scrapbox.io/';

  projectName: string;
  pageList: PageList = new PageList();

  constructor(projectName: string, callBack: () => void) {
    this.projectName = projectName;

    const self = this;
    $.getJSON(`https://scrapbox.io/api/pages/${this.projectName}?limit=500`, function (json) {
      self.pageList = new PageList(json);
      callBack();
    });
  }

  public pageUrl(title: string): string | null {
    if (this.pageList.hasPage(title)) {
      return `${ScrapboxRequest.scrapboxBaseUrl}${this.projectName}/${title}`;
    }

    return null;
  }

  public likePage(title: string): string[] {
    let pageNames: string[] = [];

    this.pageList.pages.forEach(page => {
      if (page.title.indexOf(title)) {
        pageNames.push(page.title);
      }
    });

    return pageNames;
  }
}
