import * as $ from 'jquery';

export class ScrapboxRequest {

  init() {
    $.getJSON('https://scrapbox.io/api/pages/help-jp/API', function (json) {
      console.log('gettteeed', json);
    });
  }
}
