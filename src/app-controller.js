import { loadHomePage } from "./home-page";
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

    setActiveProject(projectId) {
        const previousActiveProject = this.activeProject;
        if (projectId) {
            this.activeProject = this.projects.find(project => project.id === projectId);
            uiController.highlightActiveProject(projectId, previousActiveProject?.id);
        } else {
            this.activeProject = null;
        }
    }
    
    //Temporary functions
    createDummyProjects() {
        this.projects.push(new Project("Time to cut", "Plan out my cutting phase over the summer"));
        this.projects.push(new Project("Get a new job", "Get a job in programming before July rolls around"));
        this.createDummyLists();
    }

    createDummyLists() {
        this.projects[0].lists.push(new List("Setup phase - 3 weeks", this.projects[0]));
        this.projects[0].lists.push(new List("Mid phase - 3 months", this.projects[0]));
        this.createDummyTodos();
    }

    createDummyTodos() {
        this.projects[0].lists[0].todos.push(new Todo("Log foods every day", new Date("2025-04-29"), 1, this.projects[0].lists[0]));
        this.projects[0].lists[0].todos.push(new Todo("Weigh myself every day", new Date("2025-05-29"), 2, this.projects[0].lists[0]));
        this.projects[0].lists[0].todos.push(new Todo("Don't eat too much food", new Date("2025-04-30"), 2, this.projects[0].lists[0]));

        this.projects[0].lists[1].todos.push(new Todo("Maintain protein intake", new Date("2025-04-05"), 1, this.projects[0].lists[1]));
        this.projects[0].lists[1].todos.push(new Todo("Weigh myself every day", null, 1, this.projects[0].lists[1]));
        this.projects[0].lists[1].todos.push(new Todo("Measure body fat percentage every week", null, 3, this.projects[0].lists[1]));
        this.projects[0].lists[1].todos.push(new Todo("Decrease calorie intake as time progresses", null, 1, this.projects[0].lists[1]));
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
        if (projectId) {
            this.setActiveProject(projectId);
            uiController.renderProjectPage(projectId);
        } else {
            this.setActiveProject();
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