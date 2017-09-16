import $ from 'jquery';
import config from '../../../../public/data/config.js';


class DatabaseManager {

    constructor() {
        this.events();
    }

    events() {
        $('#nameButton').on('click', () => {
            var query = {};
            query.api_key = '190078ca8ad2919e5e468521e5d5114a';
            query.query = $('#nameInput').val();

            var url = 'https://api.themoviedb.org/3/search/person';

            $.get(url, query, this.onNameQueryResponse);
        });
    }

    onNameQueryResponse(response) {
        console.log('response received!', response);
        if (response && response.results.length > 0) {
            var tmdbId = response.results[0].id;
            $('#tmdbId').text(tmdbId);
        } else {
            $('#tmdbId').text('No ID was found');
        }
    }

    createAzurePersonGroup(groupId, groupName){
        var query = {};
        query.api_key = config.azure.key;
        query.name = groupName;
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ groupId + "/persons"

        $.get(url,query,this.onAzurePersonGroupResponse)
    }

    onAzurePersonGroupResponse(response){
        //TODO: 
    }

    createAzurePerson(name, urls) {
        var query = {};
        query.api_key = config.azure.key;
        query.name = name;
        var person_group_id = null;//TODO:
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ person_group_id + "/persons"

        $.get(url,query, function(response) {
            this.onAzurePersonResponse(response, urls);
        });
        
    }
    onAzurePersonResponse(response, urls){
        var azureID = response.personID;
        addFaces(azureID, urls)
    }
    addFaces(personID, urls){
        for (let url of urls){
            var query = {};
            query.api_key = config.azure.key;
            query.url = url;

        }
    }


}

export default DatabaseManager;