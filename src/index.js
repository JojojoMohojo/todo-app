import "./styles.css";
import { appController } from "./app-controller.js";
import { uiController } from "./ui-controller.js";
import { loadHomePage } from "./home-page.js";

const content = document.querySelector(".content");

function clearContent() {
    while (content.hasChildNodes()) {
        content.removeChild(content.firstChild);
    }
}



uiController.setUpEventListeners();
if (appController.getProjects() === null) {
    appController.createProject("Default", "Default");
}
appController.createDummyProjects();
uiController.renderProjectsList();
loadHomePage(content);