import "./styles.css";
import { initializeProjectDialogListeners, initializeTaskDialogListeners, initializeClearDialogListeners } from './dialogManager.js';
import { ProjectManager } from './projectManager.js';
import { initializeContextMenuListeners } from './contextMenu.js';

// Initialize project manager
export const projectManager = new ProjectManager();
export let selectedProject = "Default Project";

// Function to display tasks of the selected project
export function displayTasks(projectName) {
    const project = projectManager.getProject(projectName);
    const taskList = document.querySelector("#taskList");
    taskList.innerHTML = ""; // Clear existing tasks

    if (project) {
        project.getTasks().forEach(task => {
            const listItem = document.createElement("li");
            listItem.setAttribute("data-priority", task.priority);
            listItem.setAttribute("data-id", task.title);

            const taskName = document.createElement("strong");
            taskName.textContent = task.title;

            const taskDueDate = document.createElement("p");
            taskDueDate.textContent = `Due: ${task.dueDate}`;
            taskDueDate.classList.add("task-due-date");

            const taskDescription = document.createElement("p");
            taskDescription.textContent = task.description;
            taskDescription.classList.add("task-description");

            listItem.appendChild(taskName);
            listItem.appendChild(taskDueDate);
            listItem.appendChild(taskDescription);
            taskList.appendChild(listItem);
        });
    }
}

export function updateSelectedProject(newProjectName) {
    selectedProject = newProjectName;
    displayTasks(selectedProject);
}

export function displayProjects() {
    const allProjectsList = document.querySelector("#allProjectsList");
    allProjectsList.innerHTML = ""; // Clear existing projects

    projectManager.projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = project.name;
        li.dataset.id = project.name;

        li.addEventListener('click', () => {
            selectedProject = project.name;
            displayTasks(selectedProject);
            highlightSelectedProject(li);
        });

        allProjectsList.appendChild(li);
    });

    // Set initial selected project
    if (projectManager.projects.length > 0) {
        if (!projectManager.getProject(selectedProject)) {
            selectedProject = projectManager.projects[0].name;
        }
        displayTasks(selectedProject);
        highlightSelectedProject(allProjectsList.querySelector(`li[data-id="${selectedProject}"]`));
    } else {
        document.querySelector("#taskList").innerHTML = ""; // No projects left, clear tasks
    }
}

export function refreshUI() {
    displayProjects();
    if (selectedProject) {
        displayTasks(selectedProject);
    }
}

// Highlight the selected project
function highlightSelectedProject(selectedLi) {
    document.querySelectorAll("#allProjectsList li").forEach(li => {
        li.classList.remove("selected");
    });
    selectedLi.classList.add("selected");
}

// Function to add a task to the selected project
function addTask(e) {
    e.preventDefault(); // Prevent form submission
    const taskName = document.querySelector("#taskName").value;
    const taskDueDate = document.querySelector("#taskDueDate").value;
    const taskDescription = document.querySelector("#taskDescription").value;
    const taskPriority = document.querySelector("#taskPriority").value;

    if (taskName && taskDueDate) {
        projectManager.addTaskToProject(selectedProject, taskName, taskDescription, taskDueDate, taskPriority);
        projectManager.saveProjectsToStorage(); // Save changes
        refreshUI(); // Refresh the entire UI
        document.querySelector("#addTaskDialog").close();
        document.querySelector("#taskForm").reset(); // Reset the form
    } else {
        alert("Please fill in the task name and due date.");
    }
}

// Initialize dialog event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeProjectDialogListeners();
    initializeTaskDialogListeners();
    initializeClearDialogListeners();

    if (!projectManager.getProject("Default Project")) {
        projectManager.createProject("Default Project");
    }

    refreshUI();

    const addTaskBtn = document.querySelector("#submitTask");
addTaskBtn.addEventListener('click', addTask);

    document.querySelector("#addTaskDialog").addEventListener('close', () => {
        document.querySelector("#taskForm").reset();
        addTaskBtn.value = "Add Task";
        addTaskBtn.onclick = addTask;
    });

    // Initialize context menu
    initializeContextMenuListeners();
});

// Add project creation listener
document.querySelector("#submitProject").addEventListener('click', () => {
    const projectName = document.querySelector("#projectName").value;
    if (projectName) {
        projectManager.createProject(projectName);
        refreshUI();
    } else {
        alert("Please enter a project name.");
    }
});

// Clear tasks listener
document.querySelector("#confirmClearBtn").addEventListener('click', () => {
    const project = projectManager.getProject(selectedProject);
    if (project) {
        project.clearTasks();
        projectManager.saveProjectsToStorage();
        refreshUI();
    }
    document.querySelector("#clearDialog").close();
});