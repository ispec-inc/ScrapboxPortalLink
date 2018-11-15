
export class SBProjectNameStorageManager {

  public static getProjectNames(callback: (projectNames: string[]) => void) {
    chrome.storage.sync.get(
      'projectNames',
      function (item) {
        callback(item.projectNames);
      });
  }

  public static setProjectNames(names: string[], callback: () => void) {
    chrome.storage.sync.set({'projectNames': names}, function () {
      callback();
    });
  }
}
