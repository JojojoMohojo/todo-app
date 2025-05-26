import { Todo } from "./todo.js";

export class VirtualList{
    constructor(title, todos, dateHint = null) {
        this.id = `virtual-${title.toLowerCase()}`;
        this.title = title;
        this.todos = todos;
        this.dateHint = dateHint ? new Date(dateHint) : null;
        this.isVirtual = true;
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
