export class VirtualList{
    constructor(title, todos, dateHint = null) {
        this.id = `virtual-${title.toLowerCase()}`;
        this.title = title;
        this.todos = todos;
        this.dateHint = dateHint ? new Date(dateHint) : null;
        this.isVirtual = true;
    }
}
