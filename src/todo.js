import { appController } from "./app-controller.js";

export class Todo {
    constructor(description, dueDate, priority, list) {
        this.id = crypto.randomUUID();
        this.description = description;
        this.dueDate = dueDate ? new Date(dueDate.setHours(0, 0, 0, 0)) : null;
        this.priority = priority;
        this.completed = false;
        this.list = list;
        this.listId = list.id;
    }

    changeDescription(newDescription) {
        this.description = newDescription;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    changeDueDate(newDate) {
        this.dueDate = newDate;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }
    
    changePriority(newPriority) {
        this.priority = newPriority;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    changeCompletedStatus() {
        this.completed = !this.completed;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }
}