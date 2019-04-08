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
          eventmembersid: [req.userData.userId.toString()],
          membersNo:1,
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

router.get("/joinedevents", checkAuth, (req, res, next) => {
  // const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const currentPage = +req.query.page;
  let joinedevents = [];
  let count = 0;
  const eventQuery = Event.find({eventmembersid: req.userData.userId}).sort({ '_id': -1 });
  eventQuery
    .then(events => {
      // events.forEach( function( oneevent) {
      //   // console.log(oneevent);
      //   oneevent.eventfollowers.forEach( function( onemember){
      //     // console.log(onemember.Euserid);
      //     if(onemember.Euserid == req.userData.userId) {
      //       joinedevents.push(oneevent);
      //       count++;
      //     }
      //   });
      // });
      // console.log(joinedevents);
      res.status(200).json({
        message: "Events fetched successfully!",
        events: events,
        maxEvents: count
      });
    });
});

router.get("", (req, res, next) => {
  if(req.query) {
    const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
    const currentPage = +req.query.page;

    const eventQuery = Event.find().sort({'_id': -1});
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
  } else {
    const eventQuery = Event.find().sort({'_id': -1});
    let fetchedEvent;
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
  }
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

router.put(
  "/:id",
  checkAuth,
  (req, res, next) => {
    User.findById({ _id: req.userData.userId}, (err, user) => {
      if(err){
        res.json({ success: false, message: 'soemthing wrong'});
      } else {
        if(!user){
          console.log("no found user");
          res.json({success: false,message:'user not Found'});
        }
        else {
          const event =({
            eventname: req.body.eventname,
            description: req.body.description,
            eventdate: req.body.eventdate,
          });
          console.log(event);
          Event.updateOne({ _id: req.params.id, eventcreator: req.userData.userId}, event).then(result => {
            if (result.nModified > 0) {
              console.log(result);
              res.status(200).json({message: "Update successful!"});
            } else {
              res.status(401).json({message: "Not authorized to update!"});
            }
          });
        }
      }
    });

  }
);

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
          event.eventmembersid.push(user._id.toString());
          event.membersNo++;
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
        eventmembers: event.eventfollowers,
        eventname: event.eventname,
        eventcreatorid: event.eventcreator,
        eventdate: event.eventdate,
        eventcreator: event.username,
        description: event.description,
               posts: postes.reverse()
                   });
      console.log(event.eventPosts);
      console.log("--------------------------------------------"+event.eventfollowers);
    } else {
      res.status(404).json({ message: "Event not found!" });
    }
  });
});

router.put("/likeeventpost/:id",checkAuth,(req,res,next) => {
  // const groupid = +req.query.groupid;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const eventid = +req.query.eventid;
  console.log("liking event post"+ req.body.eventid);
  Event.findById({ _id: req.params.id}, (err, event) => {
    if(err){
      console.log("error1");
      res.json({success:false, message:'invalid event id'});
    } else {
      if(!event) {
        console.log(error);
        res.json({success: false, message:'event not found'});
      } else {
        event.eventPosts.forEach( function( element) {
          console.log("inloop");
          if (element._id == req.body.postid) {
            console.log(element);
            User.findById({_id: req.userData.userId}, (err, user) => {
              if(err) {
                res.json({success:false, message:'Something went wrong'});
              } else {
                if(!user) {
                  res.json({ success: false, message:'Could not find user'});
                } else {
                  if(req.userData.userId=== element.creator){
                    res.json({ success: false, message: 'Cannot like own post'});
                  } else {
                    if(element.likedBy.includes(req.userData.userId)){
                      element.likes--;
                      const arrayIndex = element.likedBy.indexOf(user._id.toString());
                      element.likedBy.splice(arrayIndex,1);
                      event.save((err) => {
                        if(err) {
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          res.json({ success: true, message: 'post disliked!'});
                        }
                      });
                    } else {
                      if(element.dislikedBy.includes(req.userData.userId)){
                        element.dislikes--;
                        const arrayIndex = element.dislikedBy.indexOf(req.userData.userId);
                        element.dislikedBy.splice(arrayIndex,1);
                        element.likes++;
                        element.likedBy.push(req.userData.userId);
                        user.likes.push(req.body.postid.toString());
                        event.save((err) => {
                          if(err){
                            res.json({ success: false, message:'something went wrong'});
                          } else {
                            user.save((err)=>{
                              if(err){
                                console.log("error");
                                res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log(user);

                                res.json({ success: true, message: 'post liked!'});
                              }
                            });
                          }
                        });
                      } else {
                        element.likes++;
                        element.likedBy.push(req.userData.userId);
                        user.likes.push(req.body.postid.toString());
                        event.save((err) => {
                          if(err){
                            res.json({ success: false, message:'something went wrong'});
                          } else {
                            user.save((err)=>{
                              if(err){
                                console.log("error");
                                res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log(user);
                                console.log(element);

                                res.json({ success: true, message: 'post liked!'});
                              }
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        });



      }
    }
  });

});

router.get("/comments/:id/:postid", (req, res, next) => {
  // const groupid = req.query.groupid;
  // const postid = req.query.postid;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  //  console.log(groupid);
  // console.log(postid);
  // console.log("getting comments in group");
  Event.findById({_id: req.params.id}, (err,event) => {
      if(err){
        res.json({ success: false, message: 'soemthing wrong'});
      } else {
        if(!event) {
          res.json({ success: false, message: 'post not found'});
        }
        else {
         event.eventPosts.forEach( function( element) {
            // console.log("inloop");
            if (element._id == req.params.postid) {
              console.log(element.comments);
              res.status(200).json({
                message: "Posts fetched successfully!",
                comments: element.comments
              });            }
          });

        }
      }
    }
  );
});

router.put("/dislikeeventpost/:id",checkAuth,(req,res,next) => {
  // const groupid = +req.query.groupid;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const eventid = +req.query.eventid;
  console.log("disliking event post"+ req.body.eventid);
  Event.findById({ _id: req.params.id}, (err, event) => {
    if(err){
      console.log("error1");
      res.json({success:false, message:'invalid event id'});
    } else {
      if(!event) {
        console.log(error);
        res.json({success: false, message:'event not found'});
      } else {
        event.eventPosts.forEach( function( element) {
          console.log("inloop");
          if (element._id == req.body.postid) {
            console.log(element);
            User.findById({_id: req.userData.userId}, (err, user) => {
              if(err) {
                res.json({success:false, message:'Something went wrong'});
              } else {
                if(!user) {
                  res.json({ success: false, message:'Could not find user'});
                } else {
                  if(req.userData.userId === element.creator){
                    res.json({ success: false, message: 'Cannot dislike own post'});
                  } else {
                    if(element.dislikedBy.includes(req.userData.userId)){
                      element.dislikes--;
                      const arrayIndex = element.dislikedBy.indexOf(user._id.toString());
                      element.dislikedBy.splice(arrayIndex,1);
                      event.save((err) => {
                        if(err) {
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          res.json({ success: true, message: 'post disliked!'});
                        }
                      });
                    } else {
                      if(element.likedBy.includes(req.userData.userId)){
                        element.likes--;
                        const arrayIndex = element.likedBy.indexOf(req.userData.userId);
                        element.likedBy.splice(arrayIndex,1);
                        element.dislikes++;
                        element.dislikedBy.push(req.userData.userId);
                        user.dislikes.push(req.body.postid.toString());
                        event.save((err) => {
                          if(err){
                            res.json({ success: false, message:'something went wrong'});
                          } else {
                            user.save((err)=>{
                              if(err){
                                console.log("error");
                                res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log(user);

                                res.json({ success: true, message: 'post disliked!'});
                              }
                            });
                          }
                        });
                      } else {
                        element.dislikes++;
                        element.dislikedBy.push(req.userData.userId);
                        user.dislikes.push(req.body.postid.toString());
                        event.save((err) => {
                          if(err){
                            res.json({ success: false, message:'something went wrong'});
                          } else {
                            user.save((err)=>{
                              if(err){
                                console.log("error");
                                res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log(user);
                                console.log(element);

                                res.json({ success: true, message: 'post disliked!'});
                              }
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        });



      }
    }
  });

});

router.put("/commenteventpost/:id",checkAuth,(req,res,next) => {

  console.log("commenting event post"+ req.body.eventid);
  Event.findById({ _id: req.params.id}, (err, event) => {
    if(err){
      console.log("error1");
      res.json({success:false, message:'invalid event id'});
    } else {
      if(!event) {
        console.log("error");
        res.json({success: false, message:'event not found'});
      } else {
        event.eventPosts.forEach( function( element) {
          console.log("inloop");
          if (element._id == req.body.postid) {

            console.log(element);
            User.findById({_id: req.userData.userId}, (err, user) => {
              if(err) {
                res.json({success:false, message:'Something went wrong'});
              } else {
                if(!user) {
                  res.json({ success: false, message:'Could not find user'});
                } else {
                  element.comments.push({
                    comment:req.body.comment,
                    commentator:user.username,
                    commentatorid: user._id
                  });
                  element.commentsNo++;
                  user.commentson.push(req.body.postid.toString());

                  event.save((err) => {
                    if(err) {
                      res.json({success: false, message: 'something went wrong'});
                    } else {
                      user.save((err)=>{
                        if(err){
                          console.log("error");
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          console.log(user);
                          console.log(element);

                          res.json({ success: true, message: 'post commented!'});
                        }
                      });
                    }
                  });

                }
              }
            });
          }
        });



      }
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
      User.findById({ _id: req.userData.userId}, (err, user) => {
        if (err) {
          console.log("no user");
          res.json({success: false, message: 'soemthing went worng'});
        } else {
          if(!user){
            console.log("no found user");
            res.json({success: false,message:'user not Found'});
          } else {
            Event.findById({_id: req.params.id},(err,event) => {
              if (err) {
                res.json({success: false, message: 'invalid event id'});
              } else {
                if(!event){
                  res.json({success: false, message:'event not found'});
                } else {
                  if(req.file){
                    const post =({
                      profileimg: user.imagePath,
                      title: req.body.title,
                      content: req.body.content,
                      username: user.username,
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
                        event.eventfollowers.forEach( function( element) {
                          const notification = ({
                            senderId: user._id,
                            senderName: user.username,
                            senderimage: user.imagePath,
                            message: user.username.toString() + " posted in " + event.eventname,
                          });

                          User.findOne({_id: element.Euserid}, (err, user2) => {
                            user2.notifications.push(notification);
                            user2.save((err) => {
                              if(err) {
                                console.log("error");
                                // res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log("success");

                              }
                            });
                          });
                        });
                        res.json({ success: true, message: 'posted!'});
                      }
                    });
                  } else {
                    const post =({
                      profileimg: user.imagePath,
                      title: req.body.title,
                      content: req.body.content,
                      username: user.username,
                      createdAt : Date.now(),
                      creator: req.userData.userId,
                    });
                    event.eventPosts.push( post );
                    event.save((err) => {
                      if(err) {
                        res.json({ success: false, message:'something went wrong'});
                      } else {
                        console.log(post);
                        event.eventfollowers.forEach( function( element) {
                          const notification = ({
                            senderId: user._id,
                            senderName: user.username,
                            senderimage: user.imagePath,
                            message: user.username.toString() + " posted in " + event.eventname,
                          });

                          User.findOne({_id: element.Euserid}, (err, user2) => {
                            user2.notifications.push(notification);
                            user2.save((err) => {
                              if(err) {
                                console.log("error");
                                // res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log("success");
                              }
                            });
                          });
                        });
                        res.json({ success: true, message: 'posted!'});
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });


    }

        }
      );





module.exports = router;
