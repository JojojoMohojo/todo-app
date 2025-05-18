import { List } from "./list";
import { Project } from "./project";
import { Todo } from "./todo";
import { uiController } from "./ui-controller";

class AppController {
    constructor() {
        this.projects = [];
        this.activeProject = null;
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
        this.setActiveProject(project.id);
        uiController.closeDialog("project");
    }

    deleteProject(projectId) { 
        this.projects = this.projects.filter(project => project.id !== projectId);
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
        // TBC
    }

    loadFromStorage() { 
        // TBC
    }
}

export const appController = new AppController();