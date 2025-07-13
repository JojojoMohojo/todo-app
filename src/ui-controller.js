import { appController } from "./app-controller";
import { svg } from "./svg";
import { format } from "date-fns";
import { VirtualList } from "./virtual-list";
import { validator } from "./validator";

class UIController {
    constructor() {
        this.content = document.querySelector(".content");
        this.menuToggle = document.querySelector(".menu-toggle");
        this.sidebar = document.querySelector(".sidebar");
        this.titleIcon = document.querySelector(".title-icon");
        this.pageTitle = document.querySelector(".page-title");
        this.pageTitleEditHandler = null;

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
        this.highlightActiveProject(appController.getActiveProject());
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

        deleteIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            appController.deleteProject(project);
        });

        const description = document.createElement("div");
        description.classList.add("nav-project-desc");
        description.innerHTML = project.description;

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
        const titleWrapper = document.querySelector(".page-title-wrapper");

        // Clear and recreate the pageTitle to make sure it always exists on reload
        titleWrapper.innerHTML = "";
        this.pageTitle = document.createElement("div");
        this.pageTitle.classList.add("page-title");
        this.pageTitle.textContent = "Home";

        titleWrapper.appendChild(this.pageTitle);

        this.pageTitle.textContent= "Home";
        this.titleIcon.innerHTML = svg.getSvgIcons().homeIcon;

        if (this.pageTitleEditHandler) {
            this.pageTitle.removeEventListener("dblclick", this.pageTitleEditHandler);
            this.pageTitleEditHandler = null;
        }

        this.clearContent();

        const horizontalDivider = document.createElement("div");
        horizontalDivider.classList.add("horizontal-divider", "main-divider");
        this.content.appendChild(horizontalDivider);

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

        // Clear and recreate the pageTitle to make sure it always exists on reload
        const titleWrapper = document.querySelector(".page-title-wrapper");
        titleWrapper.innerHTML = "";
        this.pageTitle = document.createElement("div");
        this.pageTitle.classList.add("page-title");
        this.pageTitle.textContent = project.title;

        titleWrapper.appendChild(this.pageTitle);

        this.pageTitle.textContent = project.title;
        this.titleIcon.innerHTML = svg.getSvgIcons().projectIcon;

        if (this.pageTitleEditHandler) {
            this.pageTitle.removeEventListener("dblclick", this.pageTitleEditHandler);
        }

        const enterEditProjectTitle = () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = this.pageTitle.textContent;
            input.classList.add("edit-input", "project-edit-input");
            input.setAttribute("maxlength", "21");

            const rect = this.pageTitle.getBoundingClientRect();
            input.style.width = `${rect.width + 12}px`;

            this.pageTitle.replaceWith(input);
            input.focus();

            input.addEventListener("input", () => {
                input.style.width = "1px";
                input.style.width = `${input.scrollWidth + 1}px`;
            });

            const commitEdit = () => {
                appController.getActiveProject().changeTitle(input.value);
                this.renderProjectsList();
                this.rerenderPage();
            };

            input.addEventListener("blur", commitEdit);
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") e.preventDefault(), input.blur();
            });
        };

        this.pageTitle.addEventListener("dblclick", enterEditProjectTitle);

        let projectTitlePressTimer;
        this.pageTitle.addEventListener("touchstart", () => {
            projectTitlePressTimer = setTimeout(enterEditProjectTitle, 500);
        });
        this.pageTitle.addEventListener("touchend", () => {
            clearTimeout(projectTitlePressTimer);
        });

        // Clear content and then recreate it 
        this.clearContent();
        
        const horizontalDivider = document.createElement("div");
        horizontalDivider.classList.add("horizontal-divider", "main-divider");
        this.content.appendChild(horizontalDivider);

        const projectInfo = document.createElement("div");
        projectInfo.classList.add("project-info");
        this.content.appendChild(projectInfo);

        const newListButton = document.createElement("div");
        newListButton.classList.add("new-list-button", "pointer");
        newListButton.innerHTML = svg.getSvgIcons().addListIcon;
        projectInfo.appendChild(newListButton);

        newListButton.addEventListener("click", () => {
            this.openDialog("list");
        });

        const verticalDivider = document.createElement("div");
        verticalDivider.classList.add("vertical-divider", "project-info-divider");
        projectInfo.appendChild(verticalDivider);

        const descriptionContainer = document.createElement("div");
        descriptionContainer.classList.add("desc-container");
        projectInfo.appendChild(descriptionContainer);

        const description = document.createElement("div");
        description.classList.add("project-description");
        description.textContent = project.description;
        descriptionContainer.appendChild(description);

        const enterEditProjectDescription = () => {
            const textarea = document.createElement("textarea");
            textarea.value = project.description;
            textarea.classList.add("edit-input", "desc-edit-input");
            textarea.style.overflow = "hidden";
            textarea.style.resize = "none";
            textarea.setAttribute("maxlength", "200");

            description.replaceWith(textarea);
            textarea.focus();

            const commitEdit = () => {
                project.changeDescription(textarea.value);
                this.rerenderPage();
                this.renderProjectsList();
            };

            textarea.addEventListener("blur", commitEdit);
            textarea.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    textarea.blur();
                }
            });
        };

        descriptionContainer.addEventListener("dblclick", enterEditProjectDescription);

        let projectDescPressTimer;
        descriptionContainer.addEventListener("touchstart", () => {
            projectDescPressTimer = setTimeout(enterEditProjectDescription, 500);
        });
        descriptionContainer.addEventListener("touchend", () => {
            clearTimeout(projectDescPressTimer);
        });

        const dividerClone = horizontalDivider.cloneNode(true);
        this.content.appendChild(dividerClone);

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
                list.project.deleteList(list);
                rerenderFn();
            })

            if (list.todos.length === 0) {
                const message = document.createElement("div");
                message.classList.add("no-todos");
                message.textContent = "No todos found.";
                section.appendChild(message);
            }

            const enterEditListTitle = () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = list.title;
                input.classList.add("edit-input", "list-edit-input");
                input.setAttribute("maxlength", "36");

                const rect = heading.getBoundingClientRect();
                input.style.width = `${rect.width + 30}px`;

                input.addEventListener("input", () => {
                    input.style.width = "1px";
                    input.style.width = `${input.scrollWidth + 1}px`;
                });

                heading.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    list.changeTitle(input.value);
                    this.rerenderPage();
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") e.preventDefault(), input.blur();
                });
            };

            heading.addEventListener("dblclick", enterEditListTitle);

            let listHeadingPressTimer;
            heading.addEventListener("touchstart", () => {
                listHeadingPressTimer = setTimeout(enterEditListTitle, 500);
            });
            heading.addEventListener("touchend", () => {
                clearTimeout(listHeadingPressTimer);
            });

        }

        const ul = document.createElement("ul");

        list.todos.forEach((todo, index) => {
            const todoItem = document.createElement("li");
            todoItem.id = `${todo.id}`

            const container = document.createElement("div");
            container.classList.add("list-item-container");

            const left = document.createElement("div");
            left.classList.add("todo-left");
            container.appendChild(left);

            const right = document.createElement("div");
            right.classList.add("todo-right");
            container.appendChild(right);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `${list.title.toLowerCase()}-item-${index}`;
            checkbox.name = checkbox.id;
            checkbox.checked = todo.completed;
            left.appendChild(checkbox);

            const description = document.createElement("div");
            description.classList.add("todo-description");
            description.textContent = todo.description;

            const enterEditDescription = () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = todo.description;
                input.classList.add("edit-input", "todo-edit-description-input");
                input.setAttribute("maxlength", "36");

                const rect = description.getBoundingClientRect();
                input.style.width = `${rect.width + 30}px`;

                input.addEventListener("input", () => {
                    input.style.width = "1px";
                    input.style.width = `${input.scrollWidth + 1}px`;
                });

                description.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    todo.changeDescription(input.value);
                    this.rerenderPage();
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });
            };

            description.addEventListener("dblclick", enterEditDescription);

            let descPressTimer;
            description.addEventListener("touchstart", () => {
                descPressTimer = setTimeout(enterEditDescription, 500);
            });
            description.addEventListener("touchend", () => {
                clearTimeout(descPressTimer);
            });

            left.appendChild(description);

            const date = document.createElement("div");
            date.classList.add("todo-date");
            const formattedDate = format(todo.dueDate, "dd MMM yyyy");
            date.textContent = formattedDate;

            const enterEditDate = () => {
                const input = document.createElement("input");
                input.type = "date";

                const clonedDate = new Date(todo.dueDate.getTime());
                clonedDate.setHours(0, 0, 0, 0);
                const year = clonedDate.getFullYear();
                const month = String(clonedDate.getMonth() + 1).padStart(2, '0');
                const day = String(clonedDate.getDate()).padStart(2, '0');
                input.value = `${year}-${month}-${day}`;

                input.classList.add("edit-input", "todo-edit-date-input");

                date.replaceWith(input);
                input.focus();

                const commitEdit = () => {
                    const validation = validator.validateTodoDate(input);
                    if (!validation.isValid) {
                        input.replaceWith(date);
                        return;
                    }

                    const [year, month, day] = input.value.split("-");
                    const newDate = new Date(year, month - 1, day);
                    newDate.setHours(0, 0, 0, 0);

                    todo.changeDueDate(newDate);
                    this.rerenderPage();
                };

                input.addEventListener("blur", commitEdit);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });
            };

            date.addEventListener("dblclick", enterEditDate);

            let datePressTimer;
            date.addEventListener("touchstart", () => {
                datePressTimer = setTimeout(enterEditDate, 500);
            });
            date.addEventListener("touchend", () => {
                clearTimeout(datePressTimer);
            });

            right.appendChild(date);

            const priority = document.createElement("div");
            priority.classList.add("todo-priority");
            priority.textContent = todo.priority;

            const enterEditPriority = () => {
                const select = document.createElement("select");
                select.classList.add("edit-input", "todo-edit-priority-input");

                for (let i = 1; i <= 5; i++) {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = i;
                    if (i === todo.priority) option.selected = true;
                    select.appendChild(option);
                }

                priority.replaceWith(select);
                select.focus();

                const commitEdit = () => {
                    const newPriority = parseInt(select.value);
                    if (!isNaN(newPriority)) {
                        todo.changePriority(newPriority);
                    }
                    this.rerenderPage();
                };

                select.addEventListener("blur", commitEdit);
                select.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") select.blur();
                });
            };

            priority.addEventListener("dblclick", enterEditPriority);

            let priorityPressTimer;
            priority.addEventListener("touchstart", () => {
                priorityPressTimer = setTimeout(enterEditPriority, 500);
            });
            priority.addEventListener("touchend", () => {
                clearTimeout(priorityPressTimer);
            });

            right.appendChild(priority);

            if (todo.completed) {
                description.classList.add("completed-todo-text");
                date.classList.add("completed-todo-details");
                priority.classList.add("completed-todo-details");
            } else {
                description.classList.remove("completed-todo-text");
                date.classList.remove("completed-todo-details");
                priority.classList.remove("completed-todo-details");
            }

            checkbox.addEventListener("click", () => {
                todo.changeCompletedStatus();
                if (todo.completed) {
                    description.classList.add("completed-todo-text");
                    date.classList.add("completed-todo-details");
                    priority.classList.add("completed-todo-details");
                } else {
                    description.classList.remove("completed-todo-text");
                    date.classList.remove("completed-todo-details");
                    priority.classList.remove("completed-todo-details");
                }
            })    

            const deleteTodoButton = document.createElement("div");
            deleteTodoButton.classList.add("delete-todo-button");
            deleteTodoButton.classList.add("pointer");
            deleteTodoButton.innerHTML = svg.getSvgIcons().trashIcon;
            right.appendChild(deleteTodoButton);

            deleteTodoButton.addEventListener("click", () => {
                todo.list.deleteTodo(todo);
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
                return validator.validateProjectForm(
                    this.newProjectTitle,
                    this.newProjectDesc
                );
            case "list":
                return validator.validateListForm(
                    this.newListTitle
                );
            case "todo":
                return validator.validateTodoForm(
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
        this.newProject.addEventListener("click", () => {
            this.openDialog("project");
        })        

        this.createProjectButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearErrorMessages();
            const validation = this.validateForm("project")
            if (validation.isValid) {
                const title = this.newProjectTitle.value;
                const description = this.newProjectDesc.value;
                const project = appController.createProject(title, description);
                this.clearForm("project");
                appController.setActiveProject(project);
                appController.switchPage(project);
                this.sidebar.classList.remove("open");
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

        this.menuToggle.addEventListener("click", () => {
          this.sidebar.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
          const isClickInsideSidebar = this.sidebar.contains(event.target);
          const isClickOnMenuButton = this.menuToggle.contains(event.target);
          const isClickOnProjectDialog = this.newProjectDialog.contains(event.target);

          // If it's not inside the sidebar and not the toggle button, close the sidebar
          if (!isClickInsideSidebar && !isClickOnMenuButton && !isClickOnProjectDialog && this.sidebar.classList.contains("open")) {
            this.sidebar.classList.remove("open");
          }
        });

    }
}

export const uiController = new UIController();