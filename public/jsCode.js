document.querySelector('.burger-menu').addEventListener('click', function() {
    this.classList.toggle('active');
    let icon = document.querySelector('.burger-menu i');
    if (icon.classList.contains('bi-list')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
    } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
    }
    document.querySelector('.sidebar').classList.toggle('open');
});

let freeID = 0;
let Student = function () {
    this.id = null;
    this.group = "";
    this.name = "";
    this.gender = "";
    this.birthday = "";
    this.status = false;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("myForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let student = new Student();
        student.id = document.getElementById("studentId").value;
        student.group = document.getElementById("groupSelect").value;
        student.name = document.getElementById("nameInput").value;
        student.gender = document.getElementById("genderSelect").value;
        student.birthday = document.getElementById("birthdateInput").value;
        student.status = !!document.getElementById("status").checked;

        let jsonString = JSON.stringify(student);
        console.log(jsonString);

        if(student.id){
            editStudent(student);
        }else{
            student.id=freeID;
            freeID++;
            addStudent(student);
        }
        let modal = bootstrap.Modal.getInstance(document.getElementById("AddStudentModalWindow"));
        modal.hide();

    });
    document.getElementById("confirmDeleteStudent").addEventListener('click',function (){
        const id = document.getElementById("idOfDelete").value;
        const row = getRowByDataAttribute('data-id', id);
        row.parentNode.removeChild(row);
        let modal = bootstrap.Modal.getInstance(document.getElementById("deleteConfirmationModal"));

        modal.hide();
    });
    document.querySelector('.content').addEventListener('click', function (event) {
        if (event.target.closest("button")?.classList.contains('addOrEdit')){
            openMainModal(event.target.closest("button"));
        }
        if (event.target.closest("button")?.classList.contains('deleteRow')) {
            openWarningModel(event.target.closest("button"));
        }
    });


});

function transformDateFormat(dateString) {
    let dateObject = new Date(dateString);

    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();

    // Format the date in "DD.MM.YYYY" format
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
}
function transformDateFormatToISO(dateString) {
    let parts = dateString.split('.');

    return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
}
function updateModal(student) {
    document.getElementById("studentId").value = student.id ? student.id : "";
    document.getElementById("groupSelect").value = student.group ;
    document.getElementById("nameInput").value = student.name;
    document.getElementById("genderSelect").value = student.gender;
    document.getElementById("birthdateInput").value = student.birthday ? transformDateFormatToISO(student.birthday) : "";
    document.getElementById("status").checked = student.status;
}
function getRowByDataAttribute(attributeName, attributeValue) {
    const table = document.getElementById('studentsTable');
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.getAttribute(attributeName)==attributeValue) {
            return row;
        }
    }

    return null;
}

function editStudent(student){
    const row = getRowByDataAttribute('data-id', student.id);
    const cols = row.querySelectorAll('td');

    cols[1].setAttribute("data-value", student.group);
    cols[1].textContent = document.querySelector('#groupSelect option[value="' + student.group + '"]').textContent;
    cols[2].textContent = student.name;
    cols[3].setAttribute("data-value", student.gender);
    cols[3].textContent = document.querySelector('#genderSelect option[value="' + student.gender + '"]').textContent;
    cols[4].textContent = transformDateFormat(student.birthday);
    if(student.status){
        cols[5].innerHTML ='<i class="bi bi-circle-fill" id="icon-active"></i>'
    }else {
        cols[5].innerHTML ='<i class="bi bi-circle-fill" id="icon"></i>'
    }
}
let openMainModal = function (button) {
    let student = new Student();
    let title = "Add student";
    if (button.getAttribute("data-id") !== "") {
        title = "Edit student";
        let tr = button.closest('tr');
        let columns = tr.querySelectorAll('td');
        let isActive;
        columns.forEach(column => {
            if(column.querySelector('i.status')){
                isActive =column.querySelector('i.status').classList.contains('active');
            }
        });
        student.id = tr.getAttribute("data-id");
        student.group = columns[1].getAttribute("data-value");
        student.name = columns[2].textContent;
        student.gender = columns[3].getAttribute("data-value");
        student.birthday = columns[4].textContent;
        student.status = isActive;

    }
    updateModal(student);
    document.getElementById("ModalTitle").innerText = title;

    let modal = new bootstrap.Modal(document.getElementById('AddStudentModalWindow'));

    modal.show();

}
function openWarningModel(button){
    let tr = button.closest('tr');
    let columns = tr.querySelectorAll('td');
    let name = columns[2].textContent.trim();
    document.getElementById("idOfDelete").value = button.getAttribute("data-id");
    document.getElementById("messageForDelete").innerText = "Are you sure you want to delete the student "+name+"?";
    let modal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));

    modal.show();
}
function addStudent(student) {
    let status;
    if(student.status) {
        status = '<i class="bi bi-circle-fill" id="icon-active"></i>';
    }else {
        status = '<i class="bi bi-circle-fill" id="icon"></i>';
    }
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id",student.id);
    newRow.innerHTML =
        `<td><input type="checkbox" class="table-input"></td>
                    <td data-value = "${student.group}">${document.querySelector('#groupSelect option[value="' + student.group + '"]').textContent}</td>
                    <td>${student.name}</td>
                    <td data-value="${student.gender}">${document.querySelector('#genderSelect option[value="' + student.gender + '"]').textContent}</td>
                    <td>${transformDateFormat(student.birthday)}</td>
                    <td>
                        ${status}
                    <td>
                        <div class="d-flex justify-content-center">
                            <button  class="btn addOrEdit" data-id="${student.id}">
                                <i class="bi bi-pencil-square edit-btn close-btn table-icons"></i>
                            </button>
                            <button  class="btn deleteRow" data-id="${student.id}">
                               <i class="bi bi-x-square"></i></i>
                            </button>
                        </div>
                    </td>
          `;

    document.getElementById('studentsTable').getElementsByTagName('tbody')[0].appendChild(
        newRow);
}
