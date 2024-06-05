import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import AuthRoutes from "./routes/authRoutes.js";
import TodoRoutes from "./routes/todoRoutes.js";

class App {
  constructor() {
    this.app = express();
    this.port = process.env.NODE_PORT;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  connectToDatabase() {
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;

    console.log("DB USER", dbUsername);

    const mongoUri = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

    mongoose
      .connect(mongoUri)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  initializeMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(express.static("public"));
  }

  initializeRoutes() {
    const authRoutes = new AuthRoutes();
    const todoRoutes = new TodoRoutes();

    this.app.use("/auth", authRoutes.getRouter());
    this.app.use("/todos", this.isAuthenticated, (req, res) =>
      res.sendFile("todos.html", { root: "public" })
    );
    this.app.use("/api/todos", this.isAuthenticated, todoRoutes.getRouter());
    this.app.get("/", (req, res) => res.redirect("/auth"));
  }

  isAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect("/");
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port || 3000}`);
    });
  }
}

const app = new App();
app.listen();
