const express = require("express");
const path = require("path");

const authRoute = require("./routes/auth.route");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.render("pages/trang-chu/trang-chu", { title: "Trang chủ - Gà Rán ChipChip" });
});

module.exports = app;

