// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'
import * as $ from 'jquery';
import {SBProjectNameStorageManager} from './manager/SBProjectNameStrageManager';

$(window).on('load', function() {
  reloadRegiserProjectName();
});

let currentProjectNames: string[] = [];

const reloadRegiserProjectName = function() {
  $('.registered-project').remove();

  SBProjectNameStorageManager.getProjectNames(function (projectNames) {
    if (projectNames) {
      currentProjectNames = projectNames;
      projectNames.forEach(projectName => {
        $('.registered-projects').append(`<li class="registered-project">${projectName}</li>`);
      });
    }
  });
};

const registerProject = function (inputElementId: string) {
  const nameInput = $(`#${inputElementId}`);
  const name = nameInput.val();

  if (typeof name === 'string') {
    currentProjectNames.push(name);
    SBProjectNameStorageManager.setProjectNames(currentProjectNames, function () {
      reloadRegiserProjectName();
    });
  }

  nameInput.val('');
};


// Actions
$('#project-register-button').click(function () {
  registerProject('projectNameInput');
});
