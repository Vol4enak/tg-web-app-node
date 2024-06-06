const mongoose = require("mongoose");

const app = require(".");
const PORT = process.env.PORT || 8000;
const { DB_HOST } = require("./config");

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)

  .then(() => {
    app.listen(PORT, () => {
      console.log(
        "Database connection successful",
        "server started on PORT: " + PORT
      );
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
