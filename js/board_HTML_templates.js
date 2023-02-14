setURL('https://sarah-zimmermann-schmutzler.developerakademie.net/smallest_backend_ever');

// TaskCards

/**
 * HTML Template for TaskCard
 * @param {*} element 
 * @param {*} elementTitle 
 * @param {*} elementDescription 
 * @returns 
 */
function renderCardHTML(element, elementTitle, elementDescription) {
    return /*html*/ `
       <div class="card" draggable="true" id="${element['id']}" ondragstart="startDragging(${element['id']})" onclick="showTaskBig(this.id)">
           <div class="category" style="background-color:${element['categoryColor']};">${element['category']}</div>
           <div class="card-title text-16-700-black">${elementTitle}</div>
           <div class="card-description">${elementDescription}</div>
 
         <div class="subtasks-board d-none" id="subtask-${element['id']}">
             <div class="progressbar-gray">
                <div class="progressbar-blue" id="progressbar-blue-${element['id']}"></div>
             </div>
             <div id="doneCounter-${element['id']}">#/# Done</div>
          </div>
 
          <div class="card-footer">
             <div class="team-member">
                <div class="team-circle d-none" id="team-circle-1-${element['id']}">#</div>
                <div class="team-circle d-none" id="team-circle-2-${element['id']}">#</div>
                <div class="team-circle d-none" id="team-circle-3-${element['id']}">#</div>
             </div>
             <div >
                <img id="card-prio-${element['id']}" src="" alt="">
             </div>
       </div>
          `;
 }


 // big TaskCard view
 
 function renderShowAssignedHTML(userColor, memberCapitals, teamMember) {
    return /*html*/ `<div class="show-member">
    <div id="show-member-ring" class="show-task-team-circle" style="background-color:${userColor}">${memberCapitals}</div>
    <div id="show-member-name">${teamMember}</div>
 </div>`;
 }


 function renderShowSubtasksHTML(element, checkBox, i) {
    return /*html*/ `
    <div class="show-subtask" onclick="checkSubtask(${element['id']}, ${i})">
      <img src=${checkBox} alt="">
      <span id="show-subtask-${i}">${element['subtasks']['subtasks'][i]['subTaskText']}</span>
   </div>
   `;
 }