import $ from 'jquery';
import config from '../../../../public/data/config.js';

let person_group_id = group1;//TODO:

let api_key = '190078ca8ad2919e5e468521e5d5114a';
let uri_root = 'https://api.themoviedb.org/3/'
let max_image_set_size = 5;

class DatabaseManager {
    
    constructor() {
        this.events();
        this.cacheTmdbConfig();
        this.base_url = null;
        this.img_size = null;
    }

    events() {
        $('#nameButton').on('click', () => {
            var query = {};
            query.api_key = api_key;
            query.query = $('#nameInput').val();

            var url = uri_root + 'search/person';

            $.get(url, query, this.onNameQueryResponse.bind(this));
        });
    }

    cacheTmdbConfig() {
        var query = {};
        query.api_key = api_key;
        var url = uri_root + 'configuration';

        $.get(url, query, (response) => {
            if (response) {
                this.base_url = response.images.base_url;
                var profile_sizes = response.images.profile_sizes;
                this.img_size = 'original';
            } else {
                //TODO: error handling
            }
        });
    }

    insertActor(name, tmdbId, personId) {
        var data = {};
        data.name = name;
        data.tmdbId = tmdbId;
        data.personId = personId;
        $.post('/api/actor', data, () => {
            console.log('Success! Actor ' + name + ' inserted.');
        })
    }
    onNameQueryResponse(response) {
        console.log('response received!', response);
        if (response && response.results.length > 0) {
            var tmdbId = response.results[0].id;
            $('#tmdbId').text(tmdbId);
            
            var query = {};
            query.api_key = api_key;

            var url = uri_root + 'person/' + tmdbId + '/images';
            // Get Image from TMDB
            $.get(url, query, this.onImageQueryResponse.bind(this, tmdbId));
        } else {
            $('#tmdbId').text('No ID was found');
        }
    }

    onImageQueryResponse(response, tmdbId) {
        if (response && response.profiles.length > 0) {
            $('#tmdbImgContainer').empty();
            var i = 0;
            var urls = [];
            for (let profile of response.profiles) {
                if (i < max_image_set_size) { // Only need datasets of 5 or less

                    var url = this.base_url + this.img_size + '/' + profile.file_path;
                    
                    $('#tmdbImgContainer').append(
                        $('<img>').attr('src', url)
                    );

                    urls.push(url);
                }
            }

            createAzurePerson(tmdbId, urls); 
        } else {
            $('#tmdbImgContainer').empty();
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

    //Entry Point
    createAzurePerson(name, urls, tmdbId) {
        var query = {};
        query.api_key = config.azure.key;
        query.name = name;
        
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ person_group_id + "/persons"

        $.get(url,query, function(response) {
            this.onAzurePersonResponse(response, urls, name, tmdbId);
        });
        
    }
    onAzurePersonResponse(response, urls, name, tmdbId){
        var azureID = response.personID;
        insertActor(name, tmdbId, azureID);
        addFaces(azureID, urls);
    }
    addFaces(personID, urls){
        for (let imageUrl of urls){
            //detect all faces and make API call to add them
            var query = {};
            query.api_key = config.azure.key;
            query.url = imageUrl;
            

            var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect/";
            $.post(url, query, addFacesResponse.bind(this, personID, imageUrl))
        }
        
    }
    addFacesResponse(response, personID,imageUrl){
        var faceID = response.faceID;
        var responseFace = "&targetFace="+response.faceRectangle.left +","+ response.faceRectangle.top + "," 
                + response.faceRectangle.right +","+response.faceRectangle.bottom;
        //Add face to person
        query.personId = personID;
        query.personGroupId = person_group_id
        query.url = imageUrl;
        var url = "https://v1.0/persongroups/"+ person_group_id +"/persons/" + personId+ "/persistedFaces" + responseFace;
        $.post(url,query)
    }


}

export default DatabaseManager;