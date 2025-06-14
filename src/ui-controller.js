import { appController } from "./app-controller";
import { svg } from "./svg";
import { format } from "date-fns";
import { VirtualList } from "./virtual-list";
import { formValidator } from "./form-validator";

class UIController {
    constructor() {
        this.content = document.querySelector(".content");
        this.titleIcon = document.querySelector(".title-icon");
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

        //New list form
        this.activeList = null;
        this.newTodoDialog = document.querySelector(".new-todo-dialog");
        this.newTodoForm = document.querySelector("#new-todo-form");
        this.createTodoButton = document.querySelector("#create-todo-button");
        this.closeTodoButton = document.querySelector("#close-todo-button");
        this.newTodoDesc = document.querySelector("#new-todo-desc");
        this.newTodoDate = document.querySelector("#new-todo-date");
        this.newTodoPriority = document.querySelector("#new-todo-priority");

        //New todo form
        this.newListDialog = document.querySelector(".new-list-dialog");
        this.newListForm = document.querySelector("#new-list-form");
        this.createListButton = document.querySelector("#create-list-button");
        this.closeListButton = document.querySelector("#close-list-button");
        this.newListTitle = document.querySelector("#new-list-title");
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

        const projectIcon = document.createElement("div");
        projectIcon.classList.add("nav-project-icon");
        projectIcon.classList.add("nav-icon");
        projectIcon.innerHTML = svg.getSvgIcons().projectIcon;

        const name = document.createElement("div");
        name.classList.add("nav-project-name");
        name.classList.add("bold");
        name.innerHTML = project.title;

        const deleteIcon = document.createElement("div");
        deleteIcon.classList.add("nav-delete-icon");
        deleteIcon.classList.add("nav-icon");
        deleteIcon.innerHTML = svg.getSvgIcons().trashIcon;

        deleteIcon.addEventListener("click", () => {
            appController.deleteProject(project.id);
            console.log("click");
        });

        const description = document.createElement("div");
        description.classList.add("nav-project-desc");
        project.description.length <= 35 ?
            description.innerHTML = project.description :
            description.innerHTML = project.description.slice(0, 35).trim() + "...";

        projectContainer.addEventListener("click", () => {
            appController.switchPage(project);
        });

        projectContainer.appendChild(projectIcon);
        projectContainer.appendChild(name);
        projectContainer.appendChild(deleteIcon);
        projectContainer.appendChild(description);
        newProject.appendChild(projectContainer);
        this.projectList.appendChild(newProject);
    }

    renderHomePage() {
        this.pageTitle.textContent= "Home";
        this.titleIcon.innerHTML = svg.getSvgIcons().homeIcon;
        this.clearContent();

        const projects = appController.getProjects();
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(todayDate.getDate() + 1);

        let dueTodos = [];
        let tomorrowTodos = [];
        let upcomingTodos = [];

        projects.forEach(project =>
            project.lists.forEach(list =>
                list.todos.forEach(todo => {
                    if (!(todo.dueDate instanceof Date)) return;
                    const time = todo.dueDate.getTime();
                    if (time <= todayDate.getTime()) dueTodos.push(todo);
                    else if (time === tomorrowDate.getTime()) tomorrowTodos.push(todo);
                    else upcomingTodos.push(todo);
                })
            )
        ); 

        dueTodos.sort((a, b) => a.priority - b.priority);
        tomorrowTodos.sort((a, b) => a.priority - b.priority);
        upcomingTodos.sort((a, b) => a.priority - b.priority);

        const dueList = new VirtualList("Due", dueTodos, todayDate);
        const tomorrowList = new VirtualList("Tomorrow", tomorrowTodos, tomorrowDate);
        const upcomingList = new VirtualList("Upcoming", upcomingTodos);     

        if (dueTodos.length) this.content.appendChild(this.createSection(dueList, () => this.renderHomePage(this.content)));
        if (tomorrowTodos.length) this.content.appendChild(this.createSection(tomorrowList, () => this.renderHomePage(this.content)));
        if (upcomingTodos.length) this.content.appendChild(this.createSection(upcomingList, () => this.renderHomePage(this.content)));
    }
    
    renderProjectPage() {
        const project = appController.getActiveProject();
        this.pageTitle.textContent = project.title;
        this.titleIcon.innerHTML = svg.getSvgIcons().projectIcon;
        this.clearContent();

        const description = document.createElement("div");
        description.classList.add("project-description");
        description.textContent = project.description;
        this.content.appendChild(description);

        description.addEventListener("dblclick", () => {
            const textarea = document.createElement("textarea");
            textarea.value = project.description;
            textarea.classList.add("edit-input");
            textarea.id = "desc-edit-input";
            textarea.style.margin = 0;
            textarea.style.padding = getComputedStyle(description).padding;

            // Clone to measure initial size
            const descriptionClone = description.cloneNode(true);
            descriptionClone.style.visibility = "hidden";
            descriptionClone.style.position = "absolute";
            descriptionClone.style.whiteSpace = "pre-wrap";
            descriptionClone.className = description.className;
            descriptionClone.style.fontSize = getComputedStyle(description).fontSize;
            descriptionClone.style.fontFamily = getComputedStyle(description).fontFamily;
            descriptionClone.style.lineHeight = getComputedStyle(description).lineHeight;
            descriptionClone.style.width = getComputedStyle(description).width;
            descriptionClone.style.padding = getComputedStyle(description).padding;
            descriptionClone.textContent = project.description;
            document.body.appendChild(descriptionClone);

            textarea.style.width = `${descriptionClone.offsetWidth}px`;
            textarea.style.height = `${descriptionClone.offsetHeight + 5}px`;

            document.body.removeChild(descriptionClone);

            description.replaceWith(textarea);
            textarea.focus();

            const commitEdit = () => {
                debugger;
                project.changeDescription(textarea.value);
                this.rerenderPage();
            };

            textarea.addEventListener("blur", commitEdit);
            textarea.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // prevent line break
                    textarea.blur();
                }
            });
        });

        const newListContainer = document.createElement("div");
        newListContainer.classList.add("new-list-container");
        newListContainer.classList.add("pointer");
        newListContainer.classList.add("bold");
        newListContainer.textContent = "New list";

        const newList = document.createElement("div");
        newList.classList.add("new-list-button");
        newList.innerHTML = svg.getSvgIcons().addListIcon;

        newListContainer.appendChild(newList);
        this.content.appendChild(newListContainer);

        newListContainer.addEventListener("click", () => {
            this.openDialog("list");
        });

        project.lists.forEach(list => {
            list.todos.sort((a, b) => a.priority - b.priority);
            this.content.appendChild(this.createSection(list, () => this.renderProjectPage(this.content)));
        });        

        if (this.content.children.length === 2) {
            const message = document.createElement("div");
            message.classList.add("no-lists");
            message.textContent = "No lists found. Start by creating a list and adding some todos";
            this.content.appendChild(message);
        }
    }

    rerenderPage() {
        if (appController.getActiveProject()) {
            this.renderProjectPage();
        } else {
            this.renderHomePage();
        }
    }

    // Section builder helper
    createSection(list, rerenderFn) {
        const section = document.createElement("div");
        section.classList.add("section");

        const headingContainer = document.createElement("div");
        headingContainer.classList.add("heading-container");
        section.appendChild(headingContainer);

        const heading = document.createElement("div");
        heading.classList.add("heading");
        heading.textContent = list.title;
        headingContainer.appendChild(heading);        

        if (!list.isVirtual) {
            const newButton = document.createElement("div");
            newButton.classList.add("new-todo-button");
            newButton.classList.add("pointer");
            newButton.innerHTML = svg.getSvgIcons().addBoxIcon;
            headingContainer.appendChild(newButton);

            newButton.addEventListener("click", () => {
                this.activeList = list;
                this.openDialog("todo");
                if (list.dateHint) {
                    const localDate = new Date(list.dateHint.getFullYear(), list.dateHint.getMonth(), list.dateHint.getDate());
                    this.newTodoDate.valueAsDate = localDate;
                }
            });
            
            const deleteListButton = document.createElement("div");
            deleteListButton.classList.add("delete-list-button");
            deleteListButton.classList.add("pointer");
            deleteListButton.innerHTML = svg.getSvgIcons().trashIcon;
            headingContainer.appendChild(deleteListButton);

            deleteListButton.addEventListener("click", () => {
                list.project.deleteList(list.id);
                rerenderFn();
            })

            if (list.todos.length === 0) {
                const message = document.createElement("div");
                message.classList.add("no-todos");
                message.textContent = "No todos found.";
                section.appendChild(message);
            }

            heading.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = list.title;
                input.classList.add("edit-input");
                input.classList.add("list-edit-input");

                // Clone to measure original width
                const headingClone = heading.cloneNode(true);
                headingClone.style.visibility = "hidden";
                headingClone.style.position = "absolute";
                headingClone.style.whiteSpace = "pre";
                headingClone.style.fontSize = getComputedStyle(heading).fontSize;
                headingClone.style.fontFamily = getComputedStyle(heading).fontFamily;
                document.body.appendChild(headingClone);

                const headingWidth = headingClone.offsetWidth;
                input.style.width = `${headingWidth + 25}px`;
                document.body.removeChild(headingClone);

                // Live resizing mirror
                const mirror = document.createElement("span");
                mirror.style.position = "absolute";
                mirror.style.visibility = "hidden";
                mirror.style.whiteSpace = "pre";
                mirror.style.fontSize = getComputedStyle(heading).fontSize;
                mirror.style.fontFamily = getComputedStyle(heading).fontFamily;
                document.body.appendChild(mirror);

                input.addEventListener("input", () => {
                    mirror.textContent = input.value || " ";
                    input.style.width = `${mirror.offsetWidth + 10}px`;
                });

                heading.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    list.changeTitle(input.value);
                    this.rerenderPage();
                    document.body.removeChild(mirror);
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });
            });
        }

        const ul = document.createElement("ul");

        list.todos.forEach((todo, index) => {
            const todoItem = document.createElement("li");
            todoItem.id = `${todo.id}`

            const container = document.createElement("div");
            container.classList.add("list-item-container");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `${list.title.toLowerCase()}-item-${index}`;
            checkbox.name = checkbox.id;
            checkbox.checked = todo.completed;
            container.appendChild(checkbox);

            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.textContent = todo.description;

            label.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = todo.description;
                input.classList.add("edit-input");
                input.classList.add("todo-edit-label-input");

                // Clone label to measure width
                const labelClone = label.cloneNode(true);
                labelClone.style.visibility = "hidden";
                labelClone.style.position = "absolute";
                labelClone.style.whiteSpace = "pre";
                labelClone.style.fontSize = getComputedStyle(label).fontSize;
                labelClone.style.fontFamily = getComputedStyle(label).fontFamily;
                document.body.appendChild(labelClone);

                // Match initial input width to label's width
                const labelWidth = labelClone.offsetWidth;
                input.style.width = `${labelWidth + 10}px`;
                document.body.removeChild(labelClone);

                // Add listener to auto-resize as user types
                input.addEventListener("input", () => {
                    mirror.textContent = input.value || " ";
                    input.style.width = `${mirror.offsetWidth + 10}px`;
                });

                // Create hidden mirror span for live resizing
                const mirror = document.createElement("span");
                mirror.style.position = "absolute";
                mirror.style.visibility = "hidden";
                mirror.style.whiteSpace = "pre";
                mirror.style.fontSize = getComputedStyle(label).fontSize;
                mirror.style.fontFamily = getComputedStyle(label).fontFamily;
                document.body.appendChild(mirror);

                label.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    todo.changeDescription(input.value);
                    this.rerenderPage();
                    document.body.removeChild(mirror);
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });
            });

            container.appendChild(label);
            
            const date = document.createElement("div");
            date.classList.add("todo-date");
            const formattedDate = format(todo.dueDate, "dd MMM yyyy");
            date.textContent = formattedDate;

            date.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "date";
                input.valueAsDate = todo.dueDate;
                input.classList.add("edit-input");
                input.classList.add("todo-edit-date-input");

                date.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    const newDate = input.valueAsDate;
                    if (newDate) {
                        todo.changeDueDate(newDate);
                    }
                    this.rerenderPage();
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });
            });
            container.appendChild(date);

            const priority = document.createElement("div");
            priority.classList.add("todo-priority");
            priority.textContent = todo.priority;

            priority.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "number";
                input.value = todo.priority;
                input.classList.add("edit-input");
                input.classList.add("todo-edit-priority-input");

                priority.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    const newPriority = parseInt(input.value);
                    if (!isNaN(newPriority)) {
                        todo.changePriority(newPriority);
                    }
                    this.rerenderPage();
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });
            });
            container.appendChild(priority);

            if (todo.completed) {
                label.classList.add("completed-todo-text");
                date.classList.add("completed-todo-details");
                priority.classList.add("completed-todo-details");
            } else {
                label.classList.remove("completed-todo-text");
                date.classList.remove("completed-todo-details");
                priority.classList.remove("completed-todo-details");
            }

            checkbox.addEventListener("click", () => {
                todo.changeCompletedStatus();
                if (todo.completed) {
                    label.classList.add("completed-todo-text");
                    date.classList.add("completed-todo-details");
                    priority.classList.add("completed-todo-details");
                } else {
                    label.classList.remove("completed-todo-text");
                    date.classList.remove("completed-todo-details");
                    priority.classList.remove("completed-todo-details");
                }
            })    

            const deleteTodoButton = document.createElement("div");
            deleteTodoButton.classList.add("delete-todo-button");
            deleteTodoButton.classList.add("pointer");
            deleteTodoButton.innerHTML = svg.getSvgIcons().trashIcon;
            container.appendChild(deleteTodoButton);

            deleteTodoButton.addEventListener("click", () => {
                todo.list.deleteTodo(todo.id);
                rerenderFn();
            })

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
            case "list":
                this.newListDialog.showModal();
                break;
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
            case "list":
                this.newListDialog.close();
                break;
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
            case "list":
                this.newListForm.reset();
                break;
            case "todo":
                this.newTodoForm.reset();
                break;
        } 
    }

    validateForm(type) {
        switch (type) {
            case "project":
                return formValidator.validateProjectForm(
                    this.newProjectTitle,
                    this.newProjectDesc
                );
            case "list":
                return formValidator.validateListForm(
                    this.newListTitle
                );
            case "todo":
                return formValidator.validateTodoForm(
                    this.newTodoDesc,
                    this.newTodoDate,
                    this.newTodoPriority
                );
        }
    }

    addErrorMessage(input, reason) {
        const formRow = input.parentNode;
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");

        const messages = {
            "new-project-title_empty": "*Please enter a title.",
            "new-project-title_too_long": "*Title is too long.",
            "new-project-desc_empty": "*Please enter a description.",
            "new-project-desc_too_long": "*Description is too long.",
            "new-list-title_empty": "*Please enter a title.",
            "new-list-title_too_long": "*Title is too long.",
            "new-todo-desc_empty": "*Please enter a description.",
            "new-todo-desc_too_long": "*Description is too long.",
            "new-todo-date_empty": "*Please select a date.",
            "new-todo-date_invalid": "*Due date must be today or later.",
            "new-todo-priority_empty": "*Please enter a priority.",
            "new-todo-priority_invalid": "*Priority must be between 1 and 5."
        };

        errorMessage.textContent = messages[`${input.id}_${reason}`] || "Invalid input.";
        formRow.appendChild(errorMessage);
    }

    clearErrorMessages() {
        this.newProjectForm.querySelectorAll(".error-message").forEach(message => message.remove());
        this.newListForm.querySelectorAll(".error-message").forEach(message => message.remove());
        this.newTodoForm.querySelectorAll(".error-message").forEach(message => message.remove());
    }

    setUpEventListeners() { 
        this.newProject.addEventListener("click", (e) => {
            this.openDialog("project");
        })        

        this.createProjectButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            const validation = this.validateForm("project")
            if (validation.isValid) {
                const title = this.newProjectTitle.value;
                const description = this.newProjectDesc.value;
                appController.createProject(title, description);
                this.clearForm("project");
            } else {
                validation.invalidInputs.forEach(({ input, reason }) => {
                    this.addErrorMessage(input, reason);
                });
            }            
        })

        this.createListButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            const validation = this.validateForm("list");
            if (validation.isValid) {
                const title = this.newListTitle.value;
                const project = appController.getActiveProject();
                project.createList(title, project);
                this.clearForm("list");
                this.closeDialog("list");
                this.rerenderPage();
            } else {
                validation.invalidInputs.forEach(({ input, reason }) => {
                    this.addErrorMessage(input, reason);
                });
            }    
        })        

        this.createTodoButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            const validation = this.validateForm("todo");
            if (validation.isValid) {
                const description = this.newTodoDesc.value;
                const date = this.newTodoDate.valueAsDate;
                const priority = parseInt(this.newTodoPriority.value);
                this.activeList.createTodo(description, date, priority);
                
                this.clearForm("todo");
                this.closeDialog("todo");
                this.rerenderPage();
            } else {
                validation.invalidInputs.forEach(({ input, reason }) => {
                    this.addErrorMessage(input, reason);
                });
            }            
        });

        this.closeProjectButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            this.closeDialog("project");
            this.clearForm("project");
        })

        this.closeListButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            this.closeDialog("list");
            this.clearForm("list");
        })

        this.closeTodoButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            this.closeDialog("todo");
            this.clearForm("todo");
        })

        this.homeButton.addEventListener("click", () => {
            this.clearErrorMessages();
            appController.switchPage();
        })
    }
}

export const uiController = new UIController();