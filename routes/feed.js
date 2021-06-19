var express = require('express');
var router = express.Router();
const { MongoClient, ObjectID } = require("mongodb")
const multer = require("multer")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

// const face = require("../utils/face")

router.get('/', async (req, res) => {
  try {
    const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
    const db = connect.db("iherb")
    const feed = await db.collection("feed").find().toArray()
    await connect.close()
    res.json({ feed })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "server is down" })
  }
});

router.get('/:id', async (req, res) => {
  if(ObjectID.isValid(req.params.id)){
    try {
      const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
      const db = connect.db("iherb")
      const feed = await db.collection("feed").findOne({ _id: ObjectID(req.params.id) })
      await connect.close()
      res.json({ feed })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "server is down" })
    }
  }else{
    res.status(401).json({ error: "bad user_id" })
  }
});

router.post("/upload", upload.single('file'), async (req, res) => {
  if(req.body.name && req.body.tags && req.body.text){
    try {
      const connect = await MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017/")
      const db = connect.db("iherb")
      await db.collection("feed").insertOne({
        name: req.body.name,
        tags: req.body.tags.split(","),
        text: req.body.text,
        image: req.file.originalname
      })
      await connect.close()
      res.redirect('/create-news.html?success=true')
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "server is down" })
    }
  }else{
    res.send("Введите все параметры!")
  }
})



module.exports = router;
