import { loadHomePage } from "./home-page";
import { Project } from "./project";
import { uiController } from "./ui-controller";

class AppController {
    constructor() {
        this.projects = [];
        this.activeProject = null;
    }

    getActiveProject() {
        return this.activeProject;
    }

    setActiveProject(projectId) {
        const previousActiveProject = this.activeProject;
        if (projectId) {
            this.activeProject = this.projects.find(project => project.id === projectId);
            uiController.highlightActiveProject(projectId, previousActiveProject?.id);
        } else {
            this.activeProject = null;
        }
    }
       

    createProject(title, description) {
        const project = new Project(title, description);
        this.projects.push(project);
        uiController.renderProjectsList(this.projects);
        this.setActiveProject(project.id);
    }

    deleteProject(projectId) { 
        this.projects = this.projects.filter(project => project.id !== projectId);
    }

    switchPage(projectId) {
        this.setActiveProject(projectId);
        uiController.highlightActiveProject(projectId);
        /*if (projectId) {
            loadProjectPage(projectId);
            this.setActiveProject(projectId);
        } else {
            loadHomePage();
            this.setActiveProject();
        }*/
    }
    
    saveToStorage() { 
        // TBC
    }

    loadFromStorage() { 
        // TBC
    }
}

export const appController = new AppController();