const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized 1"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      console.error();
      return next(HttpError(401, "User not found with ID:", id));
    }

    if (!user.token) {
      console.error();
      return next(HttpError(401, "User has no token:", user));
    }

    if (user.token !== token) {
      console.error();
      return next(
        HttpError(
          401,
          "Token does not match. User token:",
          user.token,
          "Provided token:",
          token
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    console.error();
    next(HttpError(401, "JWT verification failed:", error.message));
  }
};

module.exports = authenticate;
