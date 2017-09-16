var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var actorSchema = new Schema({
    personID: String,
    tmdbID: String,
    name: String
}, {collection: 'actors'});

var ActorModel = mongoose.model('ActorModel', actorSchema);

module.exports = ActorModel;