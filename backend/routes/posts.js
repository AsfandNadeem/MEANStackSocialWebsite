const express = require("express");
const multer = require("multer");
var natural = require('natural');
const Post = require("../models/post");
const Category = require("../models/categories");
const User = require('../models/user');
const Advertiser = require("../models/advertiserModel");
const Advertisement = require("../models/advertisementModel");
const Report = require("../models/report");
const cloudinary = require("cloudinary");
require('dotenv').config();
const cloudinaryStorage = require("multer-storage-cloudinary");
var keyword_extractor = require("keyword-extractor");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
stemmer = natural.PorterStemmer;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "ComsatsSocial",
  allowedFormats: ["jpg", "png"]
});

router.get("/recommendations", checkAuth, (req,res,next) => {

 const catQuery = Category.find({usersids: req.userData.userId}).sort({ '_id': -1 });
  catQuery
    .then(categories => {
      var posts=[];
      categories.forEach(function (onecategory) {
        console.log(onecategory.cattitle);
        posts.push(new Promise(function(resolsve,reject){

          Post.findOne({
            '_id': { $in: onecategory.postsids}
          })
            .then(p =>{

              resolsve(p);

            });
        }));


      });
      Promise.all(posts).then(function (results) {
        // uniqueArray = results.filter(function (iten,pos) {
        //   return
        // });

        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: results,
          maxPosts: results.length
        });
      });
      // console.log(results)
      // console.log("_______________________________________"+ fetchedPosts);
    });
  // console.log("_______________________________________"+ fetchedPosts);
});

router.post("/postmobile",
  checkAuth,
  (req, res, next) => {
    console.log("addingpost-----------------------\n"+req.body.title+"\n----------------------------");

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

                    const post = new Post({
                      title: req.body.title,
                      content: req.body.content,
                      username: user.username,
                      createdAt : Date.now(),
                      creator: req.userData.userId,
                      profileimg: user.imagePath
                    });

            post.save((err) => {
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
);
router.post(
  "/advert",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());

    Advertisement.findById({ _id: req.body.adid}, (err, advert) => {
      if(err){
        console.log("no add");
        res.json({ success: false, message: 'soemthing went worng'});
      } else {
        if(!advert){
          console.log("no found advertismemtn");
          res.json({success: false,message:'advetismemtn not Found'});
        } else {
          if(advert.imagePath) {
            const post = new Post({
              _id: advert._id,
              title: advert.title,
              content: advert.content,
              username: advert.username,
              createdAt: advert.createdAt,
              category: "General",
              imagePath: advert.imagePath
            });

            post.save().then(createdPost => {
              advert.approved = true;
              advert.save().then(createdAdvert => {
                res.status(201).json({
                  message: "Post added successfully",
                  post: {
                    ...createdPost,
                    id: createdPost._id
                  }
                });
              });
              // res.status(201).json({
              //   message: "Post added successfully",
              //   post: {
              //     ...createdPost,
              //     id: createdPost._id
              //   }
              // });
            });
          }
          else {
            const post = new Post({
              _id: advert._id,
              title: advert.title,
              content: advert.content,
              username: advert.username,
              createdAt: advert.createdAt,
              category: "General"
            });

            post.save().then(createdPost => {
              advert.approved = true;
              advert.save().then(createdAdvert => {
                res.status(201).json({
                  message: "Post added successfully",
                  post: {
                    ...createdPost,
                    id: createdPost._id
                  }
                });
              });
              // res.status(201).json({
              //   message: "Post added successfully",
              //   post: {
              //     ...createdPost,
              //     id: createdPost._id
              //   }
              // });
            });
          }
        }
      }
    });


  });

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    User.findById({ _id: req.userData.userId}, (err, user) => {
      if(err){
        console.log("no user");
        res.json({ success: false, message: 'soemthing went worng'});
      } else {
        if(!user){
          console.log("no found user");
          res.json({success: false,message:'user not Found'});
        } else {
          if(req.file) {
            const post = new Post({
              title: req.body.title,
              content: req.body.content,
              username: user.username,
              createdAt: Date.now(),
              category: req.body.category,
              creator: req.userData.userId,
              imagePath: req.file.url,
              // imagePath: url + "/images/" + req.file.filename,
              profileimg: user.imagePath
            });


            post.save().then(createdPost => {

              // var keyword_extractor = require("keyword-extractor");
              //
              var sentence = req.body.content.toString();
              var extraction_result = keyword_extractor.extract(sentence,{
                language:"english",
                remove_digits: true,
                return_changed_case:true,
                remove_duplicates: false
              });
              //
              const data = require('../data.json');
              //
              extraction_result.forEach(function(index){
                for (let i=0, len=data.length; i<len; i++){

                 var stem = stemmer.stem(data[i].text);
                 console.log(stem);
                  if(data[i].text==index){
                    // console.log(data[i].text +' is of category '+ data[i].category);
                    console.log(stem +' is of category '+ data[i].category);
                  }
                }


              });

              res.status(201).json({
                message: "Post added successfully",
                post: {
                  ...createdPost,
                  id: createdPost._id
                }
              });
            });
          }
          else {
            const post = new Post({
              title: req.body.title,
              content: req.body.content,
              username: user.username,
              createdAt: Date.now(),
              category: req.body.category,
              creator: req.userData.userId,
              profileimg: user.imagePath
            });

            post.save().then(createdPost => {

              // var keyword_extractor = require("keyword-extractor");
              //
              var sentence = req.body.content.toString();
              var extraction_result = keyword_extractor.extract(sentence,{
                language:"english",
                remove_digits: true,
                return_changed_case:true,
                remove_duplicates: false
              });
              //
              const data = require('../data.json');
              //
              extraction_result.forEach(function(index){
                for (let i=0, len=data.length; i<len; i++){
                  var stem = stemmer.stem(data[i].text);
                  // console.log(stem);
                  if(data[i].text==index){
                    // console.log(data[i].text +' is of category '+ data[i].category);
                    console.log(stem +' is of category '+ data[i].category);
                    // const category = new Category({
                    //   cattitle: data[i].category,
                    //   postsids:  [createdPost._id]
                    // });
                   Category.findOne({cattitle: data[i].category}, (err, categ) => {
                     console.log(categ);
                     if(categ) {
                       categ.postsids.push(createdPost._id);
                       categ.usersids.push(req.userData.userId);
                       categ.save();

                     }
                    else if(categ == null) {
                       console.log(categ);
                       console.log("no category");
                       const categorynew = new Category({
                         cattitle: data[i].category,
                         postsids:  [createdPost._id],
                         usersids: [req.userData.userId]
                       });
                       categorynew.save();
                     }
                   });

                  }
                }


              });
              res.status(201).json({
                message: "Post added successfully",
                post: {
                  ...createdPost,
                  id: createdPost._id
                }
              });
            });
          }
        }
      }
    });

  }
);

router.post("/report", checkAuth, (req, res, next) => {
  console.log(req.body.title);
          const report = new Report({
          title: req.body.title,
          content: req.body.content,
          username: req.body.username,
          creator: req.body.creator,
          postid: req.body.postid,
          reportedby: req.userData.userId,
          reason: req.body.reason,
        });
          report.save()
            .then(result => {
              console.log("________________________________________reported");
              res.status(201).json({
                      message: 'Report Created',
                      result: result,
                    });
            });
});



router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {

    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      console.log(url);
      imagePath = req.file.url
      // imagePath = url + "/images/" + req.file.filename;
    }

    User.findById({ _id: req.userData.userId}, (err, user) => {
      if(err){
        res.json({ success: false, message: 'soemthing wrong'});
      } else {
        if(!user){
          console.log("no found user");
          res.json({success: false,message:'user not Found'});
        }
        else {
          const post =({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            username: user.username,
            creator: req.userData.userId,
            createdAt : Date.now(),
            imagePath: imagePath
          });
          console.log(post);
          Post.updateOne({ _id: req.params.id, creator: req.userData.userId}, post).then(result => {
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


router.get("/comments/:id", (req, res, next) => {
  console.log("getting comments" + req.params.id);
  Post.findById({_id: req.params.id}, (err,post) => {
    if(err){
      res.json({ success: false, message: 'soemthing wrong'});
    } else {
      if(!post) {
        res.json({ success: false, message: 'post not found'});
      }
      else {
        console.log(post.comments);
        res.status(200).json({
        message: "Posts fetched successfully!",
        comments: post.comments
      });
      }
    }
    }

  );

});


router.get("/user/:id", (req, res, next) => {

    const postQuery = Post.find({ creator: req.params.id }).sort({'_id': -1});
    let fetchedPosts;
    let user;
    let userid;
    // if (pageSize && currentPage) {
    //   postQuery
    //     .skip(pageSize * (currentPage - 1))
    //     .limit(pageSize);
    // }

    postQuery
      .then(documents => {
        fetchedPosts = documents;
        console.log(user);
        return fetchedPosts.length;
      })
      .then(count => {
        User.findById(req.params.id).then(userget => {
          if(userget) {
            res.status(200).json({
              message: "Posts fetched successfully!",
              posts: fetchedPosts,
              usern: userget.username,
              friends: userget.friends,
              requests: userget.requests,
              maxPosts: count
            });
          } else {
            res.json({ success: false, message: 'Invalid user id'});
          }
        });
        // res.status(200).json({
        //   message: "Posts fetched successfully!",
        //   posts: fetchedPosts,
        //   usern: user,
        //   maxPosts: count
        // });
      });

});

router.get("", (req, res, next) => {
  if(req.query) {
    const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
    const currentPage = +req.query.page;

    const postQuery = Post.find().sort({'_id': -1});
    let fetchedPosts;
    if (pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

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
  }
  else {
    const postQuery = Post.find().sort({'_id': -1});
     let fetchedPosts;


    postQuery
      .then(documents => {
        fetchedPosts = documents;
        return Post.count();
      })
      .then(count => {
        console.log(count+"-------------------------\n"+fetchedPosts);
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count
        });
      });
  }
});

router.get("/archives", checkAuth, (req, res, next) => {
  if(req.query) {
    const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
    const currentPage = +req.query.page;

    const postQuery = Post.find({archivedBy: req.userData.userId}).sort({'id': -1});

    let fetchedPosts;
    if (pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery
      .then(documents => {
        fetchedPosts = documents;
        return fetchedPosts.length;
      })
      .then(count => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts.reverse(),
          maxPosts: count
        });
      });
  } else {
    const postQuery = Post.find({archivedBy: req.userData.userId}).sort({'id': -1});

    let fetchedPosts;

    postQuery
      .then(documents => {
        fetchedPosts = documents;
        return fetchedPosts.length;
      })
      .then(count => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts.reverse(),
          maxPosts: count
        });
      });
  }
});

router.delete("/archives/:id",checkAuth, (req,res) => {
  console.log("deleteingarchiving----------------------\n"+req.params.id+"\n----------------------------");
  if(!req.params.id){
    res.json({ success: false, message: 'ID not provided'});
  } else {
    User.findById({ _id: req.userData.userId}, (err,user)=>{
      if(err) {
        console.log("no user");
        res.json({ success: false, message: 'Invalid user id'});
      }else {
        if(!user) {
          console.log("no found user");
          res.json({success: false,message:'user not Found'});
        } else {
          Post.findById({ _id: req.params.id}, (err,post)=>{
            if(err) {
              console.log("no user");
              res.json({ success: false, message: 'Invalid user id'});
            } else {
              if(!post) {
                console.log("no found post");
                res.json({success: false,message:'user not Found'});
              } else {
                const arrayIndex = post.archivedBy.indexOf(user._id);
                post.archivedBy.splice(arrayIndex,1);
                const arrayIndexu = user.archives.indexOf(req.params.id);
                user.archives.splice(arrayIndexu,1);
                // post.archivedBy.push(req.userData.userId);
                // user.archives.push(req.params.id);

                user.save((err) => {
                  if(err) {
                    res.json({success: false, message:'something went wrong'});
                  } else {
                    post.save((err)=> {
                      if(err) {
                        res.json({success: false, message:'something went wrong'});
                      } else {
                        res.json({success: true, message: 'user archived removed'});
                        console.log(user);
                      }
                    });

                  }
                });
              }
            }


          });
        }
      }
    });
  }



});

// router.delete("/archives/:id" ,checkAuth,(req,res,next) => {
//   User.findOne({_id: req.userData.userId}, (err, user) => {
//     if(err) {
//       res.json({success:false, message:'Something went wrong'});
//     } else {
//       if(!user){
//         res.json({success:false, message:'user not found'});
//       }
//     }
//   });
// });

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if (result.n> 0) {
      res.status(200).json({message: "Deleted successful!"});
    } else {
      res.status(401).json({message: "Not authorized to delete!"});
    }
  });
});


router.put("/likePost/:id",checkAuth,(req,res) =>{
  console.log("liking-----------------------\n"+req.params.id+"\n----------------------------");
    if(!req.params.id){
      res.json({success: false, message:'no id provided'});
    } else {
      Post.findById({_id: req.params.id},(err,post) => {
        if(err){
          res.json({success:false, message:'invalid post id'});
        } else {
          if(!post){
            res.json({success: false, message:'post not found'});
          } else {
            User.findOne({_id: req.userData.userId}, (err, user) => {
              if (err) {
                res.json({success:false, message:'Something went wrong'});
              } else {
                if(!user) {
                  res.json({ success: false, message:'Could not find user'});
                } else {
                  if(user._id === post.creator) {
                    res.json({ success: false, message: 'Cannot like own post'});
                  } else {
                    if(post.likedBy.includes(user._id.toString())) {
                      post.likes--;
                      const arrayIndex = post.likedBy.indexOf(user._id.toString());
                      post.likedBy.splice(arrayIndex,1);
                      post.save((err) => {
                        if(err) {
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          res.json({ success: true, message: 'post disliked!'});
                        }
                      });
                    } else {
                      if(post.dislikedBy.includes(user._id.toString())) {
                        post.dislikes--;
                        const arrayIndex = post.dislikedBy.indexOf(user._id.toString());
                        post.dislikedBy.splice(arrayIndex,1);
                        post.likes++;
                        post.likedBy.push(user._id.toString());
                        user.likes.push(req.params.id.toString());
                        post.save((err) => {
                          if(err) {
                            res.json({ success: false, message:'something went wrong'});
                          } else {
                            user.save((err)=>{
                              if(err){
                                console.log("error");
                                res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log(user);

                                if(post.creator == null) {
                                  res.json({ success: true, message: 'post liked!'});
                                } else {

                                  const notification = ({
                                    senderId: user._id,
                                    senderName: user.username,
                                    senderimage: user.imagePath,
                                    message: user.username.toString() + " likes your post",
                                  });
                                  if(post.creator == req.userData.userId) {
                                    res.json({success: true, message: 'post liked!'});
                                  } else {
                                    User.findOne({_id: post.creator}, (err, user2) => {
                                      if(user2) {
                                        user2.notifications.push(notification);
                                        user2.save((err) => {
                                          if (err) {
                                            res.json({success: false, message: 'something went wrong'});
                                          } else {
                                            res.json({success: true, message: 'post liked!'});
                                          }
                                        });
                                      } else {
                                        res.json({success: true, message: 'post liked!'});
                                      }
                                    });
                                  }

                                }
                              }
                            });
                          }
                        });
                      } else {
                        post.likes++;
                        post.likedBy.push(user._id.toString());
                        user.likes.push(req.params.id.toString());
                        post.save((err) => {
                          if(err) {
                            res.json({ success: false, message:'something went wrong'});
                          } else {
                            console.log(post);
                            user.save((err)=>{
                              if(err){
                                console.log("error");
                                res.json({ success: false, message:'something went wrong'});
                              } else {
                                console.log(user);

                                if(post.creator == null) {
                                  res.json({ success: true, message: 'post liked!'});
                                } else {

                                  // res.json({ success: true, message: 'post liked!'});
                                  const notification = ({
                                    senderId: user._id,
                                    senderName: user.username,
                                    senderimage: user.imagePath,
                                    message: user.username.toString() + " likes your post",
                                  });
if(post.creator == req.userData.userId) {
  res.json({success: true, message: 'post liked!'});
} else {
  User.findOne({_id: post.creator}, (err, user2) => {
    if(user2) {
      user2.notifications.push(notification);
      user2.save((err) => {
        if (err) {
          res.json({success: false, message: 'something went wrong'});
        } else {
          res.json({success: true, message: 'post liked!'});
        }
      });
    } else {
      res.json({success: true, message: 'post liked!'});
    }

  });
}


                                }



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
        }

      });
    }
  });

router.put("/dislikePost/:id",checkAuth,(req,res) =>{
  console.log("disliking-----------------------\n"+req.params.id+"\n----------------------------");
  if(!req.params.id){
    res.json({success: false, message:'no id provided'});
  } else {
    Post.findById({_id: req.params.id},(err,post) => {
      if(err){
        res.json({success:false, message:'invalid post id'});
      } else {
        if(!post){
          res.json({success: false, message:'post not found'});
        } else {
          User.findOne({_id: req.userData.userId}, (err, user) => {
            if (err) {
              res.json({success:false, message:'Something went wrong'});
            } else {
              if(!user) {
                res.json({ success: false, message:'Could not find user'});
              } else {
                if(req.userData.userId === post.creator) {
                  res.json({ success: false, message: 'Cannot dislike own post'});
                } else {
                  if(post.dislikedBy.includes(user._id.toString())) {
                    post.dislikes--;
                    const arrayIndex = post.dislikedBy.indexOf(user._id.toString());
                    post.dislikedBy.splice(arrayIndex,1);
                    post.save((err) => {
                      if(err) {
                        res.json({ success: false, message:'something went wrong'});
                      } else {
                        res.json({ success: true, message: 'post disliked!'});
                      }
                    });
                  } else {
                    if(post.likedBy.includes(user._id.toString())) {
                      post.likes--;
                      const arrayIndex = post.likedBy.indexOf(user._id.toString());
                      post.likedBy.splice(arrayIndex,1);
                      post.dislikes++;
                      post.dislikedBy.push(user._id.toString());
                      user.dislikes.push(req.params.id.toString());
                      post.save((err) => {
                        if(err) {
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          user.save((err)=>{
                            if(err){
                              console.log("error");
                              res.json({ success: false, message:'something went wrong'});
                            } else {
                              console.log(user);

                              if(post.creator == null) {
                                res.json({ success: true, message: 'post liked!'});
                              } else {
                                const notification = ({
                                  senderId: user._id,
                                  senderName: user.username,
                                  senderimage: user.imagePath,
                                  message: user.username.toString() + " dislikes your post",
                                });

                                if(post.creator == req.userData.userId){
                                  res.json({success: true, message: 'post disliked!'});
                                }
                                else {
                                  User.findOne({_id: post.creator}, (err, user2) => {
                                    if(user2) {
                                      user2.notifications.push(notification);
                                      user2.save((err) => {
                                        if (err) {
                                          res.json({success: false, message: 'something went wrong'});
                                        } else {
                                          res.json({success: true, message: 'post disliked!'});
                                        }
                                      });
                                    } else {
                                      res.json({success: true, message: 'post disliked!'});
                                    }

                                  });
                                }
                              }
                            }
                          });
                        }
                      });
                    } else {

                      post.dislikes++;
                      post.dislikedBy.push(user._id.toString());
                      user.dislikes.push(req.params.id.toString());
                      post.save((err) => {
                        if(err) {
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          user.save((err)=>{
                            if(err){
                              console.log("error");
                              res.json({ success: false, message:'something went wrong'});
                            } else {
                              console.log(user);
                              if(post.creator == null) {
                                res.json({ success: true, message: 'post liked!'});
                              } else {
                                const notification = ({
                                  senderId: user._id,
                                  senderName: user.username,
                                  senderimage: user.imagePath,
                                  message: user.username.toString() + " dislikes your post",
                                });
                                if(post.creator == req.userData.userId){
                                  res.json({success: true, message: 'post disliked!'});
                                }
                                else {
                                  User.findOne({_id: post.creator}, (err, user2) => {
                                    if(user2) {
                                      user2.notifications.push(notification);
                                      user2.save((err) => {
                                        if (err) {
                                          res.json({success: false, message: 'something went wrong'});
                                        } else {
                                          res.json({success: true, message: 'post disliked!'});
                                        }
                                      });
                                    } else {
                                      res.json({success: true, message: 'post disliked!'});
                                    }

                                  });
                                }

                              }
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
      }

    });
  }

});


router.put("/comment/:id",checkAuth, (req,res) => {
  console.log("commenting----------------------\n"+req.params.id+"\n----------------------------");
  if(!req.body.comment){
    res.json({ success: false, message: 'No Comment provided'});
  }
  else{
    if(!req.params.id){
      res.json({ success: false, message: 'ID not provided'});
    }else{
      Post.findById({ _id: req.params.id}, (err,post)=>{

        if(err) {
          res.json({ success: false, message: 'Invalid post id'});
        }
        else{
          if(!post){
            res.json({success: false,message:'blog not Found'});
          }else{
            User.findOne({_id: req.userData.userId}, (err, user) =>{
              if (err){
                res.json({success: false, message:'something went wrong'});
              }else{
                if(!user){
                  res.json({success: false, message:'user not found'});
                }else{
                  post.comments.push({
                    comment:req.body.comment,
                    commentator:user.username,
                    commentatorid: user._id
                  });
                  post.commentsNo++;
                  user.commentson.push(post._id.toString());


                  post.save((err) => {
                    if(err){
                      res.json({success: false, message:'something went wrong'});
                    }else{

                      console.log(post);

                      user.save((err)=>{
                        if(err){
                          console.log("error");
                          res.json({ success: false, message:'something went wrong'});
                        } else {
                          console.log(user);
                          if(post.creator == null) {
                            res.json({ success: true, message: 'post liked!'});
                          } else {
                          const notification = ({
                            senderId: user._id,
                            senderName: user.username,
                            message: user.username.toString() + " commented on your post",
                          });
if(post.creator == req.userData.userId){
  res.json({success: true, message: 'comment added'});
}
else{
  User.findOne({_id: post.creator}, (err, user2) => {
    if(user2){
      user2.notifications.push(notification);
      user2.save((err) => {
        if (err) {
          res.json({success: false, message: 'something went wrong'});
        } else {
          res.json({success: true, message: 'comment added'});
        }
      });
    } else {
      res.json({success: true, message: 'comment added'});
    }

  });
}

                        }
                        }
                      });
                    }
                  });

                }
              }
            });
          }        }

      });
    }
  }

});

router.put("/archivePost/:id",checkAuth, (req,res) => {
  console.log("archiving----------------------\n"+req.params.id+"\n----------------------------");
  if(!req.params.id){
    res.json({ success: false, message: 'ID not provided'});
  } else {
    User.findById({ _id: req.userData.userId}, (err,user)=>{
      if(err) {
        console.log("no user");
                res.json({ success: false, message: 'Invalid user id'});
              }else {
        if(!user) {
          console.log("no found user");
          res.json({success: false,message:'user not Found'});
        } else {
          Post.findById({ _id: req.params.id}, (err,post)=>{
            if(err) {
              console.log("no user");
              res.json({ success: false, message: 'Invalid user id'});
            } else {
              if(!post) {
                console.log("no found post");
                res.json({success: false,message:'user not Found'});
              } else {
                if(post.archivedBy.includes(user._id)) {
                  res.json({success: false,message:'already archived'});
                } else {
                  post.archivedBy.push(req.userData.userId);
                  user.archives.push(req.params.id);

                  user.save((err) => {
                    if(err) {
                      res.json({success: false, message:'something went wrong'});
                    } else {
                      post.save((err)=> {
                        if(err) {
                          res.json({success: false, message:'something went wrong'});
                        } else {
                          res.json({success: true, message: 'user archived'});
                          console.log(user);
                        }
                      });

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



});


module.exports = router;
