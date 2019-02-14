const express = require("express");
const multer = require("multer");

const Group = require('../models/group');
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
    console.log("____________creating group_____________\n"+req.body+"-------------------");
    const group = new Group({
      groupname: req.body.groupname,
      description: req.body.description,
      groupcreator: req.userData.userId,
      username: req.body.username,
      category: req.body.category,
    });
    group.save().then(createdGroup => {

      res.status(201).json({
        message: 'Group Created',
        result: createdGroup,
      });
      console.log(group);
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  const currentPage = +req.query.page;

  const groupQuery = Group.find().sort({ '_id': -1 });
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


// Post.findById(req.params.id).then(post => {
//   if (post) {
//     res.status(200).json(post);
//   } else {
//     res.status(404).json({ message: "Post not found!" });
//   }
// });

router.get("/:id", (req, res, next) => {
  // const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const currentPage = +req.query.page;
console.log("getiing group");
  const groupQuery = Group.findById(req.params.id).then(group => {
    if (group) {
      console.log("group found");
      res.status(200).json({
               posts: group.groupPosts
                   });
      console.log(group.groupPosts);
    } else {
      res.status(404).json({ message: "Group not found!" });
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
      Group.findById({_id: req.params.id},(err,group) => {
        if(err){
          res.json({success:false, message:'invalid group id'});
        } else {
          if(!group){
            res.json({success: false, message:'group not found'});
          } else {
            const post =({
              title: req.body.title,
              content: req.body.content,
              username: req.body.username,
              createdAt : Date.now(),
              creator: req.userData.userId,
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
