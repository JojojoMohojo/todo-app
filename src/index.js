import "./styles.css";
import { appController } from "./app-controller.js";
import { uiController } from "./ui-controller.js";

uiController.setUpEventListeners();
// Check if local storage is available and load it if so
appController.setIsLocalStorageActive(storageAvailable("localStorage"));
if (appController.getIsLocalStorageActive()) {
  console.log("Loading from Storage");
  appController.loadFromStorage();
  if (appController.projects.length === 0) {
    console.log("No projects found in storage - creating example projects");
    createDummyProjects();
  }
} else {
  console.log("Creating example projects");
  createDummyProjects();
}

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

function createDummyProjects() {
  appController.createProject("Welcome to You-do!", "This is an example project that you can edit to your liking. Double click on the project name or description to change it to something else, or create a new project! Click the icon to the left of me to create a new list for this Project.");
  createDummyLists();
}

function createDummyLists() {
  appController.projects[0].createList("These are your lists", appController.projects[0]);
  appController.projects[0].createList("Add new todos to your lists", appController.projects[0]);
  createDummyTodos();
}

function createDummyTodos() {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  console.log(appController.projects[0].lists[0]);

  appController.projects[0].lists[0].createTodo("You can double click me too!",
    new Date("2025-07-05"),
    1,
    appController.projects[0].lists[0]
  );

  appController.projects[0].lists[0].createTodo(
    "Double click the date or priority to change it",
    new Date("2025-07-20"),
    2,
    appController.projects[0].lists[0]
  );

  appController.projects[0].lists[1].createTodo(
    "You will see me on the Home page under 'Due'",
    todayDate,
    3,
    appController.projects[0].lists[1]
  );
  
  appController.projects[0].lists[1].createTodo(
    "Me too! I'm due today but a lower priority",
    todayDate,
    4,
    appController.projects[0].lists[1]
  );

  appController.projects[0].lists[1].createTodo(
    "I should appear under Tomorrow",
    tomorrowDate,
    1,
    appController.projects[0].lists[1]
  );

  appController.projects[0].lists[1].createTodo(
    "Any todos not due today or tomorrow are Upcoming",
    new Date("2025-10-29"),
    5, 
    appController.projects[0].lists[1]
  );
}

// End of temporary functions
uiController.renderProjectsList();
appController.switchPage();