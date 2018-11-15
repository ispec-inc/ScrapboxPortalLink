
export class SBProjectNameStorageManager {

  public static getProjectNames(callback: (projectNames: string[]) => void) {
    chrome.storage.sync.get(
      'projectNames',
      function (item) {
        callback(item.projectNames);
      };
  }

  public static setProjectNames(name: string, callback: () => void) {
    chrome.storage.sync.set({'projectNames': name}, function () {
      callback();
    });
  }
}
