$(document).ready(function() {
    const tabs = $('.tabs button').not('.exclude-color-change');
    
    tabs.click(function() {
        tabs.removeClass('active');
        $(this).addClass('active');
    });

    // Lisää napin "Lisää" painalluksen tapahtumankäsittelijä
    $('#add-button').mousedown(function() {
        $(this).css('background-color', '#00CED1'); // Vaihda napin taustaväri turkoosiksi painettaessa
    });

    // Lisää napin "Lisää" vapauttamisen tapahtumankäsittelijä
    $('#add-button').mouseup(function() {
        $(this).css('background-color', '#007bff'); // Palauta napin normaali taustaväri klikkauksen jälkeen
    });

    // FadeIn()-tehoste container-diville
    $('.container').hide().fadeIn(1000);

    // SlideDown()-tehoste todo-listille
    $('#todo-list').hide().slideDown(1000);

    // SlideUp()-tehoste todo-formille
    $('#todo-form').hide().slideDown(1000);

    // Tarvittavat muuttujat
    const todoForm = $('#todo-form');
    const todoInput = $('#todo-input');
    const todoList = $('#todo-list');
    const todoSummary = $('#todo-summary');
    const showCompletedBtn = $('#show-completed-btn');
    const showAllBtn = $('#show-all-btn');
    const showActiveBtn = $('#show-active-btn');
    const clearCompletedBtn = $('#clear-completed-btn');

    // Lomakkeen lähetys
    todoForm.submit(function(event) {
        event.preventDefault();
        const todoText = todoInput.val().trim();
        if (todoText.length < 3) {
            showError('Tehtävän on oltava vähintään 3 merkkiä pitkä');
            todoInput.addClass('error');
            return;
        }
        todoInput.removeClass('error');
        addTodoItem(todoText);
        todoInput.val('');
        updateSummary();
        saveTodos();
    });

    // Input-kentän muutokset
    todoInput.on('input', function() {
        if (todoInput.val().length >= 3) {
            todoInput.removeClass('error');
        }
    });

    // Tehtävien klikkaukset
    todoList.on('click', 'li', function() {
        $(this).toggleClass('completed');
        updateSummary();
        saveTodos();
    });

    // Poista-nappi
    todoList.on('click', '.delete-btn', function() {
        const item = $(this).parent();
        item.addClass('fade-out');
        item.on('animationend', function() {
            item.remove();
            updateSummary();
            saveTodos();
        });
    });

    // Näytä suoritetut
    showCompletedBtn.click(function() {
        $('.todo-item').each(function() {
            const item = $(this);
            if (!item.hasClass('completed')) {
                item.slideUp(); // Lisätään slideUp()-tehoste
            } else {
                item.slideDown(); // Lisätään slideDown()-tehoste
            }
        });
    });

    // Näytä kaikki
    showAllBtn.click(function() {
        $('.todo-item').removeClass('hidden').show();
    });

    // Näytä aktiiviset
    showActiveBtn.click(function() {
        $('.todo-item').each(function() {
            const item = $(this);
            if (item.hasClass('completed')) {
                item.slideUp(); // Lisätään slideUp()-tehoste
            } else {
                item.slideDown(); // Lisätään slideDown()-tehoste
            }
        });
    });

    // Poista suoritetut
    clearCompletedBtn.click(function() {
        $('.todo-item.completed').each(function() {
            const item = $(this);
            item.addClass('fade-out');
            item.on('animationend', function() {
                item.remove();
                updateSummary();
                saveTodos();
            });
        });
    });

    // Lisää uusi tehtävä
    function addTodoItem(text) {
        const li = $('<li>').addClass('todo-item').append(
            $('<span>').addClass('todo-text').text(text),
            $('<button>').addClass('delete-btn').html('<i class="fas fa-trash-alt"></i>')
        );
        todoList.append(li);
        setTimeout(() => li.addClass('visible'), 10);
    }

    // Näytä virheilmoitus
    function showError(message) {
        alert(message);
    }

    // Päivitä tehtävien yhteenveto
    function updateSummary() {
        const remainingTodos = $('#todo-list .todo-item:not(.completed)').length;
        todoSummary.text(`${remainingTodos} tehtävää jäljellä`);
    }

    // Tallenna tehtävät
    function saveTodos() {
        localStorage.setItem('todos', todoList.html());
    }

    // Lataa tallennetut tehtävät
    function loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            todoList.html(savedTodos);
            $('#todo-list .todo-item').each(function() {
                const item = $(this);
                item.removeClass('hidden').addClass('visible');
            });
        }
        updateSummary();
    }

    // Lataa tallennetut tehtävät sivun latauksen yhteydessä
    loadTodos();

    // Vaihda clearCompletedBtn-painikkeen väri alas-painamisen yhteydessä
    clearCompletedBtn.mousedown(function() {
        $(this).css('color', 'red');
    });

    // Vaihda clearCompletedBtn-painikkeen väri ylös-painamisen yhteydessä
    clearCompletedBtn.mouseup(function() {
        $(this).css('color', 'white');
    });
});
