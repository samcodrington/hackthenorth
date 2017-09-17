var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var actorSchema = new Schema({
    personId: String,
    tmdbId: String,
    name: String
}, {collection: 'actors'});

var ActorModel = mongoose.model('ActorModel', actorSchema);

module.exports = ActorModel;