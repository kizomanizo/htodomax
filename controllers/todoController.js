import Todo from "../models/Todo.js";

class TodosController {
  static async getTodos(req, res) {
    const todos = await Todo.find({ userId: req.session.userId });
    res.send(
      todos
        .map(
          (todo) => `
      <li>
        ${todo.text} - Tags: ${todo.tags.join(", ")}
      </li>
    `
        )
        .join("")
    );
  }

  static async createTodo(req, res) {
    const { text, tags } = req.body;
    const tagArray = tags.split(",").map((tag) => tag.trim());
    const todo = await Todo.create({ text, tags: tagArray, userId: req.session.userId });
    res.send(`
      <li>
        ${todo.text} - Tags: ${todo.tags.join(", ")}
      </li>
    `);
  }
}

export default TodosController;
