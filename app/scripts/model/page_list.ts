import {Page} from './page';

export class PageList {
  skip: number;
  limit: number;
  count: number;
  pages: Page[];

  public hasPage(title: string): boolean {
    for (const page of this.pages) {
      if (page.title === title) {
        return true;
      }
    }

    return false;
  }

}
