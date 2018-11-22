import {Page} from './page';

export class PageList {
  skip: number;
  limit: number;
  count: number;
  pages: Page[];

  constructor(json: any = {}) {
    this.skip = 'skip' in json ? json.skip : 0;
    this.limit = 'limit' in json ? json.limit : 0;
    this.count = 'count' in json ? json.count : 0;
    this.pages = 'pages' in json ? json.pages : [];
  }

  public hasPage(title: string): boolean {
    for (const page of this.pages) {
      if (page.title === title) {
        return true;
      }
    }

    return false;
  }

  public likePage(title: string): string[] {
    let pageNames: string[] = [];

    this.pages.forEach(page => {
      if (new RegExp(title).test(page.title)) {
        pageNames.push(page.title);
      }
    });

    return pageNames;
  }

}
