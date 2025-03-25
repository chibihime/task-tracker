// ===============================
// Task Class Definition 
// ===============================

class Task {
    constructor(name, description, dueDate) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = false;
    }
}

// ===============================
// DOM Element References
// ===============================

const addTaskButton = document.getElementById('addTaskButton');
const taskNameInput = document.getElementById('taskName');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDueDateInput = document.getElementById('taskDueDate');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const searchInput = document.getElementById('searchInput');
const animatedBackground = document.getElementById('animatedBackground');

// ===============================
// Task Management
// ===============================

let tasks = JSON.parse(localStorage.getItem('tasks'))?.map(task => Object.assign(new Task(), task)) || [];

const renderTasks = () => {
    taskList.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task => {
        if (filterSelect.value === 'completed') return task.completed;
        if (filterSelect.value === 'pending') return !task.completed;
        return true;
    }).filter(task => task.name.toLowerCase().includes(searchTerm));

    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div>No tasks found.</div>';
        return;
    }

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="toggle-task" data-index="${index}" ${task.completed ? 'checked' : ''}>
                <div class="task-details">
                    <strong>${task.name}</strong> - ${task.description} <br>
                    <small>Due: ${task.dueDate || 'No due date'}</small>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-task" data-index="${index}">Edit</button>
                <button class="delete-task" data-index="${index}">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Attach event listeners to the dynamically added buttons and checkboxes
    document.querySelectorAll('.edit-task').forEach(button => button.addEventListener('click', handleEditTask));
    document.querySelectorAll('.delete-task').forEach(button => button.addEventListener('click', handleDeleteTask));
    document.querySelectorAll('.toggle-task').forEach(checkbox => checkbox.addEventListener('change', handleToggleTask));
};
//Updated such that due dates can't be before today
const addTask = () => {
    const name = taskNameInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const dueDate = taskDueDateInput.value.trim();

    if (!name || !description) return;

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    if (dueDate && dueDate < today) {
        alert("Due date cannot be in the past. Please select today or a future date.");
        return;
    }

    tasks.push(new Task(name, description, dueDate));
    taskNameInput.value = '';
    taskDescriptionInput.value = '';
    taskDueDateInput.value = '';

    renderTasks();
};


// Edit Task Handler : Updated such that due dates can't be before today 
const handleEditTask = (event) => {
    const index = event.target.dataset.index;
    const task = tasks[index];
    const newName = prompt('Edit Task Name:', task.name);
    const newDescription = prompt('Edit Task Description:', task.description);
    const newDueDate = prompt('Edit Task Due Date (YYYY-MM-DD):', task.dueDate);

    if (newName && newDescription) {
        const today = new Date().toISOString().split('T')[0];

        if (newDueDate && newDueDate < today) {
            alert("Due date cannot be in the past. Please select today or a future date.");
            return;
        }

        task.name = newName;
        task.description = newDescription;
        if (newDueDate) task.dueDate = newDueDate;

        renderTasks();
    }
};

// Delete Task Handler
const handleDeleteTask = (event) => {
    const index = event.target.dataset.index;
    tasks.splice(index, 1);
    renderTasks();
};

// Toggle Task Completion Handler
const handleToggleTask = (event) => {
    const index = event.target.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
};

addTaskButton.addEventListener('click', addTask);
filterSelect.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

renderTasks();

// ===============================
// Animated Background Logic
// ===============================
const ctx = animatedBackground.getContext('2d');
const stars = [];
const numStars = 250;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
    });
}

function animateBackground() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        star.y += star.speed;

        if (star.y > window.innerHeight) {
            star.y = 0;
            star.x = Math.random() * window.innerWidth;
        }
    });

    requestAnimationFrame(animateBackground);
}

animatedBackground.width = window.innerWidth;
animatedBackground.height = window.innerHeight;

window.addEventListener('resize', () => {
    animatedBackground.width = window.innerWidth;
    animatedBackground.height = window.innerHeight;
});

animateBackground();
