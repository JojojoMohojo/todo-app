import { appController } from "./app-controller";

class UIController {
    constructor() {
        //this.links = document.querySelector(".links");
        this.newProject = document.querySelector(".nav-new-project");
        this.projectList = document.querySelector(".project-list");

        //SVG
        this.projectIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"/></svg>
        `;
    }

    renderProjectsList(projects) { 
        while (this.projectList.querySelector(".project")) {
            this.projectList.querySelector(".project").remove();
        };
        projects.forEach(project => this.createProjectElement(project));
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
        icon.innerHTML = this.projectIcon;

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

    setUpEventListeners() { 
        this.newProject.addEventListener("click", () => {
            const title = prompt("Enter project title");
            const description = prompt("Enter project description");
            appController.createProject(title, description);
        })
    }
}

export const uiController = new UIController();