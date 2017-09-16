var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hackthenorth', {
    useMongoClient: true
});

var ActorModel = require('../public/scripts/modules/models/ActorModel');

/*
    Queries should be of the form:
    {
        PersonID: String            // The ID of the actor to locate
        ImdbID: boolean(true)       // Whether or not to return these 
        AppearedIn: boolean(true)   //  two fields, default true
    }
*/
router.get('/actor', function(req, res, next) {
    var PersonID = req.query['PersonID'],
    ImdbID = req.query['ImdbID'] ? req.query['ImdbID'] : true,
    AppearedIn = req.query['AppearedIn'] ? req.query['AppearedIn'] : true;

    ActorModel.find({ 'PersonID': PersonID }, function(err, docs) {
        console.log(docs[0]);
    });
    
    return res.end(JSON.stringify(test));
});

router.post('/actor', function(req, res, next) {
    console.log('PersonID' + body.PersonID);
    console.log('ImdbID' + body.ImdbID);
    console.log('AppearedIn.length()' + body.AppearedIn.length());
});

module.exports = router;