require('dotenv').config()
const express = require("express")
const bParser = require("body-parser")
const letterController = require("./services/letter.controller")

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()

app.use(bParser.json())
app.use("/api/letter", letterController)

app.get("/ind",function(req, res, next){
    res.send("Hello")
})

app.listen(process.env.PORT||3300, ()=>{
    console.log("Server started with port ", process.env.PORT)
})