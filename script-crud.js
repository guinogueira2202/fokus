/**
 * @fileoverview This script handles the CRUD operations for a task management application.
 * It includes functions to add, edit, delete, and render tasks, as well as managing the active task.
 * The tasks are stored in the local storage and rendered in the task list.
 * The active task is highlighted in the task list and its description is displayed in the active task section.
 * 
 * @version 1.0.0
 */
const addNewTaskButton = document.querySelector('button.app__button--add-task');
const taskForm = document.querySelector('form.app__form-add-task');
const editTaskForm = document.querySelector('form.app__form-edit-task');
const taskFormTextArea = document.getElementById('form-add-task__textarea');
const editTaskFormTextArea = document.getElementById('form-edit-task__textarea');
const ulTaskList = document.querySelector('ul.app__section-task-list');
const editTaskFormDeleteBtn = document.getElementById('form-edit-task__delete-btn');
const editTaskFormCancelBtn = document.getElementById('form-edit-task__cancel-btn');
const taskFormCancelBtn = document.getElementById('form-add-task__cancel-btn');
const taskFormSaveBtn = document.getElementById('form-add-task__save-btn');
const activeTaskDescription = document.querySelector('p.app__section-active-task-description');
const clearCompletedTasksBtn = document.getElementById('btn-remover-concluidas');
const clearAllTasksBtn = document.getElementById('btn-remover-todas');

/**
 * Tasks array.
 */
const tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];
const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) ?? [];

/**
 * Active task.
 */
let activeTask = JSON.parse(localStorage.getItem('activeTask')) ?? null;

performeScriptCrud();

/**
 * Executes the CRUD script.
 * @function performeScriptCrud
 * @returns {void}
 */
function performeScriptCrud() {
    addNewTaskButton.addEventListener('click', showTaskForm);
    taskForm.addEventListener('submit', submitTask);
    taskFormCancelBtn.addEventListener('click', hideTaskForm);
    editTaskFormCancelBtn.addEventListener('click', hideEditTaskForm);
    clearCompletedTasksBtn.addEventListener('click', clearCompletedTasks);
    clearAllTasksBtn.addEventListener('click', clearAllTasks);
    editTaskFormDeleteBtn.addEventListener('click', () => {
        const index = tasks.findIndex(
            task => task.description === editTaskFormTextArea.value
        );
        if (index !== -1) {
            tasks.splice(index, 1);
        }
        updateTasksStorage('tasks', tasks);
        document.querySelector('.taskBeingEdited').remove();
        hideEditTaskForm();

        activeTask = null;
        removeFromLocalStorage('activeTask');   
        updateActiveTaskSectionText();     
    });
    renderAllTasks();
}

/**
 * Removes all completed tasks from the task list and clears the completedTasks array.
 * Also removes the completed tasks from local storage.
 */
function clearCompletedTasks() {
    completedTasks.forEach((completedTask) => {
        const index = tasks.findIndex(
            task => task.description === completedTask.description
        );
        if (index !== -1) {
            tasks.splice(index, 1);
        }
    });
    updateTasksStorage('tasks', tasks);

    const completedTasksElements = document.querySelectorAll('.app__section-task-list-item-complete');
    completedTasksElements.forEach((element) => {
        element.remove();
    });

    completedTasks.length = 0;
    removeFromLocalStorage('completedTasks');

    activeTask = null;
    removeFromLocalStorage('activeTask');
    updateActiveTaskSectionText();
}

/**
 * Clears all tasks from the task list and local storage.
 */
function clearAllTasks() {
    tasks.length = 0;
    removeFromLocalStorage('tasks');
    completedTasks.length = 0;
    removeFromLocalStorage('completedTasks');

    const allTasksElements = document.querySelectorAll('.app__section-task-list-item');
    allTasksElements.forEach((element) => {
        element.remove();
    });

    activeTask = null;
    removeFromLocalStorage('activeTask');
    updateActiveTaskSectionText();
}

/**
 * Toggles the visibility of the task form.
 */
function showTaskForm() {
    taskForm.classList.remove('hidden');
    taskForm.scrollIntoView({ behavior: 'smooth' });
    hideEditTaskForm();
}

/**
 * Submits a task.
 */
function submitTask(event) {
    event.preventDefault();
    const task = createNewTask();
    addTaskToTasksStorage(task);
    addTaskToUlTaskList(task);
    hideTaskForm();
}

/**
 * Adds a task to task storage.
 * @param {string} task - the task to be added.
 */
function addTaskToTasksStorage(task) {
    tasks.push(task);
    addToLocalStorage('tasks', tasks);
}

/**
 * Hide the task form.
 */
function hideTaskForm() {
    taskForm.classList.add('hidden');
    taskFormTextArea.value = null;
}

/**
 * Hides the edit task form and clears the text area.
 */
function hideEditTaskForm() {
    editTaskForm.classList.add('hidden');
    editTaskFormTextArea.value = null;
}

/**
 * Creates a new task based on the value of the form field of the form.
 * @returns {Object} The new task created.
 */
function createNewTask() {
    const task = {
        description: taskFormTextArea.value
    };
    return task;
}

/**
 * Adds a value to the localStorage.
 * @param {string} key - The key to storing the value.
 * @param {any} value -The value to be stored.
 */
function addToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Removes an item from the local storage based on the provided key.
 * @param {string} key - The key of the item to be removed.
 */
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Adds a task to the task list.
 * 
 * @param {string} task - The task to be added.
 * @returns {HTMLElement} - The element of the new task added.
 */
function addTaskToUlTaskList(task) {
    const newTaskElement = createNewTaskElement(task);
    ulTaskList.appendChild(newTaskElement);

    return newTaskElement;
}

/**
 * Creates a new task element.
 * @param {Object} task - The task object.
 * @param {string} task.description - The description of the task.
 * @returns {HTMLLIElement} - The newly created task element.
 */
function createNewTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    li.onclick = () => {
        toggleActiveTask(li, task);
    };

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `;
    svg.onclick = () => {
        li.classList.toggle('app__section-task-list-item-complete');
        toggleTaskCompletion(task);
    }

    const p = document.createElement('p');
    p.classList.add('app__section-task-list-item-description');
    p.textContent = task.description;

    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    button.onclick = () => {
        editTask(task, li);
        li.classList.add('taskBeingEdited');
    }

    const imgBtn = document.createElement('img');
    imgBtn.setAttribute('src', './imagens/edit.png');

    button.append(imgBtn)
    li.append(svg, p, button);

    return li;
}

/**
 * Toggles the completion status of a task.
 * If the task is already completed, it will be canceled.
 * If the task is not completed, it will be marked as completed.
 * @param {string} task - The task to toggle completion status.
 */
function toggleTaskCompletion(task) {
    const completedTaskWasCanceled = searchAndCancelCompletedTask(task);
    if (completedTaskWasCanceled === false) {
        completedTasks.push(task);
    }
    updateTasksStorage('completedTasks', completedTasks);
}

/**
 * Searches for a completed task in the completedTasks array and cancels it.
 * @param {Object} task - The task object to search and cancel.
 * @returns {boolean} - Returns true if the task was found and canceled, false otherwise.
 */
function searchAndCancelCompletedTask(task) {
    checkIfTaskIsNotNull(task);

    const index = completedTasks.findIndex(
        completedTask => completedTask.description === task.description
    );
    if (index !== -1) {
        completedTasks.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Checks if a task is not null or undefined and has a description.
 * @param {Object} task - The task object to be checked.
 * @returns {boolean} - Returns true if the task is not null or undefined and has a description, otherwise returns false.
 */
function checkIfTaskIsNotNull(task) {
    if (!task || !task.description) {
        return false;
    }
}

/**
 * Updates the tasks storage with the given key and tasks array.
 * If the tasks array is empty, the key is removed from the local storage.
 * @param {string} key - The key to identify the tasks in the local storage.
 * @param {Array} tasksArray - The array of tasks to be stored.
 */
function updateTasksStorage(key, tasksArray) {
    if (tasksArray.length === 0) {
        removeFromLocalStorage(key);
        return;
    }
    addToLocalStorage(key, tasksArray);
}

/**
 * Toggles the active state of a task element and updates the active task description.
 * 
 * @param {HTMLElement} elementToToggle - The task element to activate or deactivate.
 * @param {Object} task - The task object containing the description.
 */
function toggleActiveTask(elementToToggle, task) {
    const activeTaskElement = checkIfThereIsAnActiveTaskElement();

    if (activeTaskElement === null || activeTaskElement === elementToToggle) {
        elementToToggle.classList.toggle('app__section-task-list-item-active');
    } else {
        activeTaskElement.classList.remove('app__section-task-list-item-active');
        elementToToggle.classList.add('app__section-task-list-item-active');
    }

    updateActiveTask(task);
}

/**
 * Updates the active task and stores it in the local storage.
 * If there is already an active task element, it updates the active task and stores it in the local storage.
 * If there is no active task element, it removes the active task from the local storage.
 * Finally, it updates the text in the active task section.
 * 
 * @param {string} task - The task to be set as the active task.
 */
function updateActiveTask(task) {
    if (checkIfThereIsAnActiveTaskElement() !== null) {
        activeTask = task;
        addToLocalStorage('activeTask', activeTask);
    } else {
        removeFromLocalStorage('activeTask');
        activeTask = null;
    }
    updateActiveTaskSectionText();
}

/**
 * Check if there is an active task in the task list.
 * @returns {element} The active or null task element if there is no active task.
 */
function checkIfThereIsAnActiveTaskElement() {
    return document.querySelector('.app__section-task-list-item-active');
}

/**
 * Updates the text content of the active task section with the provided task description.
 * If there is no active task, the text content will be set to an empty string.
 * 
 * @param {Object} task - The task object containing the description.
 */
function updateActiveTaskSectionText() {
    if (activeTask) {
        activeTaskDescription.textContent = activeTask.description
        return;
    }
    activeTaskDescription.textContent = null;
}

/**
 * Edits a task and updates its description.
 * @param {Object} task - The task object to be edited.
 * @param {HTMLElement} taskElement - The HTML element representing the task.
 */
function editTask(task, taskElement) {
    hideTaskForm()
    editTaskForm.classList.remove('hidden');
    editTaskForm.scrollIntoView({ behavior: 'smooth' });
    editTaskFormTextArea.value = task.description;
    editTaskForm.onsubmit = (event) => {
        event.preventDefault();
        updateTaskDescription(task, taskElement);
        taskElement.classList.remove('taskBeingEdited');
        hideEditTaskForm();
    };
}

/**
 * Updates the description of a task and updates the corresponding task element in the DOM.
 * @param {Object} task - The task object to be updated.
 * @param {HTMLElement} taskElement - The HTML element representing the task in the DOM.
 */
function updateTaskDescription(task, taskElement) {
    task.description = editTaskFormTextArea.value;
    taskElement.querySelector('p').textContent = task.description;
    addToLocalStorage('tasks', tasks);
};

/**
 * Renders all tasks in the task list.
 */
function renderAllTasks() {
    if (tasks.length > 0) {
        tasks.forEach((task) => {
            const taskElement = addTaskToUlTaskList(task)
            renderActiveTask(task, taskElement);
            renderCompletedTasks(task, taskElement);
            updateActiveTaskSectionText();
        });
    }
}

/**
 * Renders the active task by adding a CSS class to the task element.
 * @param {Object} task - The task object.
 * @param {HTMLElement} taskElement - The task element to be rendered.
 */
function renderActiveTask(task, taskElement) {
    if (activeTask && activeTask.description === task.description) {
        taskElement.classList.add('app__section-task-list-item-active');
    }
}

/**
 * Renders completed tasks by adding a CSS class to the task element.
 * @param {Object} task - The task object to be rendered.
 */
function renderCompletedTasks(task, taskElement) {
    const index = completedTasks.findIndex(
        completedTask => completedTask.description === task.description
    );
    if (index !== -1) {
        taskElement.classList.add('app__section-task-list-item-complete');
    }
}
