const express = require("express");
const multer = require("multer");

const Event = require('../models/event');
const User = require('../models/user');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};


router.post(
  "",
  checkAuth,
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log("____________creating event_____________\n"+req.body+"-------------------");
    console.log("event found");
    User.findById({ _id: req.userData.userId}, (err,user)=> {
      if(err){
          res.json({success: false, message:'something went wrong'});
        }
      if(!user){
        res.json({success: false, message:'user not found'});
      } else {
        const usera = ({
          Euserid: req.userData.userId,
          Euser: user.username
        });
        const event = new Event({
          eventname: req.body.eventname,
          description: req.body.description,
          eventcreator: req.userData.userId,
          eventdate: req.body.eventdate,
          username: user.username,
          category: req.body.category,
          eventfollowers: [usera]
        });
        event.save().then(createdEvent => {
          user.eventsjoined.push(createdEvent._id);
          user.save().then( user => {
            res.status(201).json({
              message: 'Event Created',
              result: createdEvent,
            });
            console.log(event);
          });

        });
      }
    });
  });

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  const currentPage = +req.query.page;

  const eventQuery = Event.find().sort({ '_id': -1 });
  let fetchedEvent;
  if (pageSize && currentPage) {
    eventQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  eventQuery
    .then(documents => {
      fetchedEvent = documents;
      return Event.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Events fetched successfully!",
        events: fetchedEvent,
        maxEvents: count
      });
    });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.put("/adduser/:id",checkAuth,(req,res,next) => {
  console.log("getiing event");
  const eventQuery = Event.findById(req.params.id).then(event => {
    if (event) {
      console.log("event found");
      User.findById({ _id: req.userData.userId}, (err,user)=> {
        if(err){
          res.json({success: false, message:'something went wrong'});
        }
        if(!user){
          res.json({success: false, message:'user not found'});
        } else {
          const usera =({
                  Euserid: req.userData.userId,
                  Euser: user.username
                });
          event.eventfollowers.push( usera);
          user.eventsjoined.push(req.params.id);
          event.save((err) => {
            if(err) {
              res.json({ success: false, message:'something went wrong'});
            } else {
              user.save((err) => {
                if(err){
                  res.json({ success: false, message:'something went wrong'});
                } else {
                  console.log(event);
                  res.json({success: true, message: 'user added in event'});
                }
              });

            }
          });
        }
      });
    } else {
      res.json({success: false, message:'event not found'});
    }
  });
});




router.get("/:id", (req, res, next) => {
  // const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const currentPage = +req.query.page;
console.log("getiing event");
  const eventQuery = Event.findById(req.params.id).then(event => {
    if (event) {
      console.log("event found");
      postes = event.eventPosts.sort({ '_id': -1 });
      res.status(200).json({
               posts: postes
                   });
      console.log(event.eventPosts);
    } else {
      res.status(404).json({ message: "Event not found!" });
    }
  });
});

router.put("/addeventPost/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {

    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log("addingeventpost-----------------------\n"+req.params.id+"\n----------------------------");
    if(!req.params.id){
      res.json({success: false, message:'no id provided'});
    }
    else{
      Event.findById({_id: req.params.id},(err,event) => {
        if(err){
          res.json({success:false, message:'invalid event id'});
        } else {
          if(!event){
            res.json({success: false, message:'event not found'});
          } else {
            const post =({
              title: req.body.title,
              content: req.body.content,
              username: req.body.username,
              createdAt : Date.now(),
              creator: req.userData.userId,
              imagePath: url + "/images/" + req.file.filename
            });
            event.eventPosts.push( post );
            event.save((err) => {
              if(err) {
                res.json({ success: false, message:'something went wrong'});
              } else {
                console.log(post);
                res.json({ success: true, message: 'post added'});
              }
            });
          }
        }
      });
    }

        }
      );





module.exports = router;
