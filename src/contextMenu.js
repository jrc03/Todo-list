// contextMenu.js
import { projectManager, selectedProject, updateSelectedProject, refreshUI } from './index.js';
import { openDialog } from './dialogManager.js';

let selectedElement = null;
let isProject = false;

export function showContextMenu(event, element, elementIsProject) {
    event.preventDefault();
    selectedElement = element;
    isProject = elementIsProject;
    const contextMenu = document.querySelector("#contextMenu");
    contextMenu.style.display = "block";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    
    const editItem = contextMenu.querySelector("#editItem");
    const deleteItem = contextMenu.querySelector("#deleteItem");
    editItem.textContent = isProject ? "Edit Project" : "Edit Task";
    deleteItem.textContent = isProject ? "Delete Project" : "Delete Task";
}

export function hideContextMenu() {
    const contextMenu = document.querySelector("#contextMenu");
    contextMenu.style.display = "none";
}

export function handleContextMenuActions() {
    const contextMenu = document.querySelector("#contextMenu");
    contextMenu.addEventListener('click', (event) => {
        if (selectedElement) {
            if (event.target.id === "editItem") {
                isProject ? editProject(selectedElement) : editTask(selectedElement);
            } else if (event.target.id === "deleteItem") {
                isProject ? deleteProject(selectedElement) : deleteTask(selectedElement);
            }
            hideContextMenu();
        }
    });
}



function editProject(projectElement) {
    const projectName = projectElement.getAttribute("data-id");
    const projectNameInput = document.querySelector("#projectName");
    const submitProjectButton = document.querySelector("#submitProject");
    const projectDialog = document.querySelector("#addProjectDialog");

    projectNameInput.value = projectName;
    submitProjectButton.value = "Update Project";

    const updateProjectHandler = (e) => {
        e.preventDefault();
        const newProjectName = projectNameInput.value;
        if (newProjectName && newProjectName !== projectName) {
            projectManager.renameProject(projectName, newProjectName);
            projectManager.saveProjectsToStorage();
            updateSelectedProject(newProjectName);
            refreshUI();
        }
        projectDialog.close();
    };

    // Remove existing event listeners
    const newSubmitButton = submitProjectButton.cloneNode(true);
    submitProjectButton.parentNode.replaceChild(newSubmitButton, submitProjectButton);

    // Add new event listener
    newSubmitButton.addEventListener('click', updateProjectHandler);

    openDialog(projectDialog);
}

function deleteProject(projectElement) {
    const projectName = projectElement.getAttribute("data-id");
    if (confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
        projectManager.deleteProject(projectName);
        if (selectedProject === projectName) {
            const newSelectedProject = projectManager.projects[0]?.name || null;
            updateSelectedProject(newSelectedProject);
        }
        refreshUI();
    }
}

function editTask(taskElement) {
    const taskId = taskElement.getAttribute("data-id");
    const project = projectManager.getProject(selectedProject);
    const task = project.getTasks().find(t => t.title === taskId);
    
    if (task) {
        const taskNameInput = document.querySelector("#taskName");
        const taskDueDateInput = document.querySelector("#taskDueDate");
        const taskDescriptionInput = document.querySelector("#taskDescription");
        const taskPriorityInput = document.querySelector("#taskPriority");
        
        taskNameInput.value = task.title;
        taskDueDateInput.value = task.dueDate;
        taskDescriptionInput.value = task.description;
        taskPriorityInput.value = task.priority;
        
        const dialog = document.querySelector("#addTaskDialog");
        const submitButton = document.querySelector("#submitTask");
        submitButton.value = "Update Task";
        
        const updateTaskHandler = (e) => {
            e.preventDefault();
            const updatedTitle = taskNameInput.value;
            const updatedDueDate = taskDueDateInput.value;
            const updatedDescription = taskDescriptionInput.value;
            const updatedPriority = taskPriorityInput.value;

            task.update(updatedTitle, updatedDescription, updatedDueDate, updatedPriority);
            projectManager.saveProjectsToStorage();
            refreshUI();
            dialog.close();
        };
        
        // Remove existing event listeners
        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        
        // Add new event listener
        newSubmitButton.addEventListener('click', updateTaskHandler);
        
        openDialog(dialog);
    }
}

function deleteTask(taskElement) {
    const taskId = taskElement.getAttribute("data-id");
    if (confirm(`Are you sure you want to delete this task?`)) {
        const project = projectManager.getProject(selectedProject);
        project.removeTask(taskId);
        projectManager.saveProjectsToStorage();
        refreshUI();
    }
}

function updateTask(task) {
    const updatedTitle = document.querySelector("#taskName").value;
    const updatedDueDate = document.querySelector("#taskDueDate").value;
    const updatedDescription = document.querySelector("#taskDescription").value;
    const updatedPriority = document.querySelector("#taskPriority").value;
    task.update(updatedTitle, updatedDescription, updatedDueDate, updatedPriority);
    projectManager.saveProjectsToStorage();
}


export function initializeContextMenuListeners() {
    document.addEventListener('contextmenu', (event) => {
        const projectElement = event.target.closest('#allProjectsList li');
        const taskElement = event.target.closest('#taskList li');
        
        if (projectElement) {
            showContextMenu(event, projectElement, true);
        } else if (taskElement) {
            showContextMenu(event, taskElement, false);
        } else {
            hideContextMenu();
        }
    });

    document.addEventListener('click', () => {
        hideContextMenu();
    });

    handleContextMenuActions();
}