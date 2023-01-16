const database = require("./database");

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });

}

const getUsers = (req, res) => {
  let sql = "select * from users";
  const sqlValues = [];

  if (req.query.language != null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);
  }

  if (req.query.city != null) {
    if (sqlValues.length === 0) {
      sql += " where city = ?";
    } else {
      sql += " and city = ?";
    }
    sqlValues.push(req.query.city);
  }

  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};


const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language, password } = req.body;

  database

    .query("insert into users (firstname, lastname, email, city, language, password) values (?, ?, ?, ?, ?, ?)", [firstname, lastname, email, city, language, password])
    .then(([result]) => {
      res.status(201).json({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
}

const putUsers = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language} = req.body;
  
  database

    .query("update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?", [firstname, lastname, email, city, language, id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
}

const deleteUsers = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
}

const getUserByEmailAndPassword = (req, res , next) => {  
  const {email} = req.body;

    database.query("select * from users where email = ?" , [email])
    .then(([user]) => {
      if(user[0] != null){
        req.user = user[0]
        next()
      }else{
        res.sendStatus(401)
      }
    }).catch((err) => {
      console.error(err)
      res.status(500).send("Error retrieving data from databases")
    })
}




module.exports = {
  getUsers,
  getUserById,
  postUsers,
  putUsers,
  deleteUsers,
  getUserByEmailAndPassword,
};