var express = require('express');
const { addListener } = require('nodemon');
var router = express.Router();
const db = require('../model/helper');

async function getAllItems() {
  // Send back the full list of items
  let result = await db(`SELECT * FROM plantsTable;`)
  return result.data;
}

async function plantExists(plantId) {
  // Send back the full list of items
  let result = await db(`SELECT * FROM plantsTable where plantId = ${plantId}`);
  return result.data.length === 1;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Plants!");
});

/* GET plant list. */
router.get('/plants', async function(req, res, next) {
  try {
    let plants = await getAllItems(); 
    res.send(plants);
} catch (err) {
  console.log(err)
  res.status(500).send({error: err.message});
}
});

/* GET one plant */ /* plant-id? */
router.get('/plants/:plantId', async function(req, res, next) {
  let { plantId } = req.params;
  
  try {
    let result = await db(`SELECT * FROM plantsTable where plantId = ${plantId}`); 
    if (result.data.length === 1) {
      res.send(result.data[0]);
    } else {
      res.status(404).send({ error: "Not found" });
    }
  } catch (err) {
    res.status(500).send({error: err});
  }
});

/* POST new plant*/
router.post('/plants', async function(req, res, next) {
  // let {plantName , username} = req.body; 

  try {
    let sql = `INSERT INTO plantsTable (plantName, userId, wateringFrequency, isWatered) VALUES ('${req.body.plantName}', '${req.body.userId}', '${req.body.wateringFrequency}', '1')`;
    await db(sql); 
    let plants = await getAllItems();
    res.status(201).send(plants);
  } catch (err) {
    res.status(500).send({error: err});
  }
});

/* DELETE a plant */
router.delete('/plants/:plantId', async function(req, res, next) {
  let { plantId } = req.params;

  try {
    if ((await plantExists(plantId)) === false) {
      res.status(404).send({ error: "Not found" }); 
      return;
    }
    
    await db(`DELETE FROM plantsTable where plantId = ${plantId}`); 
    let plants = await getAllItems();
    res.send(plants);
  } catch (err) {
    res.status(500).send({error: err});
  }
});

/*PUT */
router.put('/plants/:id', async function(req, res, next) {
  // let { lastWatered } = req.body; 
  // let { plantId } = req.params.id; 

  try {
    if((await plantExists(req.params.id)) === false) {
      res.status(404).send({ error: "Not found" }); 
      return;
    } 

      await db(`UPDATE plantsTable SET lastWatered = now(), isWatered = 1  where plantId = ${req.params.id}`);
      let plants = await getAllItems();
      res.status(201).send(plants);
    } catch (err) {
      res.status(500).send({error: err.message});
  }
});


// ADDING ANOTHER GET, TO THE SAME PLANT LIST, TO ADD A PUT REQUEST TO THE SAME LIST

/* GET plant list. */
router.get('/plants2', async function(req, res, next) {
  try {
    let plants = await getAllItems(); 
    res.send(plants);
} catch (err) {
  res.status(500).send({error: err});
}
});

/*PUT */
router.put('/plants2/:id', async function(req, res, next) {
  try {
    if((await plantExists(req.params.id)) === false) {
      res.status(404).send({ error: "Not found" }); 
      return;
    } 
      await db(`UPDATE plantsTable SET isWatered = 0 where plantId = ${req.params.id}`);
      let plants = await getAllItems();
      res.status(201).send(plants);
    } catch (err) {
      res.status(500).send({error: err.message});
  }
});



module.exports = router;