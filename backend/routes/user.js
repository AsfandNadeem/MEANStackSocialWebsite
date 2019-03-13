const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
var Regex = require("regex");

const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require('../models/user');
const Group = require('../models/group');
const Event = require('../models/event');
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");


const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/profileimgs");
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


router.post('/signup',
  multer({ storage: storage }).single("image"),
  (req,res,next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());

console.log(req.body.email);
    var regex = new RegExp('^(fa|sp)[0-9]{2}-[a-z]{3}-[0-9]{3}@student.comsats.edu.pk$');
    console.log(regex.test(req.body.email));
     if(regex.test(req.body.email)) {
       console.log("valid regex");
const passwordgen = randomstring.generate(7);
       console.log(passwordgen);
       bcrypt.hash(passwordgen, 10)
         .then(hash => {
           if (req.file) {
             const user = new User({
               email: req.body.email,
               password: hash,
               username: req.body.username,
               department: req.body.department,
               registrationno: req.body.registration,
               imagePath: url + "/profileimgs/" + req.file.filename
             });
             console.log(passwordgen);
             user.save()
               .then(result => {
                 res.status(201).json({
                   message: 'User Created',
                   result: result,
                 });
                 var transporter = nodemailer.createTransport({
                   service: 'gmail',
                   auth: {
                     user: 'nodeemailsender1@gmail.com',
                     pass: 'sendemailbynode'
                   }
                 });
                 var mailOptions = {
                   from: 'nodeemailsender@gmail.com',
                   to: req.body.email,
                   subject: 'Confirm your login to Comsats Student Portal',
                   text: 'Your Password is  ' + passwordgen
                 };
                 transporter.sendMail(mailOptions, function (error, info) {
                   if (error) {
                     console.log(error);
                   } else {
                     console.log('Email sent: ' + info.response);
                   }
                 });

                 console.log(user);
               })
               .catch(err => {
                 res.status(500).json({
                   error: err
                 })
               });
           } else {

             const user = new User({
               email: req.body.email,
               password: hash,
               username: req.body.username,
               department: req.body.department,
               registrationno: req.body.registration,
             });
             console.log(passwordgen);
             user.save()
               .then(result => {
                 res.status(201).json({
                   message: 'User Created',
                   result: result,
                 });
                 var transporter = nodemailer.createTransport({
                   service: 'gmail',
                   auth: {
                     user: 'nodeemailsender1@gmail.com',
                     pass: 'sendemailbynode'
                   }
                 });
                 var mailOptions = {
                   from: 'nodeemailsender@gmail.com',
                   to: req.body.email,
                   subject: 'Confirm your login to Comsats Student Portal',
                   text: 'Your Password is  ' + passwordgen
                 };
                 transporter.sendMail(mailOptions, function (error, info) {
                   if (error) {
                     console.log(error);
                   } else {
                     console.log('Email sent: ' + info.response);
                   }
                 });
                 console.log(user);
               })
               .catch(err => {
                 res.status(500).json({
                   error: err
                 })
               });

           }
         });
     }
      else {
        return res.status(401).json({
         message: "invalid email"
       });

     }



});






// router.get("/:id", (req, res, next) => {
//   User.findById(req.params.id).then(user => {
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: "User not found!"});
//     }
//   });
// });

router.post("/login", (req,res,next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then( user => {
      if ( !user ) {
       return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser= user;
      return bcrypt.compare(req.body.password, user.password);
          })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      console.log(fetchedUser+"\nafter login");
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
        );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        username: fetchedUser.username,
        department: fetchedUser.department,
        profileimg: fetchedUser.imagePath,
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth Failed"
      });
    });
});


router.put("/edit",checkAuth,(req,res,next) => {
  let fetcheduser;
  console.log("editing user---------------------------"+req.body.username+req.body.password+"---------------------------");
  bcrypt.hash(req.body.password,10)
    .then(hash => {
    const user = ({
      username: req.body.username,
      password: hash
    });
      console.log(user);
      let fetchedUser;
      User.findOneAndUpdate({_id: req.userData.userId},user,{new:true}, (err,doc) => {
        if (err){
          res.status(401).json({message: "1Not authorized to update!"});
          console.log(err);
        } else {
          fetchedUser = doc;

          const post = ({
            username: fetchedUser.username,
          });
          const event = ({
            username: fetchedUser.username,
          });
          const group = ({
            username: fetchedUser.username,
          });
          Post.updateMany({ creator: req.userData.userId}, post).then(result => {

            if (result.nModified > 0) {
              console.log(result);

            } else {
              console.log("2Not authorized to update!");
            }
          });
          Group.updateMany({ groupcreator: req.userData.userId}, group).then(result => {

            if (result.nModified > 0) {
              console.log(result);

            } else {
              console.log("2Not authorized to update!");
            }
          });
          Event.updateMany({ eventcreator: req.userData.userId}, event).then(result => {

            if (result.nModified > 0) {
              console.log(result);

            } else {
              console.log("2Not authorized to update!");
            }
          });
          res.status(200).json({
                    message:"user updated",
                    // token: token,
                    // expiresIn: 3600,
                    userId: fetchedUser._id,
                    username: fetchedUser.username,
                  });
          console.log(doc);
        }
      });


});



});

router.get("",checkAuth,(req,res,next) => {
  const username = req.query.user;


  if(username == "" || username == " "){
    res.status(200).json({users:[]});
    return;
  }
else {
  User.find({"username": {"$regex": username, "$options": "i"}})
    .then(users => {
      if (users) {
        fetchedusers = users;
        res.status(200).json({
          users: fetchedusers
        });
      } else {
        res.status(200).json({users:[]});
      }
    });
}

  });

router.get("/notifications",checkAuth, (req,res,next) => {
  const userQuery = User.findById(req.userData.userId);
  let fetchedUser;
 userQuery.then(documents => {
   fetchedUser = documents;
   return User.count();
 })
   .then(count => {
     console.log("_________________________________________________________\n"+fetchedUser.notifications);
     res.status(200).json({
       message: "notifactions fecthed",
       notifications: fetchedUser.notifications.slice(fetchedUser.notifications.length - 5,fetchedUser.notifications.length).reverse(),
       maxNotifications: count
     });
   });
});



module.exports = router;
