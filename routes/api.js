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
        personId: String        // The ID of the actor to locate
        tmbId: boolean(true)   // Whether or not to return these 
        name: boolean(true)     //  two fields, default true
    }
    NOTE the capitalizations!
*/
router.get('/actor', function(req, res, next) {
    var personId = req.query['personId'],
    tmbId = req.query['tmbId'] ? req.query['tmbId'] : true,
    name = req.query['name'] ? req.query['name'] : true;

    ActorModel.findOne({ 'personId': personId }, function(err, result) {
        if (result) {
            return res.end(JSON.stringify(result));
        } else {
            return res.sendStatus(404);
        }
    });
    
});

router.post('/actor', function(req, res, next) {
    var actorData = {
        name: req.body.name,
        personId: req.body.personId,
        tmdbId: req.body.tmdbId
    }
    var actor = new ActorModel(actorData);
    actor.save();
    res.sendStatus(200);
});

module.exports = router;