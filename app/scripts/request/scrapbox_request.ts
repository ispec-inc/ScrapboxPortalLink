import * as $ from 'jquery';
import {Page} from '../model/page';
import {PageList} from '../model/page_list';
import {PageDetail, RelatedPages} from '../model/pageDetail';
import {Observable} from 'rxjs';
import {Link} from '../model/link';
import {observable} from 'rxjs/internal-compatibility';
import {Observer} from 'rxjs/internal/types';

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

  public requestRelatedPages(title: string): Observable<Link[]> {
    const projectName = this.projectName;

    return Observable.create(function (observer: Observer<Link[]>) {
      $.getJSON(`https://scrapbox.io/api/pages/${projectName}/${title}`, json => {
        const pageDetail = new PageDetail(json);
        observer.next(pageDetail.relatedPages.links1hop);
        observer.complete();
      });
    });
  }

  public pageUrl(title: string): string | null {
    if (this.pageList.hasPage(title)) {
      return `${ScrapboxRequest.scrapboxBaseUrl}${this.projectName}/${title}`;
    }

    return null;
  }

  public likePage(title: string): string[] {
    return this.pageList.likePage(title);
  }
}
