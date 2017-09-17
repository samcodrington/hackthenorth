
let api_key = '190078ca8ad2919e5e468521e5d5114a';
let uri_root = 'https://api.themoviedb.org/3/';
let combinedList = [];
let numActors = 0;
let numListsRetrieved = 0;

class movieMatch{
    
    constructor(actorTMDBids){
        actorTMDBids = this.removeDoubles(actorTMDBids);        
        numActors = actorTMDBids.length;
        this.findMovies(actorTMDBids);
    }
    
    findMovies(actorTMDBids){
        for (i = 0; i < numActors; i++){
            var actorId = actorTMDBids[i];
            retrieveAll(actorId);
        }
        var movieInfo = retrieveMovieMatches(movieIDs);
        displayMovieMatches(movieInfo);
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
                tvList.push({"id":castItem.id,"name":castItem.title});
            else if (castItem.media_type == "movie")
                movieList.push({"id":castItem.id,"name":castItem.title});
        }
        return [movieList,tvList];
    }
    
    retrieveAllResponse(response){
        splitList = splitTVMovie(response.cast);
        addNewCombinedList(splitList);
    }
    
    addNewCombinedList(splitList){
        combinedList.push(splitList);
        numListsRetrieved++;
        if (numListsRetrieved == numActors)
            checkMatches();    
    }
    
    checkMatches(){
        sortCombinedList();
        for (i = 0; i < numActors; i++){
            var combinedList[0].
        }
    }
    sortCombinedList(){
        //TODO: Sort combined List elements as a stretch goal
    }

    removeDoubles(tmdbIds) {
        var seen = {};
        return tmdbIds.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : seen([item] = true);
        });
    }
}
