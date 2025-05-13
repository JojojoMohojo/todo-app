import { appController } from "./app-controller";
import { svg } from "./svg";
import { format } from "date-fns";

class UIController {
    constructor() {
        this.content = document.querySelector(".content");
        this.pageTitle = document.querySelector(".page-title")
        //Side bar
        this.homeButton = document.querySelector(".nav-home");
        this.newProject = document.querySelector(".nav-new-project");
        this.projectList = document.querySelector(".project-list");

        //New project form
        this.newProjectDialog = document.querySelector(".new-project-dialog");
        this.newProjectForm = document.querySelector("#new-project-form");
        this.createProjectButton = document.querySelector("#create-project-button");
        this.closeProjectButton = document.querySelector("#close-project-button");
        this.newProjectTitle = document.querySelector("#new-project-title");
        this.newProjectDesc = document.querySelector("#new-project-desc");

        //New todo form
        this.newTodoDialog = document.querySelector(".new-todo-dialog");
        this.newTodoForm = document.querySelector("#new-todo-form");
        this.createTodoButton = document.querySelector("#create-todo-button");
        this.closeTodoButton = document.querySelector("#close-todo-button");
        this.newTodoDesc = document.querySelector("#new-todo-desc");
        this.newTodoDate = document.querySelector("#new-todo-date");
        this.newTodoPriority = document.querySelector("#new-todo-priority");
    }   

    clearContent() {
        while (this.content.hasChildNodes()) {
            this.content.removeChild(this.content.firstChild);
        }
    }

    renderProjectsList() { 
        while (this.projectList.querySelector(".project")) {
            this.projectList.querySelector(".project").remove();
        };
        appController.getProjects().forEach(project =>  {
            if (project.title !== "Default") {
                this.createProjectElement(project)
            }
        });
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
            appController.switchPage(project);
        });

        projectContainer.appendChild(icon);
        projectContainer.appendChild(name);
        projectContainer.appendChild(description);
        newProject.appendChild(projectContainer);
        this.projectList.appendChild(newProject);
    }

    renderHomePage() {
        this.pageTitle.textContent= "Home";
        this.clearContent();

        const projects = appController.getProjects();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dueTodos = [];
        const tomorrowTodos = [];
        const upcomingTodos = [];

        projects.forEach(project =>
            project.lists.forEach(list =>
                list.todos.forEach(todo => {
                    if (!(todo.dueDate instanceof Date)) return;
                    const time = todo.dueDate.getTime();
                    if (time <= today.getTime()) dueTodos.push(todo);
                    else if (time === tomorrow.getTime()) tomorrowTodos.push(todo);
                    else upcomingTodos.push(todo);
                })
            )
        ); 

        dueTodos.sort((a, b) => a.priority - b.priority);
        tomorrowTodos.sort((a, b) => a.priority - b.priority);
        upcomingTodos.sort((a, b) => a.priority - b.priority);

        if (dueTodos.length) this.content.appendChild(this.createSection("Due", dueTodos, () => this.renderHomePage(this.content)));
        if (tomorrowTodos.length) this.content.appendChild(this.createSection("Tomorrow", tomorrowTodos, () => this.renderHomePage(this.content)));
        if (upcomingTodos.length) this.content.appendChild(this.createSection("Upcoming", upcomingTodos, () => this.renderHomePage(this.content)));
    }
    
    renderProjectPage() {
        const project = appController.getActiveProject();
        this.pageTitle.textContent = project.title;
        this.clearContent();

        const description = document.createElement("div");
        description.classList.add("project-description");
        description.textContent = project.description;
        this.content.appendChild(description);

        project.lists.forEach(list => {
            list.todos.sort((a, b) => a.priority - b.priority);
            this.content.appendChild(this.createSection(list.title, list.todos, () => this.renderProjectPage(this.content)));
        })
    }

    // Section builder helper
    createSection(title, todos, rerenderFn) {
        const section = document.createElement("div");
        section.classList.add("section");

        const headingContainer = document.createElement("div");
        headingContainer.classList.add("heading-container");
        section.appendChild(headingContainer);

        // const newButton = document.createElement("div");
        // newButton.classList.add("new-todo-button");
        // newButton.classList.add("pointer");
        // newButton.innerHTML = svg.getSvgIcons().addBoxIcon;
        // headingContainer.appendChild(newButton);
        // newButton.addEventListener("click", (e) => {
        //     uiController.openDialog("todo");
        // })

        const heading = document.createElement("div");
        heading.classList.add("heading");
        heading.textContent = title;
        headingContainer.appendChild(heading);        

        const ul = document.createElement("ul");

        todos.forEach((todo, index) => {
            const todoItem = document.createElement("li");
            todoItem.id = `${todo.id}`

            const container = document.createElement("div");
            container.classList.add("list-item-container");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `${title.toLowerCase()}-item-${index}`;
            checkbox.name = checkbox.id;
            checkbox.checked = todo.completed;
            checkbox.addEventListener("click", () => {
                todo.changeCompletedStatus();
            })

            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.textContent = todo.description;

            const date = document.createElement("div");
            date.classList.add("todo-date");
            const formattedDate = format(todo.dueDate, "dd MMM yyyy");
            date.textContent = formattedDate;

            const priority = document.createElement("div");
            priority.classList.add("todo-priority");
            priority.textContent = todo.priority;

            const deleteButton = document.createElement("div");
            deleteButton.classList.add("delete-todo-button");
            deleteButton.classList.add("pointer");
            deleteButton.innerHTML = svg.getSvgIcons().trashIcon;
            deleteButton.addEventListener("click", () => {
                todo.list.deleteTodo(todo.id);
                rerenderFn();
            })

            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(date);
            container.appendChild(priority);
            container.appendChild(deleteButton);
            todoItem.appendChild(container);
            ul.appendChild(todoItem);
        });

        section.appendChild(ul);
        return section;
    };

    highlightActiveProject(newProject, oldProject) {
        if (oldProject) {
            document.querySelector(`#${CSS.escape(oldProject.id)}`)?.classList.remove("active-project");
        }
        if (newProject) {
            document.querySelector(`#${CSS.escape(newProject.id)}`)?.classList.add("active-project");
        }
    }

    openDialog(type) {
        switch (type) {
            case "project":
                this.newProjectDialog.showModal();
                break;
            /*case "list":
                this.newListForm.showModal();
                break;*/
            case "todo":
                this.newTodoDialog.showModal();
                break;
        }    
    }

    closeDialog(type) {
        switch (type) {
            case "project":
                this.newProjectDialog.close();
                break;
            /*case "list":
                this.newListForm.close();
                break;*/
            case "todo":
                this.newTodoDialog.close();
                break;
        }    
    }

    clearForm(type) {
        switch (type) {
            case "project":
                this.newProjectForm.reset();
                break;
            /*case "list":
                this.newListForm.reset();
                break;*/
            case "todo":
                this.newTodoDialog.reset();
                break;
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

        this.createTodoButton.addEventListener("click", (e) => {
            e.preventDefault();
            appController.createTodo(this.newTodoDesc.value, this.newTodoDate.value, this.newTodoPriority.value)
            this.clearForm("todo");
        })

        this.homeButton.addEventListener("click", () => {
            appController.switchPage();
        })
    }
}

export const uiController = new UIController();