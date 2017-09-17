import $ from 'jquery';

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
        return {"movie":movieList,"tv":tvList};
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
        checkForMatchesInList(combinedList,'movie');
        checkForMatchesInList(combinedList,'tv');
    }
    sortCombinedList(){
        //TODO: Sort combined List elements as a stretch goal
    }
    checkForMatchesInList(combinedList, type){
        var hitList = [];
        for (var i = 0; i < numActors-1; i++){
            var listToCheck = combinedList[i][type];
            for (var j = 0; j < listToCheck.length; j ++){
                var idToCheck = listToCheck[j].id;
                
                for (var k = i + 1; k < numActors; k ++){
                    if (   checkIDAgainstList(idToCheck, combinedList[k][type])  )
                        hitList = addIDToHitList(idToCheck,type, hitList);
                }
            } 
        }
        if (numActors>2)
            sortHitList();
        console.log(hitList);

    }
    checkIDAgainstList(id,list){
        for (let elem of list){
            if (elem.id == id)
                return true;
        }
        return false;
    }

    addIDToHitList(idToCheck, type, hitList){
        for (let elem of hitList) {
            if (elem.id === idToCheck && elem.type === type) {
                // Element already exists in hitlist
                elem.count++; // increment its hit counter
                return hitList;
            }
        }
        // Add element to hitlist
        var hitObject = {};
        hitObject.id = idToCheck;
        hitObject.type = type;
        hitObject.count = 2;
        return hitList;
    }

    sortHitList(hitList){
        hitList.sort(function(a,b){
            return a.count - b.count
        })
    }

    removeDoubles(tmdbIds) {
        var seen = {};
        return tmdbIds.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : seen([item] = true);
        });
    }
    /*
    allTitles is of the form:
    [
        {
            'type': 'movie'/'tv',
            'id': 'asdfasdf',
            'count': 3
        }
    ]
    */
    displayMovieMatches(hitList) {
        // Take at most top 3 hits
        if (hitList.length > 3) {
            hitList = hitList.slice(0, 3);
        }

        this.generateCards(hitList);
    }

    generateCards(topTitles) {
        for (let title of topTitles) {
            let $html = $('<div>', {'class': 'card'}).append(
                $('<h2>').text('Title: ').append(
                    $('<span>').text(title.name)
                ),
                $('<h2>').text('Features ').append(
                    $('<span>', {'class': 'title'}).text(title.count),
                    $('<span>').text(' of the actors.')
                )
            );
            $('.column--titles').append($html);
        }
    }
}
