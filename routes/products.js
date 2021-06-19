var express = require('express');
var router = express.Router();
const { MongoClient, ObjectID } = require("mongodb")

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

router.get('/', async (req, res) => {
  try {
    const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
    const db = connect.db("iherb")
    const result = await db.collection("products").find().toArray()
    await connect.close()
    res.json({ result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "server is down" })
  }
});

router.post('/add', async (req, res) => {
  if(ObjectID.isValid(req.body.user_id) && ObjectID.isValid(req.body.product_id)){
    try {
      const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
      const db = connect.db("iherb")
      const user = await db.collection("users").findOne({ _id: ObjectID(req.body.user_id) })
      const product = await db.collection("products").findOne({ _id: ObjectID(req.body.product_id) })
      if(user && product){
        let { schedule } = user
        if(!schedule){
          schedule = []
        }
        const randomnumber = Math.floor(Math.random() * (14)) + 8;
        schedule.push({
          _id: ObjectID.createPk(),
          name: product.Product.Name,
          time: `${randomnumber}:${["00", "30"][Math.floor(Math.random() * (2))]}`,
          dates: Array(Math.floor(Math.random() * 16) + 5).fill(0).map((item, i) => ({
            date: addDays(new Date(), i),
            took: false
          }))
        })
        await db.collection("users").updateOne({
          _id: ObjectID(req.body.user_id)
        }, { "$set": { schedule } })
        res.json({ type: "ok" })
      }else{
        await connect.close()
        res.status(404).json({ error: "bad user_id or product_id" })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "server is down" })
    }
  }else{
    res.status(404).json({ error: "bad user_id or product_id" })
  }
});

module.exports = router;
