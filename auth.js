const argon2 = require('argon2');

const hashingOptions  = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 4,
  parallelism: 1,
};

const hash = (req, res, next) => {
  argon2
  .hash(req.body.password, hashingOptions)
  .then((hash) => {
    req.body.password = hash;
    next();
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error hashing password");
  }
  );
}

const verify = async () => {
  const hash = await argon2.hash('password');
  if (await argon2.verify(hash, 'password')) {
    console.log('password is correct');
  } else {
    console.log('password is not correct');
  }
}

module.exports = { 
  verify,
  hash,
};