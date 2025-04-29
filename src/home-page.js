import { appController } from "./app-controller.js";
import { svg } from "./svg";

export const loadHomePage = (content) => {
    let projects = appController.getProjects();
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    let todayTodos = [];
    let tomorrowTodos = [];
    let upcomingTodos = [];    

    projects.forEach(
        project => project.lists.forEach(
            list => list.todos.forEach(
                (todo) => {
                    if (todo.dueDate instanceof Date && todo.dueDate.getTime() === today.getTime()) {
                        console.log(`Todo is due today: ${today} - ${todo.dueDate}`);
                        todayTodos.push(todo);
                    } else {
                        console.log(`Todo is NOT due today: ${today} - ${todo.dueDate}`);
                    }
                }
            )
        )
    );

    projects.forEach(
        project => project.lists.forEach(
            list => list.todos.forEach(
                (todo) => {
                    if (todo.dueDate instanceof Date && todo.dueDate.getTime() === tomorrow.getTime()) {
                        console.log(`Todo is due today: ${today} - ${todo.dueDate}`);
                        tomorrowTodos.push(todo);
                    } else {
                        console.log(`Todo is NOT due today: ${today} - ${todo.dueDate}`);
                    }
                }
            )
        )
    );

    projects.forEach(
        project => project.lists.forEach(
            list => list.todos.forEach(
                (todo) => {
                    if (todo.dueDate instanceof Date && todo.dueDate.getTime() !== today.getTime() && todo.dueDate.getTime() !== tomorrow.getTime()) {
                        console.log(`Todo is due today: ${today} - ${todo.dueDate}`);
                        upcomingTodos.push(todo);
                    } else {
                        console.log(`Todo is NOT due today: ${today} - ${todo.dueDate}`);
                    }
                }
            )
        )
    );

    console.log(todayTodos);

    


    // Section builder helper
    const createSection = (title, todos) => {
        const section = document.createElement("div");
        section.classList.add("section");

        const headingContainer = document.createElement("div");
        headingContainer.classList.add("heading-container");
        section.appendChild(headingContainer);

        const newButton = document.createElement("div");
        newButton.classList.add("new-todo-button");
        newButton.classList.add("pointer");
        newButton.innerHTML = svg.getSvgIcons().addBoxIcon;
        headingContainer.appendChild(newButton);

        const heading = document.createElement("div");
        heading.classList.add("heading");
        heading.textContent = title;
        headingContainer.appendChild(heading);        

        const ul = document.createElement("ul");

        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            const container = document.createElement("div");
            container.classList.add("list-item-container");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `${title.toLowerCase()}-item-${index}`;
            checkbox.name = checkbox.id;

            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.textContent = todo.description;

            container.appendChild(checkbox);
            container.appendChild(label);
            li.appendChild(container);
            ul.appendChild(li);
        });

        section.appendChild(ul);
        return section;
    };

    // Build sections
    const todaySection = createSection("Today", todayTodos);
    const tomorrowSection = createSection("Tomorrow", tomorrowTodos);
    const upcomingSection = createSection("Upcoming", upcomingTodos);

    // Append sections to content
    content.appendChild(todaySection);
    content.appendChild(tomorrowSection);
    content.appendChild(upcomingSection);
};
