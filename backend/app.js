const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const path = require("path");

const postsRoutes=require("./routes/posts");
const userRoutes=require("./routes/user");
const groupRoutes=require("./routes/groups");

const app = express();
mongoose.connect("mongodb://asfand:Nj3atbLzmaV5WZHJ@comsatssocial-shard-00-00-y7oqn.mongodb.net:27017,comsatssocial-shard-00-01-y7oqn.mongodb.net:27017,comsatssocial-shard-00-02-y7oqn.mongodb.net:27017/socialdb?ssl=true&replicaSet=ComsatsSocial-shard-0&authSource=admin&retryWrites=true")
  .then(()=>{
    console.log('Connected to database');
  })
  .catch(error =>{
    console.log(error);
    console.log("Connection failed");
  });
// mongoose.connect("mongodb+srv://asfand:Nj3atbLzmaV5WZHJ@comsatssocial-y7oqn.mongodb.net/socialdb?retryWrites=true")
//   .then(()=>{
//     console.log('Connected to database');
//   })
//   .catch(error =>{
//     console.log(error);
//     console.log("Connection failed");
//   });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);
app.use("/api/groups",groupRoutes);


module.exports = app;
