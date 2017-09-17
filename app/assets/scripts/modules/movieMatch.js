import $ from 'jquery';

let api_key = '190078ca8ad2919e5e468521e5d5114a';
let uri_root = 'https://api.themoviedb.org/3/';
let combinedList = [];
let numActors = 0;
let numListsRetrieved = 0;

const MAX_MATCHES = 5; // The most number of common titles to be displayed
const BASE_URI = 'https://www.themoviedb.org/movie/';

class movieMatch{
    
    constructor(actorTMDBids){
        actorTMDBids = this.removeDoubles(actorTMDBids);        
        numActors = actorTMDBids.length;
        this.findMovies(actorTMDBids);
    }
    
    findMovies(actorTMDBids){
        for (var i = 0; i < numActors; i++){
            var actorId = actorTMDBids[i];
            this.retrieveAll(actorId);
        }
    }

    retrieveAll(actorId) {
        
        var query = {};
        query.api_key = api_key;
        var url = uri_root + "person/" + actorId + "/combined_credits";
        $.get(url, query, this.retrieveAllResponse.bind(this));
        
    }
    
    splitTVMovie(combinedList){
        var movieList = [];
        var tvList = [];
        for (let castItem of combinedList){
            if (castItem.media_type == "tv") {
                tvList.push({
                    "id": castItem.id,
                    "name": castItem.name
                });
            } else if (castItem.media_type == "movie") {
                movieList.push({
                    "id": castItem.id,
                    "name": castItem.title
                });
            }
                
        }
        return {"movie":movieList,"tv":tvList};
    }
    
    retrieveAllResponse(response){
        var splitList = this.splitTVMovie(response.cast);
        this.addNewCombinedList(splitList);
    }
    
    addNewCombinedList(splitList){
        combinedList.push(splitList);
        numListsRetrieved++;
        if (numListsRetrieved == numActors)
            this.checkMatches();    
    }
    
    checkMatches(){
        this.sortCombinedList();
        this.checkForMatchesInList(combinedList,'movie');
        this.checkForMatchesInList(combinedList,'tv');
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
                    var secondList = combinedList[k][type];
                
                    if ( this.checkIDAgainstList(idToCheck, secondList))
                        hitList = this.addElemToHitList(listToCheck[j],type, hitList);
                }
            } 
        }
        if (numActors>2) {
            this.sortHitList(hitList);
        }
        this.displayMovieMatches(hitList);

    }
    checkIDAgainstList(id,list){
        for (let elem of list){
            if (elem.id == id) {
                return true;
            }
        }
        return false;
    }

    addElemToHitList(elemToCheck, type, hitList){
        for (let elem of hitList) {
            if (elem.id === elemToCheck.id && elem.type === type) {
                // Element already exists in hitlist
                elem.count++; // increment its hit counter
                return hitList;
            }
        }
        // Add element to hitlist
        var hitObject = {};
        hitObject.id = elemToCheck.id;
        hitObject.name = elemToCheck.name;
        hitObject.type = type;
        hitObject.count = 2;
        hitList.push(hitObject);
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
            return seen.hasOwnProperty(item) ? false : seen[item] = true;
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
        // Take at most top MAX_MATCHES hits
        if (hitList.length > MAX_MATCHES) {
            hitList = hitList.slice(0, MAX_MATCHES);
        }

        this.generateCards(hitList);
    }

    generateCards(topTitles) {
        for (let title of topTitles) {
            let $titleSpan = $('<span>', {'class': 'nameSpan'}).text(title.name);
            let $html = $('<div>', {'class': 'card'}).append(
                $('<h2>').text('Title: ').append(
                    $titleSpan
                ),
                $('<h2>').text('Features ').append(
                    $('<span>', {'class': 'title'}).text(title.count),
                    $('<span>').text(' of the actors.')
                )
            );

            $titleSpan.on('click', () => {
                window.location.href = BASE_URI + title.id;
            });
            $('.column--titles').append($html);
        }
    }
}

export default movieMatch;