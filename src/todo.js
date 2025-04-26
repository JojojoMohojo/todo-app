export class Todo {
    constructor(description, dueDate, priority, list) {
        this.id = crypto.randomUUID();
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.listName = list.title;
        this.listId = list.id;
    }

    changeDescription(newDescription) {
        this.description = newDescription;
    }

    changeDueDate(newDate) {
        this.dueDate = newDate;
    }
    
    changePriority(newPriority) {
        this.priority = newPriority;
    }

    changeCompletedStatus() {
        this.completed = !this.completed;
    }
}