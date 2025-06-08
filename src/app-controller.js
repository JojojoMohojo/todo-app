import { List } from "./list";
import { Project } from "./project";
import { Todo } from "./todo";
import { uiController } from "./ui-controller";

class AppController {
    constructor() {
        this.projects = [];
        this.activeProject = null;
        this.isLocalStorageActive = false;
    }

    getIsLocalStorageActive() {
        return this.isLocalStorageActive;
    }

    setIsLocalStorageActive(result) {
        result ? this.isLocalStorageActive = true : this.isLocalStorageActive = false;
    }

    getProjects() {
        return this.projects;
    }

    getActiveProject() {
        return this.activeProject;
    }

    setActiveProject(project) {
        const previousActiveProject = this.activeProject;
        if (project) {
            this.activeProject = project;
            uiController.highlightActiveProject(project, previousActiveProject);
        } else {
            this.activeProject = null;
            uiController.highlightActiveProject(null, previousActiveProject);
        }
    }    

    createProject(title, description) {
        const project = new Project(title, description);
        this.projects.push(project);
        uiController.renderProjectsList(this.projects);
        this.setActiveProject(project);
        uiController.closeDialog("project");
    }

    deleteProject(projectId) { 
        this.projects = this.projects.filter(project => project.id !== projectId);

        if (projectId === this.activeProject.id) {
            this.switchPage();
        }
        if (this.getIsLocalStorageActive()) this.saveToStorage();
        uiController.renderProjectsList();
    }

    switchPage(project) {
        this.setActiveProject(project);
        if (project) {
            uiController.renderProjectPage(project);
        } else {
            uiController.renderHomePage();
        }
    }   
    
    saveToStorage() {
        const projectsCopy = this.projects.map(project => {
            const projCopy = {
                ...project,
                lists: project.lists.map(list => {
                    const listCopy = {
                        ...list,
                        todos: list.todos.map(todo => {
                            const { list, ...todoCopy } = todo;
                            return todoCopy;
                        })
                    };
                    delete listCopy.project;
                    return listCopy;
                })
            };
            return projCopy;
        });

        localStorage.setItem("projects", JSON.stringify(projectsCopy));
    }

    loadFromStorage() {
        const rawData = JSON.parse(localStorage.getItem("projects"));
        if (!Array.isArray(rawData)) {
            this.projects = [];
            return;
        }

        const restoredProjects = rawData.map(projectData => {
            const project = new Project(projectData.title, projectData.description);
            project.id = projectData.id;

            projectData.lists.forEach(listData => {
                const list = new List(listData.title, project);
                list.id = listData.id;

                listData.todos.forEach(todoData => {
                    const todo = new Todo(
                        todoData.description,
                        todoData.dueDate ? new Date(todoData.dueDate) : null,
                        todoData.priority,
                        list
                    );
                    todo.id = todoData.id;
                    todo.completed = todoData.completed;
                    list.todos.push(todo);
                });

                project.lists.push(list);
            });

            return project;
        });

        this.projects = restoredProjects;
    }
}

export const appController = new AppController();