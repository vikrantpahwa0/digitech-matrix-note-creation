const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, user_roles, roles } = require("../models");
require("dotenv").config();

class UserService {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async registerUser(email, password, name) {
    try {
      const userAlreadyExists = await users.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (userAlreadyExists) {
        throw new Error("User Already Exists");
      }
      const hashedPassword = await this.hashPassword(password);
      const createdUser = await users.create({
        name,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      });
      const assignInitialRole = await user_roles.create({
        userId: createdUser.id,
        roleId: 1, //owner role pre assigned
      });
      return { id: createdUser.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // 🔹 Verify login credentials
  static async login(email, password) {
    const user = await users.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [
        {
          model: user_roles,
          as: "userRoles",
          include: [
            {
              model: roles,
              as: "role",
              attributes: ["id", "name", "code"],
            },
          ],
        },
      ],
    });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const rolesArray = user.userRoles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      code: ur.role.code,
    }));

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return { user: { id: user.id, name: user.name, rolesArray }, token };
  }
}

module.exports = UserService;
