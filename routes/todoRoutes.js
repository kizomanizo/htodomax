import express from "express";
import TodosController from "../controllers/todoController.js";

class TodoRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", TodosController.getTodos);
    this.router.post("/", TodosController.createTodo);
  }

  getRouter() {
    return this.router;
  }
}

export default TodoRoutes;
