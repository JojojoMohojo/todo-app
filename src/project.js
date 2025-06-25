import { appController } from "./app-controller.js";
import { List } from "./list.js";

export class Project {
    constructor(title, description) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.lists = [];
    }

    changeTitle(newTitle) {
        this.title = newTitle;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    changeDescription(newDescription) {
        this.description = newDescription;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    createList(title) {
        const list = new List(title, this);
        this.lists.push(list);
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    deleteList(list) {
        this.lists = this.lists.filter(item => item.id !== list.id);
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }
}