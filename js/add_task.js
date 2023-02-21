setURL('https://sarah-zimmermann-schmutzler.developerakademie.net/smallest_backend_ever');

let allTasks = [];
let prio = 0;
let category = '';
let categoryColor = '';
let assigned = [];
let subtaskID = 2;
let dueDate;
let taskID;
let validation = 0;


/**
 * load data from Server,
 * set arrays, include Header and Navbar,
 * set menu button on active,
 * render contact list
 */
async function initAddTask() {
   await downloadFromServer();
   allUsers = JSON.parse(backend.getItem('allUsers')) || [];
   allTasks = JSON.parse(backend.getItem('allTasks')) || [];
   taskID = backend.getItem('taskID') || 0;
   await includeHTML();
   getLoggedUser();
   setNavActive('navAddTask');
   renderContacts();
}


/**
 * includeHTML
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


/**
 * starts onload when "addTask", "board", "summary"-page is opened
 * fetches the currentUser from the local storage
 */
function getLoggedUser() {
   currentUser = JSON.parse(localStorage.getItem('logged User') || '9999');
   if (currentUser == '9999') {
      return;
   } else {
      document.getElementById('headerUserImg').src = "./assets/img/header/christina.png";
   }
}


//form validation

/**
 * starts when clicked on the create-task-btn
 * validates the inputs,
 * if true increases validationIndex else calls required text function
 */
function formValidation() {
   let vtitle = document.getElementById('add-title').value;
   let vdescription = document.getElementById('add-description').value;
   let vdate = document.getElementById('add-date').value;
   assigned = checkAssigned();
   dueDate = document.getElementById('add-date').value;
   let d = checkDate();
   validateField(vtitle, '1');
   validateField(vdescription, '2');
   validateField(category, '3');
   validateAssigned(assigned, '4');
   validateField(vdate, '5');
   validatePrio(prio, '6');
   validateDate(d, '7');
   validationResult(validation);
   validation = 0;
}


function validateField(fieldValue, fieldNumber) {
   if (fieldValue === '') requiredText(fieldNumber);
   else {
      validation ++;
      document.getElementById(`required-titel-${fieldNumber}`).classList.add('d-none');
   }
}


function validateAssigned(fieldValue, fieldNumber) {
   if (fieldValue.length < 1) requiredText(fieldNumber);
   else {
      validation ++;
      document.getElementById(`required-titel-${fieldNumber}`).classList.add('d-none');
   }
}


function validatePrio(fieldValue, fieldNumber) {
   if (fieldValue == 0) requiredText(fieldNumber);
   else {
      validation ++;
      document.getElementById(`required-titel-${fieldNumber}`).classList.add('d-none');
   }
}


function validateDate(fieldValue, fieldNumber) {
   if (fieldValue == false) requiredText(fieldNumber);
   else {
      validation ++;
      document.getElementById(`required-titel-${fieldNumber}`).classList.add('d-none');
   }
}


function validationResult(fieldValue) {
   if (fieldValue == 7) {
      document.getElementById('taskAddedMessage').classList.add('taskAddedMessageOut')
      addTask();
   }
}


/**
 * shows "this field is required" as part of form validation
 */
function requiredText(index) {
   document.getElementById(`required-titel-${index}`).classList.remove('d-none');
}


/**
 * validates if dueDate is larger then today
 */
function checkDate() {
   var toDate = new Date();
   if (new Date(dueDate).getTime() <= toDate.getTime() || dueDate === '') {
      return false;
   }
   return true;
}

/**
 * checks which user is assigned to task
 */
function checkAssigned() {
   let team = [];
   for (i = 0; i < allUsers.length; i++) {
      let status = document.getElementById(`userID-${i}`).checked;
      if (status) {
         team.push(i);
      }
   }
   return team
}


//creating a task

/**
 * add new task to allTasks array and save it on server,
 * increase TaskID and save it on server,
 * redirects to board html
 */
async function addTask() {
   let task = taskContent();
   allTasks.push(task);
   await backend.setItem('allTasks', JSON.stringify(allTasks));
   await backend.setItem('taskID', taskID);
   setTimeout(() => { window.location.href = 'board.html' }, 2000);
}


function taskContent() {
   let title = document.getElementById('add-title').value;
   let description = document.getElementById('add-description').value;
   let subtasks = checkSubtasks();
   taskID = allTasks.length;
   return {
      'id': taskID,
      'title': title,
      'description': description,
      'status': 'todo',
      'dueDate': dueDate,
      'priority': prio,
      'category': category,
      'categoryColor': categoryColor,
      'assigned': {
         assigned
      },
      'subtasks': {
         subtasks
      }
   };
}


/**
 * gets which subtask is checked,
 * pushes it to actual subtask array
 */
function checkSubtasks() {
   let subs = [];
   for (i = 1; i < subtaskID + 1; i++) {
      checkedSub = document.getElementById(`subtask-${i}`).checked;
      subTaskText = document.getElementById(`subtask-${i}`).nextElementSibling.innerText;
      if (checkedSub) {
         let subPush = subtaskContent();
         subs.push(subPush)
      }
   }
   return subs;
}


function subtaskContent() {
   return {
      'subID': i,
      'subTaskText': subTaskText,
      'subStatus': 'open'
   }
}


//clear the form insteat of create task

/**
 * starts when clicked on X-btn
 * clears form 
*/
function clearForm() {
   document.getElementById('add-title').value = '';
   document.getElementById('add-description').value = 'Enter a Description';
   dueDate = document.getElementById('add-date').value = '';
   for (i = 1; i < 4; i++) {
      document.getElementById(`prio-${i}`).style.background = "white";
      document.getElementById(`prio-${i}`).classList.remove('prio-active');
   }
   loadCategories('Select task Category', '#fff');
   document.getElementById('assign').classList.remove('open-category');
   resetSubtask();
}


/**
 * resets subtaskID
 */
function resetSubtask() {
   subtaskID = 2;
   document.getElementById('subtask-container').innerHTML = '';
   document.getElementById('subtask-container').innerHTML = subtaskHTML();
   renderSubtask();
}


function subtaskHTML() {
   return /*html*/ `<div><input type="checkbox" id="subtask-1"><span>Inform Customer Support</span></div>
   <div> <input type="checkbox" id="subtask-2"><span>Send marketing paper</span></div>`;
}


/**
* renders clean innerHTML for new subtask field
*/
function renderSubtask() {
   document.getElementById('addNewSubtask').innerHTML = '';
   document.getElementById('addNewSubtask').innerHTML = renderSubtaskHTML();
}


function renderSubtaskHTML() {
   return `<div class="subButton">
   <button type="button" onclick="addNewSubtask()">Add new subtask</button></div>`;
}


//mobile AddTask Version

/**
 * starts when clicked on x (AddTask mobile Version)
 * directs back to "board"-page
 */
function backToBoard() {
   window.location.href = 'board.html';
}