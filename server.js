const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQL123",
  database: "joinUs",
});

app.get("/", async (req, res, next) => {
  const q = "select count(*) as count from users";
  connection.query(q, (error, results) => {
    if (error) throw error;
    const { count } = results[0];
    res.render("home", { count });
  });
});

app.post("/register", async (req, res, next) => {
  const user = req.body;
  const insertQ = "insert into users set ?";
  connection.query(insertQ, user, (error, results) => {
    if (error) return res.send("Email already exists");
    res.redirect("/");
  });
});

app.listen("8080", () => {
  console.log("App listening on port 8080...");
});
