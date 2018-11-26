
export class Link {

  id: string;
  title: string;
  titleLc: string;
  image: string;
  descriptions: string[];
  linksLc: string[];
  updated: number;
  accessed: number;

  constructor(data: any) {
    this.id = 'id' in data ? data.id : '';
    this.title = 'title' in data ? data.title : '';
    this.titleLc = 'titleLc' in data ? data.titleLc : '';
    this.image = 'image' in data ? data.image : '';
    this.descriptions = 'descriptions' in data ? data.descriptions : [];
    this.linksLc = 'linksLc' in data ? data.linksLc : [];
    this.updated = 'updated' in data ? data.updated : 0;
    this.accessed = 'accessed' in data ? data.accessed : 0;
  }
}
