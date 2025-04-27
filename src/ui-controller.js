import { appController } from "./app-controller";
import { svg } from "./svg";

class UIController {
    constructor() {
        //Side bar
        this.newProject = document.querySelector(".nav-new-project");
        this.projectList = document.querySelector(".project-list");

        //New project form
        this.newProjectDialog = document.querySelector(".new-project-dialog");
        this.newProjectForm = document.querySelector("#new-project-form");
        this.createProjectButton = document.querySelector("#create-project-button");
        this.closeProjectButton = document.querySelector("#close-project-button");
        this.newProjectTitle = document.querySelector("#new-project-title");
        this.newProjectDesc = document.querySelector("#new-project-desc");
    }

    renderProjectsList() { 
        while (this.projectList.querySelector(".project")) {
            this.projectList.querySelector(".project").remove();
        };
        appController.getProjects().forEach(project => this.createProjectElement(project));
    }

    createProjectElement(project) {
        const newProject = document.createElement("li");
        newProject.classList.add("project");
        newProject.classList.add("pointer");
        newProject.id = `${project.id}`;

        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");

        const icon = document.createElement("div");
        icon.classList.add("nav-project-icon");
        icon.classList.add("nav-icon");
        icon.innerHTML = svg.getSvgIcons().projectIcon;

        const name = document.createElement("div");
        name.classList.add("nav-project-name");
        name.classList.add("bold");
        name.innerHTML = project.title;

        const description = document.createElement("div");
        description.classList.add("nav-project-desc");
        description.innerHTML = project.description;

        projectContainer.addEventListener("click", () => {
            appController.switchPage(project.id);
        });

        projectContainer.appendChild(icon);
        projectContainer.appendChild(name);
        projectContainer.appendChild(description);
        newProject.appendChild(projectContainer);
        this.projectList.appendChild(newProject);
    }

    renderTodosForProject(projectId) { 
        
    }

    highlightActiveProject(newProjectId, oldProjectId) {
        if (oldProjectId) {
            document.querySelector(`#${CSS.escape(oldProjectId)}`)?.classList.remove("active-project");
        }
        if (newProjectId) {
            document.querySelector(`#${CSS.escape(newProjectId)}`)?.classList.add("active-project");
        }
    }

    openDialog(type) {
        switch (type) {
            case "project":
                this.newProjectDialog.showModal();
        }    
    }

    closeDialog(type) {
        switch (type) {
            case "project":
                this.newProjectDialog.close();
        }    
    }

    clearForm(type) {
        switch (type) {
            case "project":
                this.newProjectForm.reset();
        } 
    }

    setUpEventListeners() { 
        this.newProject.addEventListener("click", (e) => {
            this.openDialog("project");
        })

        this.closeProjectButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.closeDialog("project");
            this.clearForm("project");
        })

        this.createProjectButton.addEventListener("click", (e) => {
            e.preventDefault();
            appController.createProject(this.newProjectTitle.value, this.newProjectDesc.value);
            this.clearForm("project");
        })
    }
}

export const uiController = new UIController();