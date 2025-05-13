import "./styles.css";
import { appController } from "./app-controller.js";
import { uiController } from "./ui-controller.js";
import { Project } from "./project.js";

const content = document.querySelector(".content");

uiController.setUpEventListeners();
if (appController.getProjects().length === 0) {
    appController.createProject("Default", "Default");
    const project = appController.getProjects()[0];
    project.createList("Default");
    console.log(appController.getProjects()[0].lists[0]);
}
appController.createDummyProjects();
uiController.renderProjectsList();
appController.switchPage();