
let api_key = '190078ca8ad2919e5e468521e5d5114a';
let uri_root = 'https://api.themoviedb.org/3/';

class movieMatch{
    constructor(actorTMDBids){
        this.findMovies(actorTMDBids);
    }
    findMovies(actorTMDBids){
        var movieIDs = checkMatches(actorIMDBids);
        var movieInfo = retrieveMovieMatches(movieIDs);
        displayMovieMatches(movieInfo);
    }
    checkMatches(actorTMDBids){
        var movieIDs = [];
        var tvIDs = [];
        for (i = 0; i < actorTMDBids.length; i++){
            var actorId = actorTMDBids[i];
            movieIDs[i] = retrieveMovies(actorId);
            tvIDs[i] = retrievetvIDs(actorId);
        }
        
        return movieIDs;
    }
    retrieveMovies(actorId){
        var query = {};
        query.api_key = api_key;
        var url = uri_root + "/person/" + actorId + "/movie_credits"

    }
}
