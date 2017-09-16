var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var actorSchema = new Schema({
    PersonID: String,
    ImdbID: String,
    AppearedIn: [String]
}, {collection: 'actors'});

var ActorModel = mongoose.model('ActorModel', actorSchema);

module.exports = ActorModel;