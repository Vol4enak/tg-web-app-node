const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized 1"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "user not found"));
    }
    req.user = user;

    next();
  } catch {
    next(HttpError(401, "Not authorized 2 "));
  }
};

module.exports = authenticate;
