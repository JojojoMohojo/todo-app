import { appController } from "./app-controller.js";
import { svg } from "./svg";
import { uiController } from "./ui-controller.js";

export const loadHomePage = (content) => {
    uiController.renderHomeSections(content);

};
