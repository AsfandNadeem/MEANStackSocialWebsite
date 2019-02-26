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

router.get("/joinedgroups", checkAuth, (req, res, next) => {
  // const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const currentPage = +req.query.page;
let joinedgroups = [];
let count = 0;
  const groupQuery = Group.find().sort({ '_id': -1 });
  groupQuery
    .then(groups => {
      groups.forEach( function( onegroup) {
        console.log(onegroup);
        onegroup.groupmembers.forEach( function( onemember){
          console.log(onemember.Guserid);
          if(onemember.Guserid == req.userData.userId) {
            joinedgroups.push(onegroup);
            count++;
          }
           });
      });
      console.log(joinedgroups);
      res.status(200).json({
        message: "Groups fetched successfully!",
        groups: joinedgroups,
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


router.put("/adduser/:id",checkAuth,(req,res,next) => {
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
          group.groupmembers.push( usera);
          group.groupmembersid.push(user._id.toString());
          group.membersNo++;
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
                  res.json({success: true, message: 'user added in group'});
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
console.log("getiing group");
  const groupQuery = Group.findById(req.params.id).then(group => {
    if (group) {
      console.log("group found");
      res.status(200).json({
        groupmembers: group.groupmembers,
               posts: group.groupPosts
                   });
      console.log(group.groupPosts);
    } else {
      res.status(404).json({ message: "Group not found!" });
    }
  });
});

router.put("/likegrouppost",checkAuth,(req,res,next) => {

  console.log("liking group post"+ req.body.groupid);
  Group.findById({_id: req.body.groupid}, (err, group) => {
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
                      res.json({success: false, message: 'You already liked this post'});
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

router.put("/dislikegrouppost",checkAuth,(req,res,next) => {

  console.log("disliking group post"+ req.body.groupid);
  Group.findById({_id: req.body.groupid}, (err, group) => {
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
                      res.json({success: false, message: 'You already disliked this post'});
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

router.put("/commentgrouppost",checkAuth,(req,res,next) => {

  console.log("commenting group post"+ req.body.groupid);
  Group.findById({_id: req.body.groupid}, (err, group) => {
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
                        res.json({ success: true, message: 'post added'});
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
                        res.json({ success: true, message: 'post added'});
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

// router.delete("/delete", checkAuth, (req, res, next) => {
//   const groupid= +req.query.groupid;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
//   const postid = +req.query.postid;
//
//   Group.findById({_id: req.params.id},(err,group) => {
//
//     if(err){
//       res.json({success:false, message:'invalid group id'});
//     } else {
//       if(!group){
//         res.json({success: false, message:'group not found'});
//       } else {
//       group.groupPosts
//       }
//
//
// //   Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
// //     console.log(result);
// //     if (result.n> 0) {
// //       res.status(200).json({message: "Deleted successful!"});
// //     } else {
// //       res.status(401).json({message: "Not authorized to delete!"});
// //     }
// //   });
//  });








module.exports = router;
