export const loadHomePage = (content) => {
    
    // Section builder helper
    const createSection = (title, tasks) => {
        const section = document.createElement("div");
        section.classList.add("section");

        const heading = document.createElement("div");
        heading.classList.add("heading");
        heading.textContent = title;
        section.appendChild(heading);

        const ul = document.createElement("ul");

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            const container = document.createElement("div");
            container.classList.add("list-item-container");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `${title.toLowerCase()}-item-${index}`;
            checkbox.name = checkbox.id;

            const label = document.createElement("label");
            label.setAttribute("for", checkbox.id);
            label.textContent = task;

            container.appendChild(checkbox);
            container.appendChild(label);
            li.appendChild(container);
            ul.appendChild(li);
        });

        section.appendChild(ul);
        return section;
    };

    // Build sections
    const todaySection = createSection("Today", [
        "Do a clothes wash",
        "Pack bags",
        "Water plants"
    ]);

    const tomorrowSection = createSection("Tomorrow", [
        "Wake up",
        "Go to Thorpe park",
        "Return home"
    ]);

    const upcomingSection = createSection("Upcoming", [
        "Do some coding",
        "Job hunt",
        "Play video games"
    ]);

    // Append sections to content
    content.appendChild(todaySection);
    content.appendChild(tomorrowSection);
    content.appendChild(upcomingSection);
};
