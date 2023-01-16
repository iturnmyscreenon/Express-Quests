const mysql = require('mysql2/promise');
require('dotenv').config();
const argon2 = require('argon2');

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const checkCredentials = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows, fields] = await connection.execute(`SELECT * FROM users WHERE email = '${email}'`);
    const user = rows[0];
    if (!user) {
      res.status(401).send("Email not found");
    } else {
      if (await argon2.verify(user.hashPassword, password)) {
        // si les informations d'identification sont correctes, continuer avec la route
        res.send("Identification successful");
      } else {
        res.status(401).send("Incorrect password");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking credentials");
  }
};


const getConnection = async () => {
  try {
    const connection = await database.getConnection();
    return connection;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const executeQuery = async (query, values) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(query, values);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { executeQuery, checkCredentials, database};
