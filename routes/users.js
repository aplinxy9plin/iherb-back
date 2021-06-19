var express = require('express');
var router = express.Router();
const { MongoClient, ObjectID } = require("mongodb")

// const face = require("../utils/face")

/* GET users listing. */
router.get('/:id', async (req, res) => {
  if(ObjectID.isValid(req.params.id)){
    try {
      const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
      const db = connect.db("iherb")
      const user = await db.collection("users").findOne({ _id: ObjectID(req.params.id) })
      await connect.close()
      res.json({ user })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "server is down" })
    }
  }else{
    res.status(401).json({ error: "bad user_id" })
  }
});

router.get('/schedule/:id', async (req, res) => {
  if(ObjectID.isValid(req.params.id)){
    try {
      const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
      const db = connect.db("iherb")
      const user = await db.collection("users").findOne({ _id: ObjectID(req.params.id) })
      await connect.close()
      res.json({ schedule: user.schedule })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "server is down" })
    }
  }else{
    res.status(401).json({ error: "bad user_id" })
  }
});

router.post('/took-vitamin', async (req, res) => {
  if(ObjectID.isValid(req.body.id) && ObjectID.isValid(req.body.user_id) && (req.body.took === "skip" || req.body.took === "done")){
    try {
      const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
      const db = connect.db("iherb")
      const user = await db.collection("users").findOne({ _id: ObjectID(req.body.user_id) })
      const { schedule } = user
      if(schedule){
        await db.collection("users").updateOne({
          _id: ObjectID(req.body.user_id)
        },
          {
            "$set": {
              schedule: schedule.map((item) => {
                if(item._id == ObjectID(req.body.id) || item._id == req.body.id){
                  const date = item.dates[req.body.dateIndex || 0]
                  date.took = req.body.took
                  item.dates[req.body.dateIndex || 0] = date
                }
                return item
              })
            }
          }
        )
        res.json({ type: "ok" })
      }else{
        await connect.close()
        res.json({ type: "bad data" })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "server is down" })
    }
  }else{
    res.status(401).json({ error: "bad user_id" })
  }
});

router.post('/register', async (req, res) => {
  try {
    const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
    const db = connect.db("iherb")
    const user = await db.collection("users").insertOne({
      "feel": req.body.feel,
      "lifestyle": req.body.lifestyle,
      "diet": req.body.diet,
      "doctors": req.body.doctors,
      "vitaminesInBlood": req.body.vitaminesInBlood,
      "vitaminesAnalysis": req.body.vitaminesAnalysis,
      "sex": req.body.sex,
      "pregnant": req.body.pregnant,
      "age": req.body.age,
      "weight": req.body.weight,
      "height": req.body.height,
      "allergy": req.body.allergy,
      "chronic": req.body.chronic,
      "schedule": []
    })
    await connect.close()
    res.json({ id: user.ops[0]._id })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "server is down" })
  }
})



module.exports = router;
