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

document.addEventListener('DOMContentLoaded', function () {
    const addStudentBtn = document.getElementById('btnAddStudent');
    const titleModule = document.getElementById('ModalTitle')
    const closeBtn = document.getElementById('btnClose');
    const groupSelect = document.getElementById('groupSelect');
    const nameInput = document.getElementById('nameInput');
    const genderSelect = document.getElementById('genderSelect');
    const birthdateInput = document.getElementById('birthdateInput');
    const activeRadio = document.getElementById('activeRadio');
    const inactiveRadio = document.getElementById('inactiveRadio');
    const tableBody = document.querySelector('.content-table tbody');
    const studentId = document.getElementById('studentId'); // Збереження id для редагування
    const formFields = [groupSelect, nameInput, genderSelect, birthdateInput];
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    const confirmDeleteStudentBtn = document.getElementById('confirmDeleteStudent');
    const modal = new bootstrap.Modal(document.getElementById('AddStudentModalWindow')); // Отримуємо модальне вікно
    const alertMsg = document.querySelector('.alert-msg');
    let editingMode = false;
    let editedRowIndex = null;
    let rowToDelete = null;

    const selectedGroupOption = document.getElementById('groupSelect').options[document.getElementById('groupSelect').selectedIndex];
    const selectedGenderOption = document.getElementById('genderSelect').options[document.getElementById('genderSelect').selectedIndex];


    // Обробник подій для закриття модального вікна додавання/редагування
    modal._element.addEventListener('hidden.bs.modal', function (){
        titleModule.textContent = "Add student";
        addStudentBtn.textContent = "Add";
        ClearModalField();
        alertMsg.style.display = 'none';
        editingMode = false;
        editedRowIndex = null;
        studentId.value = '';
    })
    // Додайте обробник подій для кнопки видалення студента
    document.querySelector('.content-table tbody').addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('bi-x-square')) {
            const row = target.closest('tr');
            if (row) {
                rowToDelete = row;
                const studentName = row.cells[2].textContent.trim(); // Отримуємо ім'я студента
                const deleteConfirmationText = document.getElementById('deleteConfirmationText');
                deleteConfirmationText.textContent = `Are you sure you want to delete the student ${studentName}?`; // Оновлюємо текст у модальному вікні
                deleteConfirmationModal.show(); // Відображаємо модальне вікно для підтвердження видалення
            }
        }
    });
    // Додайте обробник подій для кнопки підтвердження видалення
    confirmDeleteStudentBtn.addEventListener('click', function() {
        if (rowToDelete) {
            rowToDelete.remove(); // Видаляємо рядок з таблиці
            deleteConfirmationModal.hide(); // Ховаємо модальне вікно
            rowToDelete = null; // Скидаємо змінну
        }
    });

    // Додайте обробник подій для кнопки Add або Save Changes (залежно від контексту)
    addStudentBtn.addEventListener('click', function () {
        // Перевірка, чи форма заповнена
        if (!groupSelect.value || !nameInput.value || !genderSelect.value || !birthdateInput.value) {
            alertMsg.style.display = 'initial';
            return;
        }

        // Створення об'єкта з даними студента
        const studentData = {
            group: groupSelect.options[groupSelect.selectedIndex].text,
            name: nameInput.value,
            gender: genderSelect.options[genderSelect.selectedIndex].text,
            birthdate: formatDate(birthdateInput.value),
            status: activeRadio.checked ? 'Active' : 'Inactive'
        };
        if (studentId.value) {
            // Редагування студента з вказаним id
            updateTableRow(studentId, studentData); // Оновлення відповідного рядка таблиці
        } else {
            // Додавання нового студента до масиву та таблиці
            const newId = generateStudentId(); // Генерація унікального id для студента
            addTableRow(newId, studentData); // Додавання нового рядка в таблицю
        }
        //console.log('ID студента:', studentId); // Вивід id у консоль
        const formData = createFormData();
        console.log(formData); // Виводимо рядок даних в консоль (для тестування)

        ClearModalField();
        modal.hide();
        editingMode = false;
        editedRowIndex = null;
        studentId.value = '';
    });

    // Функція для оновлення даних рядка в таблиці
    function updateTableRow(studentId, newData){
        //const editedRow = tableBody.querySelector(`tr[data-student-id="${studentId + 1}"]`);
        const editedRow = tableBody.querySelector(`tr:nth-child(${editedRowIndex + 1})`);
        if (editedRow) {
            const cells = editedRow.querySelectorAll('td');
            cells[1].textContent = newData.group;
            cells[2].textContent = newData.name;
            cells[3].textContent = newData.gender;
            cells[4].textContent = newData.birthdate;
            cells[5].innerHTML = newData.status === 'Active' ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>';
        } else {
            console.error('Row not found for updating.');
        }
    }
    function addTableRow(Id, data) {
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-student-id', Id); // Встановлення атрибута з унікальним ідентифікатором
        studentId.value = Id;
        newRow.innerHTML = `
            <td><label><input type="checkbox"></label></td>
            <td>${data.group}</td>
            <td>${data.name}</td>
            <td>${data.gender}</td>
            <td>${data.birthdate}</td>
            <td>${data.status === 'Active' ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>'}</td>
            <td><i class="bi bi-pencil-square Icon"></i><i class="bi bi-x-square Icon"></i></td>
        `;
        tableBody.appendChild(newRow);
    }

    // Обробник події для кнопки Close
    closeBtn.addEventListener('click', function (){
        modal.hide(); // Закриваємо модальне вікно
        studentId.value = '';
        ClearModalField();
    });

    // Обробник події для кнопки "Close" у хедері модального вікна
    document.querySelector('#AddStudentModalWindow .close').addEventListener('click', function () {
        modal.hide(); // Закриваємо модальне вікно
        studentId.value = '';
    });
// Обробник події для кліку на таблиці
    tableBody.addEventListener('click', function (event) {
        const target = event.target;
        // Перевіряємо, чи клікнуто на іконку редагування
        if (target.classList.contains('bi-pencil-square')) {
            const row = target.closest('tr'); // Знаходимо батьківський рядок, який містить цю іконку
            if (!row) {
                alert("Error: Row not found.");
                return;
            }
            // Очищаємо попередні дані у формі
            ClearModalField();
            var studentGroupElement = document.getElementById('groupSelect');
            const group = row.querySelector('td:nth-child(2)').textContent;
            const groupOptions = studentGroupElement.options;
            for (let i = 0; i < groupOptions.length; i++) {
                if (groupOptions[i].textContent === group) {
                    groupOptions[i].selected = true;
                    break;
                }
            }
            var studentGenderElement = document.getElementById('genderSelect');
            const gender = row.querySelector('td:nth-child(4)').textContent;
            const genderOptions = studentGenderElement.options;
            for (let i = 0; i < genderOptions.length; i++) {
                if (genderOptions[i].textContent === gender) {
                    genderOptions[i].selected = true;
                    break;
                }
            }
            // Заповнюємо форму даними обраного рядка для редагування
            const cells = row.querySelectorAll('td');
            nameInput.value = cells[2].textContent.trim();
            // Зчитуємо текстове значення з комірки
            const birthdateText = cells[4].textContent.trim();
            // Розбиваємо текстове значення дати за допомогою крапки
            const parts = birthdateText.split('.');
            // Перетворюємо дату у формат "YYYY-MM-DD"
            const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            // Встановлюємо значення у поле введення типу "date"
            document.getElementById('birthdateInput').value = formattedDate;
            activeRadio.checked = cells[5].querySelector('i').id === 'icon-active';
            inactiveRadio.checked = cells[5].querySelector('i').id === 'icon';
            ChangeInfoUpdate();

            studentId.value = row.getAttribute('data-student-id');

            // Відкриваємо модальне вікно
            modal.show();
            editingMode = true; // Увімкнути режим редагування
            editedRowIndex = Array.from(row.parentNode.children).indexOf(row);
        }
    });
    function createFormData() {
        const id = document.getElementById('studentId').value;

        const selectedGroupOption = document.getElementById('groupSelect').options[document.getElementById('groupSelect').selectedIndex];
        const selectedGroupId = selectedGroupOption.value;

        const selectedGenderOption = document.getElementById('genderSelect').options[document.getElementById('genderSelect').selectedIndex];
        const selectedGenderId = selectedGenderOption.value;

        const formData = {
            id: parseInt(id),
            group: parseInt(selectedGroupId),
            name: nameInput.value,
            gender: parseInt(selectedGenderId),
            birthdate:  formatDate(birthdateInput.value),
            status: activeRadio.checked ? 'True' : 'False'
        };

        return JSON.stringify(formData); // Повертаємо рядок JSON зі зібраними даними
    }
    // Функція для форматування дати у вказаний формат
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Додаємо нуль спереду, якщо число менше 10
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Місяці в JavaScript починаються з 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
    function ClearModalField() {
        formFields.forEach(field => field.value = '');
    }
    function  ChangeInfoUpdate()  {
        addStudentBtn.textContent = "Save Changes";
        titleModule.textContent = "Edit"
    }
    // Функція для генерації унікального id для нового студента
    function generateStudentId() {
        const lastRow = tableBody.querySelector('tr:last-child');
        if (lastRow) {
            return parseInt(lastRow.getAttribute('data-student-id')) + 1;
        } else {
            return 1;
        }    }
});
