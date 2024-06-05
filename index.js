import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import todosRoutes from "./routes/todos.js";

class App {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  connectToDatabase() {
    mongoose
      .connect("mongodb://localhost/htodomax", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  initializeMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(express.static("public"));
  }

  initializeRoutes() {
    this.app.use("/auth", authRoutes);
    this.app.use("/todos", this.isAuthenticated, todosRoutes);
    this.app.get("/", this.isAuthenticated, (req, res) =>
      res.sendFile("index.html", { root: "public" })
    );
  }

  isAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect("/login");
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}

const app = new App();
app.listen();
