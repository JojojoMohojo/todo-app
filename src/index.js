import "./styles.css";
import { appController } from "./app-controller.js";
import { uiController } from "./ui-controller.js";

uiController.setUpEventListeners();
// Check if local storage is available and load it if so
appController.setIsLocalStorageActive(storageAvailable("localStorage"));
if (appController.getIsLocalStorageActive()) appController.loadFromStorage();

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

//Temporary functions
if (false === true) {
    createDummyProjects();
}

function createDummyProjects() {
    appController.createProject("Time to cut", "The plan is to cut around 8kg before September. Start slow and measure weight loss along the way. Maybe start to measure body fat at some point.");
    appController.createProject("Get a new job", "Get a job in programming before July rolls around");
    createDummyLists();
}

function createDummyLists() {
    appController.projects[1].createList("Setup phase - 3 weeks", appController.projects[0]);
    appController.projects[1].createList("Mid phase - 3 months", appController.projects[1]);
    createDummyTodos();
}

function createDummyTodos() {
    appController.projects[1].lists[0].createTodo("Log foods every day", new Date("2025-04-29"), 1, appController.projects[1].lists[0]);
    appController.projects[1].lists[0].createTodo("Weigh myself every day", new Date("2025-05-19"), 2, appController.projects[1].lists[0]);
    appController.projects[1].lists[0].createTodo("Don't eat too much food", new Date("2025-04-30"), 3, appController.projects[1].lists[0]);
    appController.projects[1].lists[1].createTodo("Maintain protein intake", new Date("2025-04-05"), 2, appController.projects[1].lists[1]);
    appController.projects[1].lists[1].createTodo("Measure body fat percentage every week", new Date("2025-05-16"), 3, appController.projects[1].lists[1]);
    appController.projects[1].lists[1].createTodo("Decrease calorie intake as time progresses", new Date("2025-06-29"), 5, appController.projects[1].lists[1]);
}

// End of temporary functions
uiController.renderProjectsList();
appController.switchPage();