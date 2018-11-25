// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import * as $ from 'jquery';

$('#go-to-options').click(function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

