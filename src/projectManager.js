import { Todo } from './taskManager.js';

export class Project {
    constructor(name) {
        this.name = name;
        this.todoList = [];
    }

    addTask(title, description, dueDate, priority) {
        const newTask = new Todo(title, description, dueDate, priority);
        this.todoList.push(newTask);
    }

    getTasks() {
        return this.todoList;
    }

    removeTask(taskId) {
        const index = this.todoList.findIndex(task => task.title === taskId);
        if (index !== -1) {
            this.todoList.splice(index, 1);
        }
    }

    clearTasks() {
        this.todoList = [];
    }
}

export class ProjectManager {
    constructor() {
        this.projects = this.loadProjectsFromStorage() || [];
    }

    createProject(name) {
        const newProject = new Project(name);
        this.projects.push(newProject);
        this.saveProjectsToStorage();
    }

    renameProject(oldName, newName) {
        const project = this.getProject(oldName);
        if (project) {
            project.name = newName;
            this.saveProjectsToStorage();
        } else {
            console.error(`Project "${oldName}" not found.`);
        }
    }

    deleteProject(name) {
        const index = this.projects.findIndex(project => project.name === name);
        if (index !== -1) {
            this.projects.splice(index, 1);
            this.saveProjectsToStorage();
        } else {
            console.error(`Project "${name}" not found.`);
        }
    }

    getProject(name) {
        return this.projects.find(project => project.name === name);
    }

    addTaskToProject(projectName, title, description, dueDate, priority) {
        const project = this.getProject(projectName);
        if (project) {
            project.addTask(title, description, dueDate, priority);
            this.saveProjectsToStorage();
        } else {
            console.error(`Project "${projectName}" not found.`);
        }
    }

    saveProjectsToStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    loadProjectsFromStorage() {
        const projectsData = localStorage.getItem('projects');
        if (projectsData) {
            const parsedData = JSON.parse(projectsData);
            return parsedData.map(projectData => {
                const project = new Project(projectData.name);
                project.todoList = projectData.todoList.map(
                    task => new Todo(task.title, task.description, task.dueDate, task.priority)
                );
                return project;
            });
        }
        return null;
    }
}
