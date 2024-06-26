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


document.querySelector('.content').addEventListener('click', function(event) {
    const addOrEditButton = event.target.closest("button.addOrEdit");
    if (addOrEditButton) {
        openAddEditModalWindow(addOrEditButton);
    }
});

document.querySelector('.content').addEventListener('click', function(event) {
    const deleteRowButton = event.target.closest("button.deleteRow");
    if (deleteRowButton) {
        openWarningModalWindow(deleteRowButton);
    }
});
let stdId = 0;

let Student = {
    id: null,
    group: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    status: false,
};

document.addEventListener("DOMContentLoaded", function() {

    const alertMsg = document.querySelector('.alert-msg');

    document.querySelector('.modal-header .close').addEventListener('click', function() {
        let modal = bootstrap.Modal.getInstance(document.getElementById("AddStudentModalWindow"));
        alertMsg.style.display = 'none';
        modal.hide();
    });

    document.getElementById("AddEditForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const statusRadio = document.querySelector('input[name="statusRadio"]:checked');

        let groupId = document.getElementById("groupSelect").value;
        let name = document.getElementById("firstName").value;
        let surname = document.getElementById("lastName").value;
        let gender = document.getElementById("genderSelect").value;
        let birthdate = document.getElementById("birthdateInput").value;
        const status = statusRadio ? statusRadio.value : '';

        if (!groupId || !name || !surname || !gender || !birthdate || !status) {
            alertMsg.style.display = 'initial';
            return;
        }

        let student = Object.assign({}, Student);
        student.id = document.getElementById("studentId").value;
        student.group = groupId;
        student.firstName = name;
        student.lastName = surname;
        student.gender = gender;
        student.birthday = birthdate;
        student.status = statusRadio ? statusRadio.value === 'active' : false;

        const formDate = createFormData(student);
        console.log(formDate);

        if(student.id){
            editStudent(student);
        }else{
            student.id=stdId;
            stdId++;
            addStudent(student);
        }
        let modal = bootstrap.Modal.getInstance(document.getElementById("AddStudentModalWindow"));
        alertMsg.style.display = 'none';
        modal.hide();

    });
    document.getElementById("confirmDeleteStudent").addEventListener('click',function (){
        const id = document.getElementById("idOfDelete").value;
        const table = document.getElementById('studentsTable');
        const rows = table.getElementsByTagName('tr');
        let rowToDelete;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.getAttribute('data-id')==id) {
                rowToDelete = row;
            }
        }
        rowToDelete.parentNode.removeChild(rowToDelete);
        let modal = bootstrap.Modal.getInstance(document.getElementById("deleteConfirmationModal"));

        modal.hide();
    });
});

function fillModalWindow(student) {
    document.getElementById("studentId").value = student.id ? student.id : "";
    document.getElementById("groupSelect").value = student.group;
    document.getElementById("firstName").value = student.firstName;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("genderSelect").value = student.gender;
    document.getElementById("birthdateInput").value = student.birthday ? formatDateToISO(student.birthday) : "";

    const activeRadio = document.getElementById("activeRadio");
    const inactiveRadio = document.getElementById("inactiveRadio");

    if (student.status === true) {
        activeRadio.checked = true; // Встановлюємо активний статус
    } else if (student.status === false) {
        inactiveRadio.checked = true; // Встановлюємо неактивний статус
    } else {
        activeRadio.checked = false;
        inactiveRadio.checked = false;
    }
}
function addStudent(student) {
    const newRow = document.createElement('tr');
    newRow.setAttribute("data-id", student.id);
    newRow.setAttribute("data-firstName", student.firstName);
    newRow.setAttribute("data-lastName", student.lastName);
    newRow.innerHTML = `
        <td><input type="checkbox" class="table-input"></td>
        <td data-value="${student.group}">${document.querySelector('#groupSelect option[value="' + student.group + '"]').textContent}</td>
        <td>${student.firstName+" "+student.lastName}</td>
        <td data-value="${student.gender}">${document.querySelector('#genderSelect option[value="' + student.gender + '"]').textContent}</td>
        <td>${formatDate(student.birthday)}</td>
        <td>${student.status ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>'}</td>
        <td>
         <button class="btn btn-xs addOrEdit" data-id="${student.id}"><i class="bi bi-pencil-square Icon"></i> </button>
         <button class="btn btn-xs deleteRow" data-id="${student.id}"><i class="bi bi-x-square Icon"></i></button>
         </td>

    `;
    document.getElementById('studentsTable').getElementsByTagName('tbody')[0].appendChild(newRow);
}

function editStudent(student){
    const table = document.getElementById('studentsTable');
    const rows = table.getElementsByTagName('tr');
    let rowToEdit;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.getAttribute('data-id')== student.id) {
            rowToEdit = row;
        }
    }
    const cols = rowToEdit.querySelectorAll('td');

    cols[1].setAttribute("data-value", student.group);
    cols[1].textContent = document.querySelector('#groupSelect option[value="' + student.group + '"]').textContent;
    cols[2].textContent = student.firstName + " " + student.lastName;
    rowToEdit.setAttribute("data-firstName", student.firstName);
    rowToEdit.setAttribute("data-lastName", student.lastName);
    cols[3].setAttribute("data-value", student.gender);
    cols[3].textContent = document.querySelector('#genderSelect option[value="' + student.gender + '"]').textContent;
    cols[4].textContent = formatDate(student.birthday);
    cols[5].innerHTML = student.status ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>';

}

let openAddEditModalWindow = function (button) {
    let student = Object.assign({}, Student);
    let title = "Add student";
    if (button.getAttribute("data-id") !== "") {
        title = "Edit student";
        let tr = button.closest('tr');
        let columns = tr.querySelectorAll('td');
        student.id = tr.getAttribute("data-id");
        student.group = columns[1].getAttribute("data-value");
        student.firstName = tr.getAttribute("data-firstName");
        student.lastName = tr.getAttribute("data-lastName");
        student.gender = columns[3].getAttribute("data-value");
        student.birthday = columns[4].textContent;
        // Check for active status icon and set student.status accordingly
        const statusCell = columns[5];
        const isActiveIcon = statusCell.querySelector('i.bi.bi-circle-fill#icon-active');
        student.status = isActiveIcon !== null; // Set true if icon exists, false otherwise
    }
    fillModalWindow(student);
    document.getElementById("ModalTitle").innerText = title;

    let modal = new bootstrap.Modal(document.getElementById('AddStudentModalWindow'));
    modal.show();

}
function createFormData(student) {
    const formData = {
        id : parseInt(student.id),
        group : parseInt(student.group),
        firstName : student.firstName,
        lastName : student.lastName,
        gender : parseInt(student.gender),
        birthdate:  formatDate(student.birthday),
        status: student.status ? 'True' : 'False'
    }
    return JSON.stringify(formData);
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // Додаємо нуль спереду, якщо число менше 10
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Місяці в JavaScript починаються з 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
function formatDateToISO(dateString) {
    let parts = dateString.split('.');

    return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
}
function openWarningModalWindow(button){
    let tr = button.closest('tr');
    let columns = tr.querySelectorAll('td');
    let name = columns[2].textContent.trim();
    document.getElementById("idOfDelete").value = button.getAttribute("data-id");
    document.getElementById("messageForDelete").innerText = "Are you sure you want to delete the student "+name+"?";
    let modal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));

    modal.show();
}
