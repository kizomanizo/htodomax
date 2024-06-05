import express from "express";
import AuthController from "../controllers/authController.js";

class AuthRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", (req, res) => res.sendFile("index.html", { root: "public" }));
    this.router.post("/login", AuthController.login);
    this.router.get("/register", (req, res) => res.sendFile("register.html", { root: "public" }));
    this.router.post("/register", AuthController.register);
    this.router.post("/logout", AuthController.logout);
  }

  getRouter() {
    return this.router;
  }
}

export default AuthRoutes;
