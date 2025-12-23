const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signAccess = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
const signRefresh = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User exists" });
    const user = await User.create({ name, email, password });
    const accessToken = signAccess(user._id);
    const refreshToken = signRefresh(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res
      .status(201)
      .json({ user: { id: user._id, name, email }, accessToken, refreshToken });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const ok = user && (await user.matchPassword(password));
    if (!ok) return res.status(401).json({ message: "Invalid Credential" });
    const accessToken = signAccess(user._id);
    const refreshToken = signRefresh(user._id);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token)
      return res.status(401).json({ message: "Invalid refresh" });
    res.json({
      accessToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      }),
    });
  } catch {
    res.status(401).json({ message: "Invalid refresh" });
  }
};

module.exports = { register, login, refresh };
