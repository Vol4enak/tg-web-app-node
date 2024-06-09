const isValidStatus = (req, res, next) => {
  const { favorites, basket } = req.body;

  const isValidArray = (arr) => {
    if (!Array.isArray(arr)) {
      return false;
    }
    return arr.every((item) => isValidStatusId(item));
  };

  if (favorites && !isValidArray(favorites)) {
    return next(HttpError(400, `favorites is not valid`));
  }

  if (basket && !isValidArray(basket)) {
    return next(HttpError(400, `basket is not valid`));
  }

  next();
};
module.exports = isValidStatus;
