import {Link} from './link';

export class PageDetail {
  id: string;
  title: string;
  image: string;
  user: string;
  pin: number;
  views: number;
  linked: number;
  commitId: string;
  created: number;
  updated: number;
  accessed: number;
  links: string[];
  relatedPages: RelatedPages;

  constructor(data: any) {
    this.id = 'id' in data ? data.id : '';
    this.title = 'title' in data ? data.title : '';
    this.image = 'image' in data ? data.image : '';
    this.user = 'user' in data ? data.user : '';
    this.pin = 'pin' in data ? data.pin : 0;
    this.views = 'views' in data ? data.views : 0;
    this.linked = 'linked' in data ? data.linked : 0;
    this.commitId = 'commitId' in data ? data.commitId : '';
    this.created = 'created' in data ? data.created : 0;
    this.updated = 'updated' in data ? data.updated : 0;
    this.accessed = 'accessed' in data ? data.accessed : 0;
    this.links = 'links' in data ? data.links : [];
    this.relatedPages = new RelatedPages(data.relatedPages);
  }
}

export class RelatedPages {
  links1hop: Link[];
  links2hop: Link[];

  constructor(data: any) {
    this.links1hop = 'links1hop' in data ? data.links1hop : [];
    this.links2hop = 'links2hop' in data ? data.links2hop : [];
  }
}
