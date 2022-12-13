require( 'dotenv' ).config();

const mysql = require( 'mysql2/promise' );

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

database
  .query ( 'SELECT * FROM movies' )
  .then((result) => {
    const movies = result[0];
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
  });

 module.exports = database;
