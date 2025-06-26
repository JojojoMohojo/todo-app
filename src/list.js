import { appController } from "./app-controller.js";
import { Todo } from "./todo.js";

export class List {
    constructor(title, project) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.todos = [];
        this.project = project;
        this.projectId = project.id;
    }

    changeTitle(newTitle) {
        this.title = newTitle;
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    createTodo(description, dueDate, priority) {
        const todo = new Todo(description, dueDate, priority, this);
        this.todos.push(todo);
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }

    deleteTodo(todo) {
        this.todos = this.todos.filter(item => item.id !== todo.id);
        if (appController.getIsLocalStorageActive()) appController.saveToStorage();
    }
}