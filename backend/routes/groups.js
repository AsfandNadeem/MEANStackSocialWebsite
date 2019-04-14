const express = require("express");
const multer = require("multer");

const Group = require('../models/group');
const checkAuth = require("../middleware/check-auth");

const User = require('../models/user');

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
    console.log("____________creating group_____________\n"+req.body+"-------------------");
     User.findById({ _id: req.userData.userId}, (err,user)=> {
       if(err){
         res.json({success: false, message:'something went wrong'});
       }
       if(!user){
         res.json({success: false, message:'user not found'});
       } else {
         const usera = ({
           Guserid: req.userData.userId,
           Guser: user.username
         });
         const group = new Group({
      groupname: req.body.groupname,
      description: req.body.description,
      groupcreator: req.userData.userId,
   groupmembersid: [req.userData.userId.toString()],
      username: user.username,
      category: req.body.category,
           membersNo: 1,
      groupmembers: [usera]
    });
         group.save().then(createdGroup => {
           user.groupsjoined.push(createdGroup._id);
           user.save().then( user => {
             res.status(201).json({
               message: 'Group Created',
               result: createdGroup,
             });
             console.log(group);
           });

         });
       }
     });
   });


router.get("", (req, res, next) => {
  if(req.query) {
    const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
    const currentPage = +req.query.page;

    const groupQuery = Group.find().sort({'_id': -1});
    let fetchedGroup;
    if (pageSize && currentPage) {
      groupQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    groupQuery
      .then(documents => {
        fetchedGroup = documents;
        return Group.count();
      })
      .then(count => {
        res.status(200).json({
          message: "Groups fetched successfully!",
          groups: fetchedGroup,
          maxGroups: count
        });
      });
  } else {
    const groupQuery = Group.find().sort({'_id': -1});
    let fetchedGroup;
    groupQuery
      .then(documents => {
        fetchedGroup = documents;
        return Group.count();
      })
      .then(count => {
        res.status(200).json({
          message: "Groups fetched successfully!",
          groups: fetchedGroup,
          maxGroups: count
        });
      });
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
          const group =({
            groupname: req.body.groupname,
            description: req.body.description
          });
          console.log(group);
          Group.updateOne({ _id: req.params.id, groupcreator: req.userData.userId}, group).then(result => {
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

router.get("/joinedgroups", checkAuth, (req, res, next) => {

let count = 0;
  const groupQuery = Group.find({groupmembersid: req.userData.userId}).sort({ '_id': -1 });
  groupQuery
    .then(groups => {
      res.status(200).json({
        message: "Groups fetched successfully!",
        groups: groups,
        maxGroups: count
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

router.put("/requestuser/:id",checkAuth,(req,res,next) => {
  console.log("getiing group");
  const groupQuery = Group.findById(req.params.id).then(group => {
    if (group) {
      console.log("group found");
      User.findById({ _id: req.userData.userId}, (err,user)=> {
        if(err){
          res.json({success: false, message:'something went wrong'});
        }
        if(!user){
          res.json({success: false, message:'user not found'});
        } else {
          const usera =({
            Guserid: req.userData.userId,
            Guser: user.username
          });
          group.grouprequests.push( usera);
          group.grouprequestsid.push(user._id.toString());
          // group.membersNo++;
          // user.groupsjoined.push(req.params.id);
          group.save((err) => {
            if(err) {
              res.json({ success: false, message:'something went wrong'});
            } else {
              user.save((err) => {
                if(err){
                  res.json({ success: false, message:'something went wrong'});
                } else {
                  console.log(group);
                  // res.json({success: true, message: 'user added in group'});
                  const notification = ({
                    senderId: user._id,
                    senderName: user.username,
                    senderimage: user.imagePath,
                    message: user.username.toString() + " requests to join " + group.groupname,
                  });

                  User.findOne({_id: group.groupcreator}, (err, user2) => {
                    user2.notifications.push(notification);
                    user2.save((err) => {
                      if(err) {
                        res.json({ success: false, message:'something went wrong'});
                      } else {
                        res.json({ success: true, message: 'requests sent!'});
                      }
                    });
                  });
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

router.put("/leavegroup/:id",checkAuth,(req,res,next) =>{
  const groupQuery = Group.findById(req.body.groupid).then(group => {
    if (group) {
      console.log("group found");
      User.findById({ _id: req.body.userid}, (err,user)=> {
        if(err){
          res.json({success: false, message:'something went wrong'});
        }
        if(!user){
          res.json({success: false, message:'user not found'});
        } else {
          const usera =({
            Guserid: user._id,
            Guser: user.username
          });
          // group.groupmembers.push( usera);
          // group.groupmembersid.push(user._id.toString());
          // group.membersNo++;
          const arrayIndex = group.groupmembersid.indexOf(user._id);
          group.groupmembersid.splice(arrayIndex,1);
          group.membersNo--;
          const arrayIndex2 = user.groupsjoined.indexOf(user._id);
          user.groupsjoined.slice(arrayIndex2,1);
          let a = 0;
          group.groupmembers.forEach(function (onemember) {
            if(onemember.Guserid == user._id) {
              group.groupmembers.splice(a,1);
            }
            a++;
          });

          group.save((err) => {
            if(err) {
              res.json({ success: false, message:'something went wrong'});
            } else {
              user.save((err) => {
                if(err){
                  res.json({ success: false, message:'something went wrong'});
                } else {
                  res.json({ success: true, message: 'group left!'});
                }
              });

            }
          });
        }
      });
    } else {
      res.json({success: false, message:'group not found'});
    }
  });
});

router.put("/adduser/:id",checkAuth,(req,res,next) => {
  console.log("getiing group");
  const groupQuery = Group.findById(req.body.groupid).then(group => {
    if (group) {
      console.log("group found");
      User.findById({ _id: req.body.userid}, (err,user)=> {
        if(err){
          res.json({success: false, message:'something went wrong'});
        }
        if(!user){
          res.json({success: false, message:'user not found'});
        } else {
          const usera =({
            Guserid: user._id,
            Guser: user.username
          });
          group.groupmembers.push( usera);
          group.groupmembersid.push(user._id.toString());
          group.membersNo++;
          const arrayIndex = group.grouprequestsid.indexOf(user._id);
          group.grouprequestsid.splice(arrayIndex,1);
          const arrayIndex2 = group.grouprequests.indexOf(usera);
          group.grouprequests.splice(arrayIndex2,1);
          user.groupsjoined.push(req.params.id);
          group.save((err) => {
            if(err) {
              res.json({ success: false, message:'something went wrong'});
            } else {
              user.save((err) => {
                if(err){
                  res.json({ success: false, message:'something went wrong'});
                } else {
                  console.log(group);
                  // res.json({success: true, message: 'user added in group'});
                  const notification = ({
                    senderId: user._id,
                    senderName: user.username,
                    senderimage: user.imagePath,
                    message: " Your request to join " + group.groupname + " is accepted",
                  });

                  User.findOne({_id: user._id}, (err, user2) => {
                    user2.notifications.push(notification);
                    user2.save((err) => {
                      if(err) {
                        res.json({ success: false, message:'something went wrong'});
                      } else {
                        res.json({ success: true, message: 'group joined!'});
                      }
                    });
                  });
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

router.get("/:id",checkAuth, (req, res, next) => {
  // const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const currentPage = +req.query.page;
console.log("getiing group");
  const groupQuery = Group.findById(req.params.id).then(group => {
    if (group) {
      if(group.groupmembersid.includes(req.userData.userId)) {
        console.log("group found");
        res.status(200).json({
          groupname: group.groupname,
          description: group.description,
          groupcreator: group.username,
          groupmembers: group.groupmembers,
          grouprequests: group.grouprequests,
          groupcreatorid: group.groupcreator,
          posts: group.groupPosts.reverse()
        });
        console.log(group.groupPosts);
      }
      else {
        res.status(404).json({ message: "Group not followed!" });
      }
    } else {
      res.status(404).json({ message: "Group not found!" });
    }
  });
});

router.put("/likegrouppost/:id",checkAuth,(req,res,next) => {

  console.log("liking group post"+ req.body.groupid);
  Group.findById({ _id: req.params.id}, (err, group) => {
    if(err){
      console.log("error1");
      res.json({success:false, message:'invalid group id'});
    } else {
      if(!group) {
        console.log("error");
        res.json({success: false, message:'group not found'});
      } else {
        group.groupPosts.forEach( function( element) {
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
                    res.json({ success: false, message: 'Cannot like own post'});
                  } else {
                    if(element.likedBy.includes(req.userData.userId)){
                      element.likes--;
                      const arrayIndex = element.likedBy.indexOf(user._id.toString());
                      element.likedBy.splice(arrayIndex,1);
                      group.save((err) => {
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
                        group.save((err) => {
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
                        group.save((err) => {
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

router.put("/dislikegrouppost/:id",checkAuth,(req,res,next) => {

  console.log("disliking group post"+ req.body.groupid);
  Group.findById({ _id: req.params.id}, (err, group) => {
    if(err){
      console.log("error1");
      res.json({success:false, message:'invalid group id'});
    } else {
      if(!group) {
        console.log("error");
        res.json({success: false, message:'group not found'});
      } else {
        group.groupPosts.forEach( function( element) {
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
                      group.save((err) => {
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
                        group.save((err) => {
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
                        group.save((err) => {
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

router.get("/comments/:id/:postid", (req, res, next) => {
  // const groupid = req.query.groupid;
  // const postid = req.query.postid;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  //  console.log(groupid);
  // console.log(postid);
  // console.log("getting comments in group");
 Group.findById({_id: req.params.id}, (err,group) => {
      if(err){
        res.json({ success: false, message: 'soemthing wrong'});
      } else {
        if(!group) {
          res.json({ success: false, message: 'post not found'});
        }
        else {
          group.groupPosts.forEach( function( element) {
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

router.put("/commentgrouppost/:id",checkAuth,(req,res,next) => {

  console.log("commenting group post"+ req.body.groupid);
  Group.findById({ _id: req.params.id}, (err, group) => {
    if(err){
      console.log("error1");
      res.json({success:false, message:'invalid group id'});
    } else {
      if(!group) {
        console.log("error");
        res.json({success: false, message:'group not found'});
      } else {
        group.groupPosts.forEach( function( element) {
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

                      group.save((err) => {
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


router.put("/addgroupPost/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {

    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log("addinggroupost-----------------------\n"+req.params.id+"\n----------------------------");
    if(!req.params.id){
      res.json({success: false, message:'no id provided'});
    }
    else{
      User.findById({ _id: req.userData.userId}, (err, user) => {
        if(err){
          console.log("no user");
          res.json({ success: false, message: 'soemthing went worng'});
        } else {
          if(!user){
            console.log("no found user");
            res.json({success: false,message:'user not Found'});
          }
          else {
            Group.findById({_id: req.params.id},(err,group) => {
              if(err){
                res.json({success:false, message:'invalid group id'});
              } else {
                if(!group){
                  res.json({success: false, message:'group not found'});
                } else {
                  if(req.file){
                    const post =({
                      title: req.body.title,
                      content: req.body.content,
                      username: user.username,
                      createdAt : Date.now(),
                      creator: req.userData.userId,
                      profileimg: user.imagePath,
                      imagePath: url + "/images/" + req.file.filename
                    });
                    group.groupPosts.push( post );
                    group.save((err) => {
                      if(err) {
                        res.json({ success: false, message:'something went wrong'});
                      } else {
                        console.log(post);
                        group.groupmembers.forEach( function( element) {
                          const notification = ({
                            senderId: user._id,
                            senderName: user.username,
                            senderimage: user.imagePath,
                            message: user.username.toString() + " posted in " + group.groupname,
                          });

                          User.findOne({_id: element.Guserid}, (err, user2) => {
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
                      title: req.body.title,
                      content: req.body.content,
                      username: user.username,
                      createdAt : Date.now(),
                      creator: req.userData.userId,
                      profileimg: user.imagePath
                    });
                    group.groupPosts.push( post );
                    group.save((err) => {
                      if(err) {
                        res.json({ success: false, message:'something went wrong'});
                      } else {
                        console.log(post);
                        // res.json({ success: true, message: 'post added'});
                        group.groupmembers.forEach( function( element) {
                          const notification = ({
                            senderId: user._id,
                            senderName: user.username,
                            senderimage: user.imagePath,
                            message: user.username.toString() + " posted in " + group.groupname,
                          });

                          User.findOne({_id: element.Guserid}, (err, user2) => {
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
