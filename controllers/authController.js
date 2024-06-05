import bcrypt from "bcryptjs";
import User from "../models/User.js";

class AuthController {
  static async register(req, res) {
    const { firstName, middleName, lastName, username, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await User.create({
        firstName,
        middleName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
      res.send('<p>Registration successful! <a href="/">Login</a></p>');
    } catch (error) {
      res.send(`<p>Registration failed: ${error.message}</p>`);
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username, isDeleted: false });
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user._id;
      res.send('<p>Login successful! <a href="/todos">Go to Todo List</a></p>');
    } else {
      res.send("<p>Login failed: Invalid username or password</p>");
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.send('<p>Logged out successfully! <a href="/">Login</a></p>');
  }
}

export default AuthController;
