document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо кнопку "Додати студента"
    var addStudentButton = document.getElementById('addStudentButton');

    // Додаємо обробник події для кнопки "Додати студента"
    addStudentButton.addEventListener('click', function() {
        // Отримуємо таблицю
        var table = document.querySelector('.content-table tbody');

        // Створюємо новий рядок для студента
        var newRow = document.createElement('tr');

        // Додаємо HTML для нового рядка з даними про студента
        newRow.innerHTML = `
            <td><label><input type="checkbox" name="option"></label></td>
            <td>PZ-21</td>
            <td>Roman Marushko</td>
            <td>M</td>
            <td>18.02.2005</td>
            <td><i class="bi bi-circle"></i></td>
            <td><a href="Edit%20menu.html" class="bi bi-pencil-square"></a><a class="bi bi-x-square"></a></td>
        `;

        // Додаємо новий рядок до таблиці
        table.appendChild(newRow);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо таблицю
    var table = document.querySelector('.content-table tbody');

    // Додаємо обробник події для кліків на всіх елементах "Видалити студента"
    table.addEventListener('click', function(event) {
        var target = event.target;

        // Перевіряємо, чи було клікнуто по посиланню для видалення
        if (target.classList.contains('bi-x-square')) {
            // Отримуємо батьківський рядок, який містить посилання для видалення
            var row = target.closest('tr');

            // Видаляємо рядок з таблиці
            row.parentNode.removeChild(row);
        }
    });
});
