setURL('https://sarah-zimmermann-schmutzler.developerakademie.net/smallest_backend_ever');

let ringColorsOfUser = [];
let marker = 0;
let allTodos;
let allProgress;

/**
 * start loading spinner, load data for board site,
 * get user if logged
 */
async function initBoard() {
   toggleSpinner();
   await downloadFromServer();
   allTasks = JSON.parse(backend.getItem('allTasks')) || [];
   allUsers = JSON.parse(backend.getItem('allUsers')) || [];
   taskID = backend.getItem('taskID') || 0;
   await includeHTML();
   getLoggedUser();
   setRingColors();
   setNavActive('navBoard');
   setTimeout(timeout, 1000); // timeout for loading spinner
   spinnerOff();
}


/**
 * includeHTML of header and navbar 
 */
async function includeHTML() {
   let includeElements = document.querySelectorAll('[w3-include-html]');
   for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html");
      let resp = await fetch(file);
      if (resp.ok) {
         element.innerHTML = await resp.text();
      } else {
         element.innerHTML = 'Page not found';
      }
   }
}


// Section "Search"
let searchTitle;
let searchDescription;
let searchInput = '';
/**
 * filters all matching tasks by title or description
 * unless it is written with lower or upper cases
 */
function filterTasks() {
   marker = 0;
   let filteredTasks = [];
   searchInput = document.getElementById('search-input').value.toLowerCase();
   let length = allTasks.length;

   for (i = 0; i < length; i++) {
      searchTitle = allTasks[i]['title'].toLowerCase();
      searchDescription = allTasks[i]['description'].toLowerCase();
      if (searchTitle.match(searchInput) == searchInput || searchDescription.match(searchInput) == searchInput) {
         filteredTasks.push(allTasks[i]);
         marker = 1;
      }
   }
   updateHTML(filteredTasks);
}


//Btn Add task + (Desktop Version)

/**
 * starts when clicked on Btn on Side or X-btn on AddTask Card
 * opens and closes the add task container template
 */
function toggleAddContainer() {
   document.getElementById('add-task-container').classList.toggle('hide-task-container');
   renderContacts();
}


/**
 * starts when clicked on + on "board"-page (mobile version)
 * directs to addTask
 */
function directToAddTask() {
   window.location.href = 'add_task_board.html';
}


//loading spinner

/**
 * display none loading spinner
 */
function toggleSpinner() {
   document.getElementById('loader').classList.toggle('d-none');
}


/**
 * stop loading spinner
 */
function spinnerOff() {
   myVar = setTimeout(toggleSpinner, 1200);
}


/**
 * delay updateHTML, this is only for showing loading spinner
 */
function timeout() {
   updateHTML(allTasks);
}


// Drag and Drop Functions

let currentDraggedElement;

/**
 * starts dragging and rotates the dragged card 
 * @param {*} id 
 */
function startDragging(id) {
   currentDraggedElement = id;
   document.getElementById(id).classList.add('aslant');
}

/**
 * allows container to drop
 * @param {*} ev 
 */
function allowDrop(ev) {
   ev.preventDefault();
}

/**
 * changes status of dropped task and updates content,
 * saves new status on server
 * @param {*} status 
 */
async function moveTo(status) {
   let currentDraggedTask = allTasks.find(task => task.id == currentDraggedElement);
   currentDraggedTask['status'] = status;
   updateHTML(allTasks);
   await backend.setItem('allTasks', JSON.stringify(allTasks));
}


/**
 * changes status of dropped task and updates content,
 * saves new status on server
 * @param {*} status 
 */
async function moveToMobile(status) {
   let currentDraggedTask = allTasks.find(task => task.id == currentElement);
   currentDraggedTask['status'] = status;
   updateHTML(allTasks);
   await backend.setItem('allTasks', JSON.stringify(allTasks));
}

/**
 * highlights the actual drop container 
 * @param {*} index 
 */
function highlight(index) {
   document.getElementById(index).classList.add('highlight-div');
}

/**
 * removes last highlight
 * @param {*} index 
 */
function removeHighlight(index) {
   document.getElementById(index).classList.remove('highlight-div');
}


// render functions KanbanBoard

/**
 * clears content, find actual status of single task, render content new
 * @param {*} kindOfTasks 
 */
async function updateHTML(kindOfTasks) {
   clearColums();
   removeHighlightedBg();
   allTodos = kindOfTasks.filter(t => t['status'] == 'todo');
   allProgress = kindOfTasks.filter(t => t['status'] == 'progress');
   allAwait = kindOfTasks.filter(t => t['status'] == 'await');
   allDone = kindOfTasks.filter(t => t['status'] == 'done');
   renderKanbanBoard(allTodos, allProgress, allAwait, allDone, kindOfTasks);
}


function clearColums() {
   document.getElementById('todo').innerHTML = '';
   document.getElementById('progress').innerHTML = '';
   document.getElementById('await').innerHTML = '';
   document.getElementById('done').innerHTML = '';
}


function removeHighlightedBg() {
   document.getElementById('todo').classList.remove('highlight-div');
   document.getElementById('progress').classList.remove('highlight-div');
   document.getElementById('await').classList.remove('highlight-div');
   document.getElementById('done').classList.remove('highlight-div');
}


function renderKanbanBoard(allTodos, allProgress, allAwait, allDone, kindOfTasks) {
   renderTodos(allTodos);
   renderProgress(allProgress);
   renderAwait(allAwait);
   renderDone(allDone);
   renderPrio(kindOfTasks);
   renderSubtaskBoard(kindOfTasks);
   renderLetter(kindOfTasks);
}


/**
 * renders all tasks with status "todo"
 * @param {*} allTodos 
 */
function renderTodos(allTodos) {
   for (let i = 0; i < allTodos.length; i++) {
      const element = allTodos[i];
      document.getElementById('todo').innerHTML += generateCardHTML(element);
   }
}


/**
 * renders alls tasks with status "in progress"
 * @param {*} allProgress 
 */
function renderProgress(allProgress) {
   for (let i = 0; i < allProgress.length; i++) {
      const element = allProgress[i];
      document.getElementById('progress').innerHTML += generateCardHTML(element);
   }
}


/**
 * renders all tasks with status "awaiting feedback"
 * @param {*} allAwait 
 */
function renderAwait(allAwait) {
   for (let i = 0; i < allAwait.length; i++) {
      const element = allAwait[i];
      document.getElementById('await').innerHTML += generateCardHTML(element);
   }
}


/**
 * renders all tasks with status "done"
 * @param {*} allDone
 */
function renderDone(allDone) {
   for (let i = 0; i < allDone.length; i++) {
      const element = allDone[i];
      document.getElementById('done').innerHTML += generateCardHTML(element);
   }
}


// render functions TaskCards

/**
 * generates card content
 * @param {*} element 
 * @returns 
 */
function generateCardHTML(element) {
   let elementTitle = element['title'];
   let elementTitleLower = elementTitle.toLowerCase();
   let elementDescription = element['description'];
   let elementDescriptionLower = elementDescription.toLowerCase();
   let searchPositionTitle = elementTitleLower.search(searchInput);
   let searchPositionDescription = elementDescriptionLower.search(searchInput);
   let length = searchInput.length;
   if (searchPositionTitle >= 0 && marker == 1) {
      let markerTextTitle = elementTitle.substr(searchPositionTitle, length);
      let behindTextTitle = elementTitle.substr(searchPositionTitle + length,);
      let beforeTextTitle = '';
      if (searchPositionTitle > 0) beforeTextTitle = elementTitle.slice(0, searchPositionTitle);
      elementTitle = beforeTextTitle + '<mark>' + markerTextTitle + '</mark>' + behindTextTitle;
   }
   if (searchPositionDescription >= 0 && marker == 1) {
      let markerTextDescription = elementDescription.substr(searchPositionDescription, length);
      let behindTextDescription = elementDescription.substr(searchPositionDescription + length,);
      let beforeTextDescription = '';
      if (searchPositionDescription > 0) {
      }
      elementDescription = beforeTextDescription + '<mark>' + markerTextDescription + '</mark>' + behindTextDescription;
   }
   return renderCardHTML(element, elementTitle, elementDescription);
}


/**
 * render prio sign
 * @param {*} kindOfTasks 
 */
function renderPrio(kindOfTasks) {
   for (let i = 0; i < kindOfTasks.length; i++) {
      const element = kindOfTasks[i];
      if (element['priority'] == 1) document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/low-arrow.svg";
      if (element['priority'] == 2) document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/medium_equal.svg";
      if (element['priority'] == 3) document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/urgent-arrow.svg";
      if (element['status'] === 'done') document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/check-black.png";
   }
}


/**
 * renders subtasks if they are set 
 * @param {*} kindOfTasks 
 */
function renderSubtaskBoard(kindOfTasks) {
   for (i = 0; i < kindOfTasks.length; i++) {
      let subDone = 0;
      let progress = 5;
      const element = kindOfTasks[i]
      const length = element['subtasks']['subtasks'].length;
      for (j = 0; j < length; j++) {
         if (element['subtasks']['subtasks'][j]['subStatus'] === 'done') {
            subDone += 1;
         }
      }
      if (length > 0) {
         document.getElementById(`subtask-${element['id']}`).classList.remove('d-none');
         document.getElementById(`doneCounter-${element['id']}`).innerHTML = `${subDone}/${length} Done`;
      }
      if (subDone > 0) {
         progress = subDone * 100 / length;
         document.getElementById(`progressbar-blue-${element['id']}`).setAttribute('style', `width:${progress}%`);
      }
   }
}


/**
 * finds teammembers of a task and there first name capitals,
 * finds teammember color, render color rings with capitals or digit if more then 3 members
 */
function renderLetter(kindOfTasks) {
   for (let i = 0; i < kindOfTasks.length; i++) {
      const element = kindOfTasks[i];
      let teamLength = element['assigned']['assigned'].length; //5
      let teamMember = [];   //Array of IDs of team members

      for (let j = 0; j < teamLength; j++) {
         let memberID = element['assigned']['assigned'][j];
         teamMember.push(memberID);
      }

      kLenght = teamMember.length;
      if (kLenght > 3) { kLenght = 3 }
      for (let k = 0; k < kLenght; k++) {
         let memberName = allUsers.find(el => el.id == teamMember[k]);
         memberName = memberName['name'];
         let capitals = getCapitals(memberName);
         document.getElementById(`team-circle-${k + 1}-${element['id']}`).innerHTML = capitals;
         document.getElementById(`team-circle-${k + 1}-${element['id']}`).classList.remove('d-none');
         let position = findIndexOf(memberName);
         userColor = ringColorsOfUser[position];
         document.getElementById(`team-circle-${k + 1}-${element['id']}`).style.backgroundColor = userColor;
      }

      if (teamMember.length > 3) {
         plusSign = teamMember.length - 2;
         plusSign = '+' + plusSign;
         document.getElementById(`team-circle-3-${element['id']}`).innerHTML = plusSign;
         document.getElementById(`team-circle-3-${element['id']}`).style.background = "#2A3647";
      }
   }
}


/**
 * splits first capitals from rest of name
 * @param {*} memberName 
 * @returns 
 */
function getCapitals(memberName) {
   return memberName.split(' ').map(word => word[0]).join('');
}


/**
 * finds position of member in allUsers array
 * @param {*} memberName 
 * @returns 
 */
function findIndexOf(memberName) {
   for (let l = 0; l < allUsers.length; l++) {
      if (allUsers[l].name === memberName) {
         return l;
      }
   }
}


/**
 * set ring color of user by random
 */
function setRingColors() {
   for (let i = 0; i < allUsers.length; i++) {
      var color = getRandomColor();
      ringColorsOfUser.push(color);
   }
}


/**
 * get a random color in hex code
 * @returns color 
 */
function getRandomColor() {
   var letters = '0123456789ABCDEF';
   var color = '#';
   for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
}