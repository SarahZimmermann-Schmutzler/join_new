setURL('https://sarah-zimmermann-schmutzler.developerakademie.net/smallest_backend_ever');

let editPrio;

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
 * renderEditCard
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
    }
    else {
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
