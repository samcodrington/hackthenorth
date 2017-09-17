
let api_key = '190078ca8ad2919e5e468521e5d5114a';
let uri_root = 'https://api.themoviedb.org/3/';

class movieMatch{
    constructor(actorTMDBids){
        this.findMovies(actorTMDBids);
    }
    findMovies(actorTMDBids){
        var movieIDs = checkMatches(actorIMDBids);
        var movieInfo = retrieveMovieMatches(movieIDs);
        displayMovieMatches();
    }
    checkMatches(actorTMDBids){
        var movieIDs = {"movie":{"movieID":"","movieName":"","probability":""}};
        for (i = 0; i < actorTMDBids.length; i++){
            movieIDs[i] = retrieveMovies(actorId)
        }
        
        return movieIDs;
    }
    retrieveMovies(actorId){
        
    }
}
