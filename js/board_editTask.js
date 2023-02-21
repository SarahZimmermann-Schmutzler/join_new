setURL('https://sarah-zimmermann-schmutzler.developerakademie.net/smallest_backend_ever');

let editPrio;
let currentElement;

// big-TaskCard-view after clicked on the TaskCards

/**
* starts when clicked on a TaskCard
* opens big TaskCard and if a subtask is set => check/uncheck
* @param {*} showTaskID 
*/
function showTaskBig(showTaskID) {
    currentElement = showTaskID;
    document.getElementById('show-task').classList.remove('d-none');
    const element = allTasks.find(el => el.id == showTaskID);
    document.getElementById('show-category').innerHTML = element['category'];
    document.getElementById('show-category').style.backgroundColor = element['categoryColor'];
    document.getElementById('show-title').innerHTML = element['title'];
    document.getElementById('show-description').innerHTML = element['description'];
    document.getElementById('show-date').innerHTML = element['dueDate'];
    renderShowPriority(element);
    renderShowAssigned(element);
    renderShowSubtasks(element);
 }
 
 
 /**
  * renders "priority" on big TaskCard 
  * @param {*} element 
  */
 function renderShowPriority(element) {
    let backgroundColr;
    let text;
    let sign;
 
    if (element['priority'] == 1) {
       backgroundColr = "#7AE229"
       sign = './assets/img/board/arrows-down-white.png';
       text = 'Low';
    }
 
    if (element['priority'] == 2) {
       backgroundColr = "#FFA800";
       sign = './assets/img/board/equal-sign-white.png';
       text = 'Medium';
    }
 
    if (element['priority'] == 3) {
       backgroundColr = "#FF3D00";
       sign = './assets/img/board/arrows-up-white.png';
       text = 'Urgent';
    }
    document.getElementById('show-priority').style.backgroundColor = backgroundColr;
    document.getElementById('show-priority').innerHTML = text + `<img src="${sign}" alt="">`;
 }
 
 
 /**
  * renders "assigned on" big TaskCard 
  * @param {*} element
  */
 function renderShowAssigned(element) {
    document.getElementById('show-assigned').innerHTML = '';
 
    for (i = 0; i < element['assigned']['assigned'].length; i++) {
       let memberID = element['assigned']['assigned'][i];
       teamMember = allUsers.find(el => el.id == memberID).name;
       let memberCapitals = getCapitals(teamMember)
       let position = findIndexOf(teamMember);
       let userColor = ringColorsOfUser[position];
       document.getElementById('show-assigned').innerHTML += renderShowAssignedHTML(userColor, memberCapitals, teamMember);
    }
 }
 
 
 /**
  * render subtasks on big show card
  * @param {*} element 
  */
 function renderShowSubtasks(element) {
    document.getElementById('show-subtask-list').innerHTML = '';
    let subtaskLength = element['subtasks']['subtasks'].length;
    if (subtaskLength > 0) {
       document.getElementById('show-subtask-container').classList.remove('d-none');
 
       for (i = 0; i < subtaskLength; i++) {
          let subtaskStatus = element['subtasks']['subtasks'][i]['subStatus'];
          let checkBox = "./assets/img/board/checkbox-unchecked.png";
          if (subtaskStatus == 'done') { checkBox = "./assets/img/board/checkbox-checked.png" }
          document.getElementById('show-subtask-list').innerHTML += renderShowSubtasksHTML(element, checkBox, i);
       }
    }
    else {
       document.getElementById('show-subtask-container').classList.add('d-none');
    }
 }
 
 
 /**
  * checks if subtasks is open or done
  * @param {*} taskID 
  * @param {*} subtaskID 
  */
 async function checkSubtask(taskID, subtaskID) {
    const element = allTasks.find(el => el.id == taskID);
    if (element['subtasks']['subtasks'][subtaskID]['subStatus'] == 'open') {
       element['subtasks']['subtasks'][subtaskID]['subStatus'] = 'done';
    } else {
       element['subtasks']['subtasks'][subtaskID]['subStatus'] = 'open';
    }
    renderShowSubtasks(element);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
 }
 
 
 /**
  * starts when clicked on X on big TaskCard or EditCard
  * closes card 
  * @param {*} cardName 
  */
 function closeCard(cardName) {
    document.getElementById(cardName).classList.add('d-none');
    document.getElementById('edit-assigned-container').classList.remove('pullDown');
    document.getElementById('search-input').value = '';
    marker = 0;
    updateHTML(allTasks);
 }


// EditCard-view after clicking on pencil-btn on big TaskCard

/**
 * opens EditCard for workin on task
 */
function openEditCard() {
    document.getElementById('edit-card').classList.remove('d-none');
    closeCard('show-task');
    renderEditCard();
}

/**
 * renders EditCard
 */
function renderEditCard() {
    let element = allTasks.find(task => task.id == currentElement);
    document.getElementById('edit-title').value = element['title'];
    document.getElementById('edit-description').value = element['description'];
    document.getElementById('edit-date').value = element['dueDate'];
    renderEditPrio(element);
    renderEditAssigned(element);
    renderEditRings(element);
}


/**
 * renders edit priority
 * @param {*} element 
 */
function renderEditPrio(element) {
    let prio = element['priority'];
    setPrioColor(prio);
}


/**
 * sets prio color of EditCard
 * @param {*} prio 
 */
function setPrioColor(prio) {
    setPrioColorBg();
    if (prio == 1) {
        setPrioColorOne();
    }
    if (prio == 2) {
        setPrioColorTwo();
    }
    if (prio == 3) {
        setPrioColorThree();
    }
}


function setPrioColorBg() {
    document.getElementById('edit-prio-1').style = "background-color:#fff; color:black";
    document.getElementById('edit-prio-1-img').src = "./assets/img/board/arrows-down-green.png";
    document.getElementById('edit-prio-2').style = "background-color:#fff; color:black";
    document.getElementById('edit-prio-2-img').src = "./assets/img/board/equal-sign-orange.png";
    document.getElementById('edit-prio-3').style = "background-color:#fff; color:black";
    document.getElementById('edit-prio-3-img').src = "./assets/img/board/arrows-up-red.png";
}


function setPrioColorOne() {
    document.getElementById('edit-prio-1').style = "background-color:#7AE229; color:white";
    document.getElementById('edit-prio-1-img').src = "./assets/img/board/arrows-down-white.png";
}


function setPrioColorTwo() {
    document.getElementById('edit-prio-2').style = "background-color:#FFA800; color:white";
    document.getElementById('edit-prio-2-img').src = "./assets/img/board/equal-sign-white.png";
}


function setPrioColorThree() {
    document.getElementById('edit-prio-3').style = "background-color:#FF3D00; color:white";
    document.getElementById('edit-prio-3-img').src = "./assets/img/board/arrows-up-white.png";
}



/**
 * starts when clicked on new prio on EditCard
 * sets new priority
 * @param {*} prio 
 */
function editSetNewPrio(prio) {
    editPrio = prio;
    setPrioColor(prio);
}


/**
 * renders "assigned to" on EditCard
 * @param {*} element 
 */
function renderEditAssigned(element) {
    let length = allUsers.length;
    document.getElementById('edit-allUsers').innerHTML = '';
    for (i = 0; i < length; i++) {
        let userName = allUsers[i]['name'];
        let userID = allUsers[i]['id'];
        let checkedStatus = 'unchecked';
        let assignedLength = element['assigned']['assigned'].length;
        for (j = 0; j < assignedLength; j++) {
            if (element['assigned']['assigned'][j] == userID) {
                checkedStatus = 'checked';
                break;
            }
        }
        document.getElementById('edit-allUsers').innerHTML += renderEditAssignedHTML(userName, userID, checkedStatus);
    }
}


function renderEditAssignedHTML(userName, userID, checkedStatus) {
    return /*html*/ `
    <div class="edit-assigned-user-line">
       <div>${userName}</div>
       <input type="checkbox" id="edit-assigned-userID-${userID}" ${checkedStatus}>
    </div>
    `;
}


/**
 * starts when clicked on arrow-btn in category assigned to
 * opens drop down menu
 */
function pullDown() {
    document.getElementById('edit-assigned-container').classList.toggle('pullDown');
    document.getElementById('pullDownArrow').classList.toggle('rotateZ');
}


/**
 * renders Rings of EditCard
 * @param {*} element 
 */
function renderEditRings(element) {
    document.getElementById('edit-ring-container').innerHTML = '';
    for (i = 0; i < element['assigned']['assigned'].length; i++) {
        let memberID = element['assigned']['assigned'][i];
        teamMember = allUsers.find(el => el.id == memberID).name;
        let memberCapitals = getCapitals(teamMember)
        let position = findIndexOf(teamMember);
        let userColor = ringColorsOfUser[position];
        document.getElementById('edit-ring-container').innerHTML += /*html*/ `
       <div class="edit-ring" style="background-color:${userColor}">${memberCapitals}</div>
       `;
    }
}


/**
 * starts when clicked on arrow-btn in category change Status (responsive view)
 * opens drop down menu
 */
function pullDownStatus() {
    document.getElementById('edit-change-container').classList.toggle('pullDown');
    document.getElementById('pull-down-arrow').classList.toggle('rotateZ');
}


/**
 * saves changes on EditCard and closes EditCard 
 */
async function saveEditTask() {
    let validationStatus = 0;
    const element = allTasks.find(el => el.id == currentElement);
    let editTitle = document.getElementById('edit-title').value;
    let editDescription = document.getElementById('edit-description').value;
    dueDate = document.getElementById('edit-date').value;
    let editDueStatus = checkDate();
    let editAssigned = checkEditAssigned();
    validationStatus = formValidationOfEditTask(editTitle, editDescription, editDueStatus, editAssigned);
    if (validationStatus == 1) {
        element['title'] = editTitle;
        element['description'] = editDescription;
        element['dueDate'] = dueDate;
        element['priority'] = editPrio;
        element['assigned']['assigned'] = editAssigned;
        await backend.setItem('allTasks', JSON.stringify(allTasks));
        closeCard('edit-card');
    }
}


/**
 *  validates edited task
 * @param {*} editTitle 
 * @param {*} editDescription 
 * @param {*} editDueStatus 
 * @param {*} editAssigned 
 * @returns 
 */
function formValidationOfEditTask(editTitle, editDescription, editDueStatus, editAssigned) {
    if (editTitle == "") {
        requiredText('8');
        return 0;
    } else if (editDescription == "") {
        requiredText('9');
        return 0;
    } else if (editAssigned.length <= 0) {
        requiredText('11');
        return 0;
    } else if (editDueStatus == false) {
        requiredText('10');
        return 0;
    } else {
        return 1
    }
}


/**
 * checks who is now member of task team 
 * @returns new team
 */
function checkEditAssigned() {
    let team = [];
    for (i = 0; i < allUsers.length; i++) {
        let status = document.getElementById(`edit-assigned-userID-${i}`).checked;
        if (status) {
            team.push(i);
        }
    }
    return team
}
