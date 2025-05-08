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
    }

    createTodo(description, dueDate, priority) {
        const todo = new Todo(description, dueDate, priority, this);
        this.todos.push(todo);
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
}