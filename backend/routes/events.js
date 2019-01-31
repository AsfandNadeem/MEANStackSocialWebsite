const express = require("express");
const multer = require("multer");

const Event = require('../models/event');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();


router.post(
  "",
  checkAuth,
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log("____________creating event_____________\n"+req.body+"-------------------");
    const event = new Event({
      eventname: req.body.eventname,
      description: req.body.description,
     eventcreator: req.userData.userId,
      eventdate: req.body.eventdate,
      username: req.body.username,
      category: req.body.category,
    });
    event.save().then(createdEvent => {

      res.status(201).json({
        message: 'Event Created',
        result: createdEvent,
      });
      console.log(event);
    });
  }
);

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






module.exports = router;
