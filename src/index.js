import "./styles.css";
import { loadHomePage } from "./home-page.js";
import { Project } from "./project.js";
// import { loadMenuPage } from "./menu-page.js";
// import { loadAboutPage } from "./about-page.js";

const content = document.querySelector(".content");

/*document.querySelector(".home").addEventListener("click", () => {
    clearContent();
    loadHomePage(homeBackground);
});

function clearContent() {
    while (homeBackground.hasChildNodes()) {
        homeBackground.removeChild(homeBackground.firstChild);
    }
}*/

loadHomePage(content);

//remove later
window.Project = Project;



