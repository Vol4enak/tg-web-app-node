const mongoose = require("mongoose");

const app = require(".");
const PORT = process.env.PORT || 8000;

mongoose
  .connect(
    "mongodb+srv://Vol4enak:iEmZCT4wzixEnZ0o@cluster0.dvnafo9.mongodb.net/"
  )

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
