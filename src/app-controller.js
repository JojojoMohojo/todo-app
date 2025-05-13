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
    
    //Temporary functions
    createDummyProjects() {
        this.projects.push(new Project("Time to cut", "The plan is to cut around 8kg before September. Start slow and measure weight loss along the way. Maybe start to measure body fat at some point."));
        this.projects.push(new Project("Get a new job", "Get a job in programming before July rolls around"));
        this.createDummyLists();
    }

    createDummyLists() {
        this.projects[1].lists.push(new List("Setup phase - 3 weeks", this.projects[0]));
        this.projects[1].lists.push(new List("Mid phase - 3 months", this.projects[0]));
        this.createDummyTodos();
    }

    createDummyTodos() {
        this.projects[1].lists[0].todos.push(new Todo("Log foods every day", new Date("2025-04-29"), 1, this.projects[0].lists[0]));
        this.projects[1].lists[0].todos.push(new Todo("Weigh myself every day", new Date("2025-05-29"), 2, this.projects[0].lists[0]));
        this.projects[1].lists[0].todos.push(new Todo("Don't eat too much food", new Date("2025-04-30"), 3, this.projects[0].lists[0]));

        this.projects[1].lists[1].todos.push(new Todo("Maintain protein intake", new Date("2025-04-05"), 2, this.projects[0].lists[1]));
        this.projects[1].lists[1].todos.push(new Todo("Weigh myself every day", null, 1, this.projects[0].lists[1]));
        this.projects[1].lists[1].todos.push(new Todo("Measure body fat percentage every week", null, 3, this.projects[0].lists[1]));
        this.projects[1].lists[2].todos.push(new Todo("Decrease calorie intake as time progresses", new Date("2025-06-29"), 5, this.projects[0].lists[1]));
    }
    // End of temporary functions

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