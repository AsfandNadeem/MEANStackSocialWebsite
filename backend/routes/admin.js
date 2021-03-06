const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const Advertiser = require("../models/advertiserModel");
const Advertisement = require("../models/advertisementModel");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require('../models/user');
const Group = require('../models/group');
const Event = require('../models/event');
const Report = require('../models/report');

const router = express.Router();

router.post(
  "/login",
  (req, res, next) => {
   if(req.body.email == "asfandmoeez123") {

     if(req.body.password == "starwars") {

       res.status(200).json({
         message: "admin logged"
       });

     } else {
       return res.status(401).json({
         message: "admin failed"
       });
     }

   } else {
     return res.status(401).json({
       message: "admin failed"
     });
   }
  });

router.get("/users", (req, res, next) => {

  const userQuery = User.find().sort({ '_id': -1 });
  let fetchedUsers;


  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        users: fetchedUsers,
        maxUsers: count
      });
    });
});

router.get("/groups", (req, res, next) => {

  const groupQuery = Group.find().sort({ '_id': -1 });
  let fetchedGroups;

  groupQuery
    .then(documents => {
      fetchedGroups = documents;
      return Group.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        groups: fetchedGroups,
        maxGroups: count
      });
    });
});

router.get("/events", (req, res, next) => {

  const eventQuery = Event.find().sort({ '_id': -1 });
  let fetchedEvents;

  eventQuery
    .then(documents => {
      fetchedEvents = documents;
      return Event.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        events: fetchedEvents,
        maxEvents: count
      });
    });
});


router.get("/adverts", (req, res, next) => {

  const postQuery = Advertisement.find().sort({ '_id': -1 });
  let fetchedPosts;

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Advertisement.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get("/posts", (req, res, next) => {

  const postQuery = Post.find().sort({ '_id': -1 });
  let fetchedPosts;

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get("/reports", (req, res, next) => {

  const reportQuery = Report.find().sort({ '_id': -1 });
  let fetchedReports;

  reportQuery
    .then(documents => {
      fetchedReports = documents;
      return Report.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        reports: fetchedReports,
        maxReports: count
      });
    });
});

router.delete("/events/:id",  (req, res, next) => {
  Event.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    if (result.n> 0) {
      res.status(200).json({message: "Deleted successful!"});
    } else {
      res.status(401).json({message: "Not authorized to delete!"});
    }
  });
});

router.delete("/groups/:id",  (req, res, next) => {
  Group.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    if (result.n> 0) {
      res.status(200).json({message: "Deleted successful!"});
    } else {
      res.status(401).json({message: "Not authorized to delete!"});
    }
  });
});

router.delete("/posts/:id",  (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    if (result.n> 0) {
      res.status(200).json({message: "Deleted successful!"});
    } else {
      res.status(401).json({message: "Not authorized to delete!"});
    }
  });
});

router.delete("/advertisements/:id",  (req, res, next) => {
  Advertisement.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    if (result.n> 0) {
      Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        if (result.n> 0) {
          res.status(200).json({message: "Deleted successful!"});
        } else {
          res.status(401).json({message: "Not authorized to delete!"});
        }
      });
    } else {
      res.status(401).json({message: "Not authorized to delete!"});
    }
  });
});

router.delete("/reports/:id",  (req, res, next) => {
  Report.deleteMany({ postid: req.params.id }).then(result => {
              console.log(result);
              if (result.n> 0) {
                      Post.deleteOne({ _id: req.params.id }).then(result => {
                          console.log(result);
                          if (result.n> 0) {
                            res.status(200).json({message: "Deleted successful!"});
                          } else {
                            res.status(401).json({message: "Not authorized to delete!"});
                          }
                        });
              } else {
                res.status(401).json({message: "Not authorized to delete!"});
              }
            });
});


router.delete("/removereports/:id",  (req, res, next) => {
  Report.deleteMany({ _id: req.params.id }).then(result => {
    console.log(result);
    if (result.n> 0) {
          res.status(200).json({message: "Deleted successful!"});
           } else {
      res.status(401).json({message: "Not authorized to delete!"});
    }
  });
});

module.exports = router;
