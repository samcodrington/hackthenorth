let api_key = '190078ca8ad2919e5e468521e5d5114a';
let uri_root = 'https://api.themoviedb.org/3/';
let combinedList = [];

class movieMatch{
    constructor(actorTMDBids){
        actorTMDBids = this.removeDoubles(actorTMDBids);
        this.findMovies(actorTMDBids);
    }
    findMovies(actorTMDBids){
        var movieIDs = checkMatches(actorIMDBids);
        var movieInfo = retrieveMovieMatches(movieIDs);
        displayMovieMatches(movieInfo);
    }
    checkMatches(actorTMDBids){
        for (i = 0; i < actorTMDBids.length; i++){
            var actorId = actorTMDBids[i];
            retrieveAll(actorId);
        }
   }

    retrieveAll(actorId) {
        var query = {};
        query.api_key = api_key;
        var url = uri_root + "/person/" + actorId + "/combined_credits";
        $.get(url,query,retrieveAllResponse);
        
    }
    splitTVMovie(combinedList){
        var movieList = [];
        var tvList = [];
        for (let castItem of combinedList){
            if (castItem.media_type == "tv")
                tvList.push(castItem.id);
            else if (castItem.media_type == "movie")
                movieList.push(castItem.id);
        }
        return [movieList,tvList];
    }
    
    retrieveAllResponse(response){
        splitList = splitTVMovie(response.cast);
        addNewCombinedList(splitList);
    }
    addNewCombinedList(combinedList){

    }
    removeDoubles(tmdbIds) {
        var seen = {};
        return tmdbIds.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : seen([item] = true);
        });
    }
}