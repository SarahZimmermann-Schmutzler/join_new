setURL('https://sarah-zimmermann-schmutzler.developerakademie.net/smallest_backend_ever');


//section "descriptions"

/**
 * deletes placeholder text in descriptions-textarea
 * (annot. Sarah: function not nesseccary, field clears placeholder automatically)
 */
function clearContent() {
    if (document.getElementById('add-description').value == 'Enter a Description') {
        document.getElementById('add-description').value = '';
    }
}


// section "category"

/**
*select a standard category  
*/
function selectCategory(index) {
    let color = ``;
    category = index;
    if (index == 'Sales') {
        color = `<div class="ring purple"></div>`;
        categoryColor = '#da70d6';
    }
    if (index == 'Backoffice') {
        color = `<div class="ring green"></div>`;
        categoryColor = '#20b2aa';
    }
    sel = index + color;
    document.getElementById('selected-category').innerHTML = sel;
    document.getElementById('categories').classList.remove('open-category');
}


/**
 * opens dropdown menu and close other when opened
 */
function pullDownMenu(index, closeDex) {
    document.getElementById(index).classList.toggle('open-category');
    document.getElementById(closeDex).classList.remove('open-category');
    document.getElementById('color-picker').classList.add('d-none');
}


/**
* opens input field for new category,
* opens colorpicker  
*/
function newCategory() {
    document.getElementById('categories').innerHTML = renderNewCategory();
    document.getElementById('color-picker').classList.remove('d-none');
    document.getElementById('categories').classList.remove('open-category');
}


/**
* starts when clicked on "New Category"
*renders input field for a new category  
*/
function renderNewCategory() {
    categoryColor = '#add8e6';
    let render = renderNewCategoryHTML();
    return render;
}


function renderNewCategoryHTML() {
    return /*html*/ `<div class="new-category">
    <input id="input-new-category" type="text" placeholder="New category name" >
    <button type="button" onclick="loadCategories('Select task Category','#fff')"><img src="./assets/img/add_task/x-img.png" alt=""></button>
    <div></div>
    <button type="button" onclick="setNewCategory()"><img src="./assets/img/add_task/check-black.png" alt=""></button>
    </div>`;
}


/**
* starts when clicked on X-btn
* removes input from input field 
*/
function loadCategories(category, categoryColor) {
    document.getElementById('categories').innerHTML = renderCategories(category, categoryColor);
    document.getElementById('color-picker').classList.add('d-none');
}


/**
* starts when clicked on check-btn
* creates a new category  
*/
function setNewCategory() {
    category = document.getElementById('input-new-category').value;
    document.getElementById('categories').innerHTML = renderCategories(category, categoryColor);
    document.getElementById('color-picker').classList.add('d-none');
}


/**
* renders pulldown selection menu of categories
*/
function renderCategories(category, categoryColor) {
    let render = renderCategoriesHTML(category, categoryColor);
    return render;
}


function renderCategoriesHTML(category, categoryColor) {
    return /*html*/ `
    <div onclick = "pullDownMenu('categories', 'assign')">
    <div class="category-line" id="selected-category">
       ${category}<div class="ring" style="background: ${categoryColor};"></div>
    </div>
    <img src="./assets/img/add_task/pull-down-arrow.png" alt=""></div><div class="category-line" onclick="newCategory()">New Category</div>
    <div class="category-line" onclick="selectCategory('Sales')"><div> Sales</div >
    <div class="ring purple">
    </div>
    </div >
    <div class="category-line" onclick="selectCategory('Backoffice')">
    <div>Backoffice</div>
    <div class="ring green"></div>
    </div>
    `;
}


//// category color picker

/**
* sets selected color of a new category
*/
function setNewCategoryColor(color, id) {
    categoryColor = color;
    let index = id.slice(-1);
    index = +index;
    for (i = 1; i < 7; i++) {
        if (i == index) {
            document.getElementById(`col-${i}`).classList.add('active-ring');
        } else {
            document.getElementById(`col-${i}`).classList.remove('active-ring');
        }
    }
}


// section "assigned to"

/**
 * renders registrated user in assigned to list
 * if user is signed in it says YOU
 * else it renders a list of all Users
 * "invite new User" is always rendered 
 */
function renderContacts() {
    for (i = 0; i < allUsers.length; i++) {
        let userID = allUsers[i]['id'];
        if (currentUser['name'] === allUsers[i]['name']) {
            document.getElementById('assigned-list').innerHTML += renderYouHTML(userID);
        }
        else {
            document.getElementById('assigned-list').innerHTML += renderUserListHTML(allUsers, userID);
        }
    }
    document.getElementById('assigned-list').innerHTML += renderIncHTML();
}


function renderYouHTML(userID) {
    return /*html*/ `
    <div class="assign-line">
       <div>You</div>
       <input type="checkbox" id="userID-${userID}">
    </div>
    `;
}


function renderUserListHTML(allUsers, userID) {
    return /*html*/ `
    <div class="assign-line">
       <div>${allUsers[i]['name']}</div>
       <input type="checkbox" id="userID-${userID}">
    </div>
    `;
}


function renderIncHTML() {
    return /*html*/ `
    <div class="category-line check inviteNew" onclick="toggleInviteContact()">
       <div> Invite new Contact</div>
       <div><img style="" src="./assets/img/add_task/invite-symbol.png" alt=""></div>
    </div>
 `;
}


//// invitation process

/**
 * open / close invite contact container 
 */
function toggleInviteContact() {
    document.getElementById('assign').classList.toggle('d-none');
    document.getElementById('invite-contact').classList.toggle('d-none');
}


/**
 * starts when clicked on X 
 * discard invitation process
 */
function discardInvitation() {
    toggleInviteContact();
}


// section "prio"

/**
 * starts when clicked on of the prio categories
 * sets prio index,
 * highlights the buttons in right color
 * @param {*} index 
 */
function setPrio(index) {
    prio = index;
    prioContainer = document.getElementById(`prio-${index}`);
    prioContainer.classList.add('prio-active');
    if (index == 1) {
        setPrioLow();
    } if (index == 2) {
        setPrioMedium();
    } if (index == 3) {
        setPrioUrgent()
    }
}


function setPrioLow() {
    prioContainer.style.background = "var(--prio-low-green)";
    document.getElementById(`prio-2`).style.background = "white";
    document.getElementById(`prio-3`).style.background = "white";
    document.getElementById(`prio-2`).classList.remove('prio-active');
    document.getElementById(`prio-3`).classList.remove('prio-active');
}


function setPrioMedium() {
    prioContainer.style.background = "var(--prio-medium-orange)";
    document.getElementById(`prio-1`).style.background = "white";
    document.getElementById(`prio-3`).style.background = "white";
    document.getElementById(`prio-1`).classList.remove('prio-active');
    document.getElementById(`prio-3`).classList.remove('prio-active');
}


function setPrioUrgent() {
    prioContainer.style.background = "var(--prio-urgent-red)";
    document.getElementById(`prio-1`).style.background = "white";
    document.getElementById(`prio-2`).style.background = "white";
    document.getElementById(`prio-1`).classList.remove('prio-active');
    document.getElementById(`prio-2`).classList.remove('prio-active');
}


//section "subtasks"

/**
*opens input field for new subtask 
*/
function addNewSubtask() {
    document.getElementById('addNewSubtask').innerHTML = '';
    document.getElementById('addNewSubtask').innerHTML = renderAddSubtask();
}


/**
* renders innerHTML for subtask input field 
*/
function renderAddSubtask() {
    let render = renderAddSubtaskHTML();
    return render;
}


function renderAddSubtaskHTML() {
    return /*html*/ `
    <div class="newTask">
      <input id="input-new-subtask" type="text" placeholder="New subtask">
      <button type="button" onclick="renderSubtask()"><img src="./assets/img/add_task/x-img.png" alt=""></button>
      <div></div>
      <button type="button" onclick="renderAddedSubtask()"><img src="./assets/img/add_task/check-black.png" alt=""></button>
    </div>`;
}


/**
* renders innerHTML into subtasklist underneath input field
*/
function renderAddedSubtask() {
    let newTask = document.getElementById('input-new-subtask').value
    if (!newTask == '') {
        subtaskID += 1;
        document.getElementById('input-new-subtask').value = '';
        document.getElementById('subtask-container').innerHTML += /*html*/ `<div><input type="checkbox" id="subtask-${subtaskID}" checked><span>${newTask}</span></div>`;
    }
}