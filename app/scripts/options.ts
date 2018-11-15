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
        $('.registered-projects')
          .append(`<li class="registered-project"><i class="far fa-times-circle project-remove-button"></i>${projectName}</li>`);
      });

      $('.project-remove-button').click(function (event) {
        const projectNameLIElement = $(event.target).parent();
        removeProject(projectNameLIElement.text());
      });
    }
  });
};

const registerProjectName = function (inputElementId: string) {
  const nameInput = $(`#${inputElementId}`);
  const name = nameInput.val();
  nameInput.val('');

  if (typeof name === 'string') {
    currentProjectNames.push(name);
    setProjectNamesAndReload();
  }
};

const removeProject = function(name: string) {
  currentProjectNames = currentProjectNames.filter(oldName => oldName !== name);
  setProjectNamesAndReload();
};

const setProjectNamesAndReload = function(): void {
  SBProjectNameStorageManager.setProjectNames(currentProjectNames, function () {
    reloadRegiserProjectName();
  });
};



// Actions
$('#project-register-button').click(function () {
  registerProjectName('project-name-input');
});

$('#project-name-input').keypress(function (e) {
  if (e.which === 13) {
    registerProjectName('project-name-input');
  }
});
