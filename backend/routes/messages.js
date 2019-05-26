const express = require('express');
const checkAuth = require("../middleware/check-auth");
const Messages = require("../models/messageModels");
const Conversation = require("../models/conversationsModel");
const User = require("../models/user");
const router = express.Router();


router.get("/chat-messages/:sender_Id/:receiver_Id",
  checkAuth,
  (req,res,next) => {
// const conversation =  Conversation.findOne({
//       $or: [
//         {
//           $and: [
//             {'participants.senderId': req.userData.userId},
//             {'participants.receiverId': req.params.receiver_Id}
//             ]
//         },
//         {
//           $and: [
//             {'participants.senderId': req.params.receiver_Id},
//             {'participants.receiverId': req.userData.userId}
//           ]
//         }
//       ]
//     }).select('_id');
 Conversation.findOne({
      $or: [
        {
          $and: [
            {'participants.senderId': req.userData.userId},
            {'participants.receiverId': req.params.receiver_Id}
          ]
        },
        {
          $and: [
            {'participants.senderId': req.params.receiver_Id},
            {'participants.receiverId': req.userData.userId}
          ]
        }
      ]
    }).then(conversation => {
   console.log(conversation);
   if(conversation) {
     let fetchedMessages;
     const messageQuery = Messages.findOne({conversationId: conversation._id});
     messageQuery
       .then(documents => {
         fetchedMessages = documents;
         return Messages.count();
       })
       .then(count => {
         User.findById({ _id: req.params.receiver_Id}, (err,userchat)=>{
           if(err) {
             console.log("nochat user")
           } else {
             // console.log(userchat.username)
             res.status(200).json({
               message: 'message returned',
               messages: fetchedMessages,
               usernamechat: userchat.username
             });
           }
         });
         // res.status(200).json({
         //   message: 'message returned',
         //   messages: fetchedMessages
         // });
       });
     // Messages.findOne({conversationId: conversation._id});
     //  res.status(201).json({
     //    message: 'message returned',
     //   messages: messages
     //  });
   }
 });

  });

router.post("/chat-messages/:sender_Id/:receiver_Id",
  checkAuth,
  (req, res, next) => {
  console.log(req.userData.userId);
    console.log(req.params.receiver_Id);
  const { sender_Id, receiver_Id } = req.params;
    Conversation.find({
      $or: [
        {
          participants: {
            $elemMatch: {senderId: req.userData.userId, receiverId: req.params.receiver_Id}
          }
          },
        {
          participants: {
            $elemMatch: {senderId: req.params.receiver_Id, receiverId: req.userData.userId}
          }
        }
      ]
    }, (err, result) => {
      if(result.length > 0) {
console.log(result);
        User.findById({ _id: req.userData.userId}, (err,userfirst)=>{
          if(err) {
            console.log("no user");
            // res.json({ success: false, message: 'Invalid user id'});
          }else {
            User.findById({ _id: req.params.receiver_Id}, (err,usersecond)=>{
              if(err) {
                console.log("no user");
                // res.json({ success: false, message: 'Invalid user id'});
              }else {
                // if(err) {
                //   console.log("no user");
                //   // res.json({ success: false, message: 'Invalid user id'});
                // }else {
                const message123 = ({
                  message: [{
                    senderId:  req.userData.userId,
                    receiverId:  req.params.receiver_Id,
                    sendername: userfirst.username,
                    receivername: usersecond.username,
                    body: req.body.message
                  }]

                });

                Messages.update({
                  conversationId: result[0]._id
                }, {
                  $push:{
                    message: {
                      senderId:  req.userData.userId,
                      receiverId:  req.params.receiver_Id,
                      sendername: userfirst.username,
                      receivername:usersecond.username,
                      body: req.body.message
                    }
                  }
                }).then(() => {
                  res.json({ success: true, message: 'mesage sent!'});
                });
              }
            });
          }
        });


      } else {
        User.findById({ _id: req.userData.userId}, (err,userfirst)=>{
          if(err) {
            console.log("no user1");
            // res.json({ success: false, message: 'Invalid user id'});
          }else {
            console.log(userfirst);
            User.findById({ _id: req.params.receiver_Id}, (err,usersecond)=>{
              if(err) {
                console.log("no user2");
                // res.json({ success: false, message: 'Invalid user id'});
              }else {
                console.log(usersecond);
                const newConversation = new Conversation();
                newConversation.participants.push({
                  senderId: req.userData.userId,
                  receiverId: req.body.receiverId
                });
                // const saveConversation =  newConversation.save();
                newConversation.save().then(saveConversation => {
                  const message1 = new Messages();
                  console.log("error1");
                  message1.conversationId = saveConversation._id;
                  console.log("error2");
                  message1.sender = req.userData.userId;
                  console.log("error3");
                  message1.receiver = req.body.receiverName;
                  console.log("error4");
                  // User.findById({ _id: req.userData.userId}, (err,user)=>{
                  //
                  // });
                  message1.message.push({
                    senderId: req.userData.userId,
                    receiverId: req.body.receiverId,
                    sendername: userfirst.username,
                    receivername: usersecond.username,
                    body: req.body.message
                  });
                  // message1().save().then( result => {
                  //   console.log("error5");
                  //                res.status(201).json({
                  //         message: 'message sent',
                  //         result: result,
                  //       });
                  //   });
                  const user1 = ({
                    receiverId: req.body.receiverId,
                    msgId: message1._id
                  });


                  User.findById({_id: req.userData.userId},(err,userone) => {
                    if(err){
                      console.log("error user");
                    } else {
                      console.log(userone);
                      userone.chatList.push({
                        receiverId: req.body.receiverId,
                        msgId: message1._id
                      });
                    }
                  });

                  User.findById({_id: req.userData.userId},(err,userone) => {
                    if(err){
                      console.log("error user");
                    } else {
                      console.log(userone);
                      userone.chatList.push({
                        receiverId: req.body.receiverId,
                        msgId: message1._id
                      });

                      userone.save((err) => {
                        if(err){
                          console.log("user save error");
                        } else {
                          User.findById({_id: req.body.receiverId},(err,usertwo) => {
                            if(err){
                              console.log("error user");
                            } else {
                              console.log(usertwo);
                              usertwo.chatList.push({
                                receiverId: req.userData.userId,
                                msgId: message1._id
                              });

                              usertwo.save((err) => {
                                if(err){
                                  console.log("user save error");
                                } else {
                                  message1.save().then(result => {
                                    console.log("sent");
                                    res.status(201).json({
                                      message: 'message Created',
                                      result: result,
                                    });

                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });


                });
              }
            });
          }
        });
        // const newConversation = new Conversation();
        // newConversation.participants.push({
        //   senderId: req.userData.userId,
        //   receiverId: req.body.receiverId
        // });
        // // const saveConversation =  newConversation.save();
        // newConversation.save().then(saveConversation => {
        //   const message1 = new Messages();
        //   console.log("error1");
        //   message1.conversationId = saveConversation._id;
        //   console.log("error2");
        //   message1.sender = req.userData.userId;
        //   console.log("error3");
        //   message1.receiver = req.body.receiverName;
        //   console.log("error4");
        //   // User.findById({ _id: req.userData.userId}, (err,user)=>{
        //   //
        //   // });
        //   message1.message.push({
        //     senderId: req.userData.userId,
        //     receiverId: req.body.receiverId,
        //     sendername: "Asfand",
        //     receivername: req.body.receiverName,
        //     body: req.body.message
        //   });
        //   // message1().save().then( result => {
        //   //   console.log("error5");
        //   //                res.status(201).json({
        //   //         message: 'message sent',
        //   //         result: result,
        //   //       });
        //   //   });
        //   const user1 = ({
        //       receiverId: req.body.receiverId,
        //       msgId: message1._id
        //     });
        //
        //
        //   User.findById({_id: req.userData.userId},(err,userone) => {
        //     if(err){
        //       console.log("error user");
        //     } else {
        //       console.log(userone);
        //       userone.chatList.push({
        //         receiverId: req.body.receiverId,
        //         msgId: message1._id
        //       });
        //     }
        //   });
        //
        //   User.findById({_id: req.userData.userId},(err,userone) => {
        //     if(err){
        //       console.log("error user");
        //     } else {
        //       console.log(userone);
        //       userone.chatList.push({
        //         receiverId: req.body.receiverId,
        //         msgId: message1._id
        //       });
        //
        //       userone.save((err) => {
        //         if(err){
        //           console.log("user save error");
        //         } else {
        //           User.findById({_id: req.body.receiverId},(err,usertwo) => {
        //             if(err){
        //               console.log("error user");
        //             } else {
        //               console.log(usertwo);
        //               usertwo.chatList.push({
        //                 receiverId: req.userData.userId,
        //                 msgId: message1._id
        //               });
        //
        //               usertwo.save((err) => {
        //                 if(err){
        //                   console.log("user save error");
        //                 } else {
        //                   message1.save().then(result => {
        //                     console.log("sent");
        //                     res.status(201).json({
        //                       message: 'message Created',
        //                       result: result,
        //                     });
        //
        //                   });
        //                 }
        //               });
        //             }
        //           });
        //         }
        //       });
        //     }
        //   });
        //   // User.update({
        //   //   _id: req.userData.userId
        //   // }, {
        //   //   $push:{
        //   //     chatList: {
        //   //       $each :[
        //   //         {
        //   //           receiverId: req.body.receiverId,
        //   //           msgId: message1._id
        //   //         }
        //   //       ],
        //   //     $position:0
        //   //     }
        //   //   }
        //   // })
        //   //
        //   // User.update({
        //   //   _id: req.body.receiverId
        //   // }, {
        //   //   $push:{
        //   //     chatList: {
        //   //       $each :[
        //   //         {
        //   //           receiverId: req.userData.userId,
        //   //           msgId: message1._id
        //   //         }
        //   //       ],
        //   //       $position:0
        //   //     }
        //   //   }
        //   // });
        //   // User.update({
        //   //   _id: req.userData.userId
        //   // },
        //   //   {
        //   //     $push: {
        //   //       chatList: {
        //   //         $each: [
        //   //           {
        //   //             receiverId: req.body.receiverId,
        //   //             msgId: message1._id
        //   //           }
        //   //         ],
        //   //         $position: 0
        //   //       }
        //   //     }
        //   //   }
        //   //   );
        //   //
        //   // User.update({
        //   //     _id: req.body.receiverId
        //   //   },
        //   //   {
        //   //     $push: {
        //   //       chatList: {
        //   //         $each: [
        //   //           {
        //   //             receiverId: req.userData.userId,
        //   //                 msgId: message1._id
        //   //           }
        //   //         ],
        //   //         $position: 0
        //   //       }
        //   //     }
        //   //   }
        //   // );
        //   // User.findOneAndUpdate({_id: req.userData.userId},
        //   //   user1,{new:false}, (err,doc) => {
        //   //   if (err){
        //   //     res.status(401).json({message: "1Not authorized to update!"});
        //   //     console.log(err);
        //   //   } else {
        //   //     fetchedUser = doc;
        //   //
        //   //     //
        //   //     // res.status(200).json({
        //   //     //   message:"user updated",
        //   //     //   // token: token,
        //   //     //   // expiresIn: 3600,
        //   //     //   userId: fetchedUser._id,
        //   //     //   username: fetchedUser.username,
        //   //     // });
        //   //     console.log(doc);
        //   //   }
        //   // });
        //
        //   // const user2 = ({
        //   //   chatList: [{
        //   //     receiverId: req.userData.userId,
        //   //     msgId: message1._id
        //   //   }]
        //   // });
        //   // User.findOneAndUpdate({_id: req.body.receiverId},
        //   //   user2,{new:false}, (err,doc) => {
        //   //     if (err){
        //   //       res.status(401).json({message: "1Not authorized to update!"});
        //   //       console.log(err);
        //   //     } else {
        //   //       fetchedUser = doc;
        //   //
        //   //
        //   //       // res.status(200).json({
        //   //       //   message:"user updated",
        //   //       //   // token: token,
        //   //       //   // expiresIn: 3600,
        //   //       //   userId: fetchedUser._id,
        //   //       //   username: fetchedUser.username,
        //   //       // });
        //   //       console.log(doc);
        //   //     }
        //   //   });
        //   // message1.save().then(result => {
        //   //   console.log("sent");
        //   //   res.status(201).json({
        //   //     message: 'message Created',
        //   //     result: result,
        //   //   });
        //   //
        //   // });
        //
        // });

      }
    } );
  });

module.exports = router;
