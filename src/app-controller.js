import { loadHomePage } from "./home-page";
import { Project } from "./project";
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

    setActiveProject(projectId) {
        const previousActiveProject = this.activeProject;
        if (projectId) {
            this.activeProject = this.projects.find(project => project.id === projectId);
            uiController.highlightActiveProject(projectId, previousActiveProject?.id);
        } else {
            this.activeProject = null;
        }
    }
    
    //Temporary function
    createDummyProjects() {
        this.projects.push(new Project("Time to cut", "Plan out my cutting phase over the summer"));
        this.projects.push(new Project("Get a new job", "Get a job in programming before July rolls around"));
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