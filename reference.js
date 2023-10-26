const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQL123",
  database: "joinUs",
});

// Creating Table
const createQ =
  "create table users (email varchar(250) primary key, createdAt timestamp default now())";
connection.query(createQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// Selecting Data
const selectQ = "select count(*) as total from users";
connection.query(selectQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// Inserting Data (NOT Recommended)
const insertDataQ1 = "insert into users (email) values ('gonz@test.com')";
connection.query(insertDataQ1, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// Inserting Data (Recommended)
const user = {
  email: "gonzalo@gmail.com",
  createdAt: new Date("2012-10-10"),
};
const insertDataQ2 = "insert into users set ?";
connection.query(insertDataQ2, user, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// Inserting Multiple Data (Recommended)
const users = [];
for (let i = 0; i < 500; i++) {
  const user = [faker.internet.email(), faker.date.past()];
  users.push(user);
}
const q = "insert into users (email, createdAt) values ?";
connection.query(q, [users], (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// Find earliest date a user joined
const earliestDateQ =
  "select date_format(min(createdAt),'%b %D %Y') as earliestDate from users";
connection.query(earliestDateQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results[0].earliestDate);
});

// Find email of the earliest date a user joined
const earliestEmailQ =
  "select email, createdAt from users order by createdAt limit 1";
connection.query(earliestEmailQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results[0]);
});

// Users according to the month they joined
const monthJoinedQ =
  "select monthName(createdAt) as month, count(*) as count from users group by month order by count desc";
connection.query(monthJoinedQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// Users count with Yahoo emails
const yahooUsersQ =
  "select count(*) as yahooUsers from users where email like '%@yahoo.com'";
connection.query(yahooUsersQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results[0].yahooUsers);
});

// Users for each email host
const emailHostsQ =
  "select case when email like '%gmail.com' then 'gmail' when email like '%yahoo.com' then 'yahoo' when email like '%hotmail.com' then 'hotmail' else 'other' end as provider, count(*) as totalUsers from users group by provider order by totalUsers desc";
connection.query(emailHostsQ, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

connection.end();
