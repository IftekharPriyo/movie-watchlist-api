const prisma = require("../config/db").prisma;
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken").generateToken;

const register = async (req, res) => {
  const body = req.body;
  const { name, email, password } = body;

  // check to see if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with that email" });
  }

  // Hash the password before saving to the database

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // generate jwt token
  const token = generateToken(user.id, res);


  res
    .status(201)
    .json({ status: "success", message: "User created successfully", user, token });
};

// login user with JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid email or password" });
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid email or password" });
  }

  // verify password and generate JWT token
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid email or password" });
  }

  // generate jwt token
  const token = generateToken(user.id, res);

  res
    .status(201)
    .json({ status: "success", message: "User logged in successfully", user, token });

};

const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,   
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ status: "success", message: "User logged out successfully" });
};

exports.register = register;
exports.login = login;
exports.logout = logout;
