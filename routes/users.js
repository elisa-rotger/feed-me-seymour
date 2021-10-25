var express = require('express');
var router = express.Router();
const db = require('../model/helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const emailValidator = require('deep-email-validator');
const { send } = require('emailjs-com');

const secret = process.env.JWT_SECRET;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Users!");
});

/* GET users listing.*/
router.get('/users', async function(req, res) {
    await db(`SELECT * FROM usersTable`)
      .then(results => {
        res.send(results.data)
      })
      .catch(err => res.status(500).send({ err: err.message }))
})

router.get('/users/:id', async function (req, res) { 
  await db(`SELECT * FROM usersTable WHERE id = ${req.params.id}`)
    .then(results => res.send(results.data) )
    .catch(err => res.status(500).send({ err: err.message }))
})

/* POST - REGISTER a new user*/ 

async function isEmailValid(email) {
  return emailValidator.validate(email)
}

router.post('/register', async function(req, res) {
  const { username, email, password } = req.body;

  // VALIDATION OF THE EMAIL
  if (!email || !password) {
    return res.status(400).send({ message: "Email or password missing! "})
  } 
  const {valid, reason, validators} = await isEmailValid(email);

  if(!valid) {
    return res.status(400).send({
      message: "Please provide a valid email address.",
      reason: validators[reason].reason
    })
  }
  
  try {
    // TODO - CHECK IF USER ALREADY EXISTS
    const hash = await bcrypt.hash(password, saltRounds)
    await db(`INSERT INTO usersTable (
      username,
      emailAddress,
      password
    ) VALUES (
      "${username}",
      "${email}",
      "${hash}"
    )`)
    res.send({ message: "Register successful!" })
  } catch(err) {
    res.status(400).send({ message: err.message })
  }
})

/* POST - LOGIN an existing user */
router.post('/login', async function (req, res) {
  try {
    let results = await db(`SELECT * FROM usersTable WHERE username = "${req.body.username}"`)
    const user = results.data[0];
    if(user) {
      let user_id = user.id;
      const correctPassword = await bcrypt.compare(req.body.password, user.password);
      if(!correctPassword) throw new Error('Incorrect password!');
      var token = jwt.sign({ user_id }, secret);
      res.send({ message: "Login successful!", token});
    } else {
      throw new Error("User doesn't exist!");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
})

router.get('/garden', (req, res) => {
  let token = req.headers['x-access-token'];
  if(!token) { res.status(401).send({ message: "please provide a token "})}
  else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) { res.status(401).send({ message: "plase provide a token" })}
      else {
        user_id = decoded.user_id;
        res.send({ user_id: user_id })
      }
    })
  }


})

module.exports = router