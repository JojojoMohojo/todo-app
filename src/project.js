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
    }

    changeDescription(newDescription) {
        this.description = newDescription;
    }

    createList(title) {
        const list = new List(title, this);
        this.lists.push(list);
    }

    deleteList(listId) {
        this.lists = this.lists.filter(list => list.id !== listId);
    }
}