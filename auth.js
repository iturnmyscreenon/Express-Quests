const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { getUserByEmailAndPassword } = require('./userHandlers');
require ('dotenv').config();

const hashingOptions  = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
  .hash(req.body.password, hashingOptions)
  .then((hashedPassword) => {
    console.log(hashedPassword);
    req.body.password = hashedPassword;
    req.body.hashedPassword = hashedPassword;
    next();
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error hashing password");
  }
  );
}

const verifyPassword = async (req , res) => {
  const user = await getUserByEmailAndPassword(req.body.password)

try {
  
  if(await argon2.verify(user.hashedPassword, req.body.password)){
    const playload = {sub : req.user.id}

    const token = jwt.sign(playload , process.env.JWT_SECRET , {
      expiresIn : "1h" 
    })

    delete user.hashedPassword
    res.send({token , user : req.user})
  }else{
    res.sendStatus(401)
  }
} catch (error) {
  console.error(error)
}
}

const verifyToken = (req , res , next ) => {
  try {
   
    const authorization = req.get("authorization");

    if(authorization == null){
      throw new Error("Authorization header is missing");
    }

    const [type , token] = authorization.split(" ")

    if(type !== "Bearer"){
      throw new Error("Autorization header has not the 'Bearer' type ")
    }

    req.playload = jwt.verify(token , process.env.JWT_SECRET)

    next()
  } catch (error) {
    console.error(error)
    res.sendStatus(401)
  }
}
module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};
