
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// const User = require('../models/User');
// const asyncHandler = require('../middlewares/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { signToken } = require('../utils/jwt');

// exports.register = asyncHandler(async (req, res) => {
//   const { name, email, password, role, storeId } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) throw new ApiError(409, 'Email already exists');

//   const user = await User.create({ name, email, password, role, storeId });
//   const token = signToken({ userId: user._id, role: user.role, storeId: user.storeId || null });

//   res.status(201).json({
//     message: 'User created',
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       storeId: user.storeId,
//     },
//   });
// });

// exports.login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.comparePassword(password))) {
//     throw new ApiError(401, 'Invalid credentials');
//   }

//   const token = signToken({ userId: user._id, role: user.role, storeId: user.storeId || null });
//   res.json({
//     message: 'Login successful',
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       storeId: user.storeId,
//     },
//   });
// });

// exports.me = asyncHandler(async (req, res) => {
//   res.json({ user: req.user });
// });
