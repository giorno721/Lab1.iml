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
    const formFields = [groupSelect, nameInput, genderSelect, birthdateInput];
    let editingMode = false;
    let editedRowIndex = null;
    const modal = new bootstrap.Modal(document.getElementById('AddStudentModalWindow')); // Отримуємо модальне вікно

    modal._element.addEventListener('hidden.bs.modal', function (){
        titleModule.textContent = "Add student";
        addStudentBtn.textContent = "Add";
        ClearModalField();
        editingMode = false; // При закритті модального вікна скидаємо режим редагування
        editedRowIndex = null;
    })
    // Функція для форматування дати у вказаний формат
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Додаємо нуль спереду, якщо число менше 10
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Місяці в JavaScript починаються з 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // Обробник події для кнопки Add або Save Changes (залежно від контексту)
    addStudentBtn.addEventListener('click', function () {
        // Перевірка, чи форма заповнена
        if (!groupSelect.value || !nameInput.value || !genderSelect.value || !birthdateInput.value) {
            alert("Some information is missing! Please, fill all the fields.");
            return;
        }
        // Змінні для збереження нових даних студента
        const group = groupSelect.options[groupSelect.selectedIndex].text;
        const name = nameInput.value;
        const gender = genderSelect.value === 'male' ? 'M' : 'F';
        const birthdate = formatDate(birthdateInput.value);
        const status = activeRadio.checked ? 'Active' : 'Inactive';
        const icon = activeRadio.checked ? '<i class="bi bi-circle-fill" id="icon-active"></i>' : '<i class="bi bi-circle-fill" id="icon"></i>';

        // Перевірка, чи кнопка містить текст "Add" (що означає додавання нового студента)
        if (!editingMode) {
            // Додавання нового рядка до таблиці з новими даними студента
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td><label><input type="checkbox"></label></td>
            <td>${group}</td>
            <td>${name}</td>
            <td>${gender}</td>
            <td>${birthdate}</td>
            <td>${icon}</td>
            <td><i class="bi bi-pencil-square"></i><i class="bi bi-x-square"></i></td>
        `;
            tableBody.appendChild(newRow);
            ClearModalField();
            modal.hide();
        } else {
            // If editing the first row, update its content directly
            const editedRow = editedRowIndex=== 0 ? tableBody.querySelector('tr:first-child') : document.querySelector(`tr:nth-child(${editedRowIndex + 1})`);
            const cells = editedRow.querySelectorAll('td');
            cells[1].textContent = group;
            cells[2].textContent = name;
            cells[3].textContent = gender;
            cells[4].textContent = birthdate;
            cells[5].innerHTML = icon;

            ClearModalField();
            modal.hide();
        }
        editingMode = false;
        editedRowIndex = null;
    });
    // Обробник події для кнопки Close
    closeBtn.addEventListener('click', function (){
        modal.hide(); // Закриваємо модальне вікно
        ClearModalField();
    });

    // Обробник події для кнопки "Close" у хедері модального вікна
    document.querySelector('#AddStudentModalWindow .close').addEventListener('click', function () {
        modal.hide(); // Закриваємо модальне вікно
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
            // Заповнюємо форму даними обраного рядка для редагування
            const cells = row.querySelectorAll('td');
            groupSelect.value = cells[1].textContent.trim() === 'PZ-21' ? 'PZ-21' : 'PZ-25';
            nameInput.value = cells[2].textContent.trim();
            genderSelect.value = cells[3].textContent.trim() === 'M' ? 'male' : 'female';
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
            // Відкриваємо модальне вікно
            modal.show();
            editingMode = true; // Увімкнути режим редагування
            editedRowIndex = Array.from(row.parentNode.children).indexOf(row);
        }
    });
    function ClearModalField() {
        formFields.forEach(field => field.value = '');
    }
    function  ChangeInfoUpdate()  {
        addStudentBtn.textContent = "Save Changes";
        titleModule.textContent = "Edit"
    }
});
