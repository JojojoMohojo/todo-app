import { List } from "./list";

class FormValidator {
    constructor() {

    }

    validateProjectForm(titleInput, descInput) {
        let isValid = true;
        let invalidInputs = [];

        const title = titleInput.value;
        const desc = descInput.value;

        if (title === "") {
            isValid = false;
            invalidInputs.push({ input: titleInput, reason: "empty" });
        } else if (title.length > 39) {
            isValid = false;
            invalidInputs.push({ input: titleInput, reason: "too_long" });
        }

        if (desc === "") {
            isValid = false;
            invalidInputs.push({ input: descInput, reason: "empty" });
        } else if (desc.length > 120) {
            isValid = false;
            invalidInputs.push({ input: descInput, reason: "too_long" });
        }

        return { isValid, invalidInputs };
    }

    validateListForm(titleInput) {
        let isValid = true;
        let invalidInputs = [];

        const title = titleInput.value;

        if (title === "") {
            isValid = false;
            invalidInputs.push({ input: titleInput, reason: "empty" });
        } else if (title.length > 36) {
            isValid = false;
            invalidInputs.push({ input: titleInput, reason: "too_long" });
        }

        return { isValid, invalidInputs };
    }

    validateTodoForm(descInput, dateInput, priorityInput) {
        let isValid = true;
        let invalidInputs = [];

        const description = descInput.value;
        const date = dateInput.valueAsDate;
        const priority = parseInt(priorityInput.value);

        // Description
        if (description === "") {
            isValid = false;
            invalidInputs.push({ input: descInput, reason: "empty" });
        } else if (description.length > 38) {
            isValid = false;
            invalidInputs.push({ input: descInput, reason: "too_long" });
        }

        // Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!date) {
            isValid = false;
            invalidInputs.push({ input: dateInput, reason: "empty" });
        } else if (date < today) {
            isValid = false;
            invalidInputs.push({ input: dateInput, reason: "invalid" });
        }

        // Priority
        if (isNaN(priorityInput.value) || priorityInput.value === "") {
            isValid = false;
            invalidInputs.push({ input: priorityInput, reason: "empty" });
        } else if (priority < 1 || priority > 5) {
            isValid = false;
            invalidInputs.push({ input: priorityInput, reason: "invalid" });
        }

        return { isValid, invalidInputs };
    }
}

export const formValidator = new FormValidator();