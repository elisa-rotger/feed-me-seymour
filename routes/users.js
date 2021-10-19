var express = require('express');
var router = express.Router();
const db = require('../model/helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;


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

/* POST - REGISTER a new user*/ 
router.post('/users/register', async function(req, res) {
  const { userName, email, password} = req.body
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds)
    await db(`INSERT INTO usersTable (
      username,
      emailAddress,
      password
    ) VALUES (
      ${req.body.userName},
      ${req.body.email},
      ${hash}
    )`);
    res.send({ message: "Register successful!"})
  } catch(err) {
    res.status(400).send({ message: err.message })
  }
})

module.exports = router;