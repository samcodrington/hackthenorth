import $ from 'jquery';
import config from '../../../../public/data/config.js';

let person_group_id = 'group1';

let api_key = config.tmdb.key;
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
        $('#nameButton').on('click', this.onNameButtonClick.bind(this));

        $('#nameInput').on('keypress', function(event) {
            if (event.keyCode == 13) {
                this.onNameButtonClick();
            }
        }.bind(this));
    }

    onNameButtonClick() {
        var name = $('#nameInput').val();
        var query = {};
        query.api_key = api_key;
        query.query = name;

        var url = uri_root + 'search/person';

        $.get(url, query, this.onNameQueryResponse.bind(this, name));
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
        })
    }

    onNameQueryResponse(name, response) {
        if (response && response.results.length > 0) {
            var tmdbId = response.results[0].id;
            $('#tmdbId').text(tmdbId);
            name = response.results[0].name;
            var query = {};
            query.api_key = api_key;

            var url = uri_root + 'person/' + tmdbId + '/images';
            // Get Image from TMDB
            $.get(url, query, this.onImageQueryResponse.bind(this, tmdbId, name));
        } else {
            $('#tmdbId').text('No ID was found');
        }
    }

    onImageQueryResponse(tmdbId, name, response) {
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
                    i++;
                }
            }

            this.createAzurePerson(name, urls, tmdbId); 
        } else {
            $('#tmdbImgContainer').empty();
        }
    }

    // createAzurePersonGroup(groupId, groupName){
    //     var query = {};
    //     query.api_key = config.azure.key;
    //     query.name = groupName;
    //     var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ groupId + "/persons"

    //     $.get(url,query,this.onAzurePersonGroupResponse)
    // }

    // onAzurePersonGroupResponse(response){
    //     //TODO: 
    // }

    // Entry Point of Azure Insertion
    createAzurePerson(name, urls, tmdbId) {
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ person_group_id + "/persons";

        this.postRequest(url, {"name": name}, this.onAzurePersonResponse.bind(this, urls, name, tmdbId));
        
    }

    onAzurePersonResponse(urls, name, tmdbId, response){
        var azureID = response.personId;
        this.insertActor(name, tmdbId, azureID);
        this.detectFaces(azureID, urls);
    }

    detectFaces(personID, urls){
        for (let imageUrl of urls){

            // Detect all faces and make Azure API call to add them
            var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect/";
            
            this.postRequest(url, {'url': imageUrl}, this.addFacesResponse.bind(this, personID, imageUrl));
        }
        
    }

    // Called in a loop from addFaces
    addFacesResponse(personID, imageUrl, response){
        var responseFace = "&targetFace="+response[0].faceRectangle.left +","+ response[0].faceRectangle.top + "," 
                + response[0].faceRectangle.width +","+response[0].faceRectangle.height;
        // Add face to person
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ person_group_id +"/persons/" + personID + "/persistedFaces";
        this.postRequest(url, {'url': imageUrl});
        // $.ajax({
        //     url: url,
        //     type: 'post',
        //     data: {
        //         'url': imageUrl
        //     },
        //     headers: {
        //         'Ocp-Apim-Subscription-Key': config.azure.key,
        //         'Content-Type': 'application/json'
        //     }
        // });
    }

    postRequest(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader('Ocp-Apim-Subscription-Key', config.azure.key);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                if (callback) {
                    callback(json);
                }
            }
        }.bind(this);
        var data = JSON.stringify(data);
        xhr.send(data);
    }


}

export default DatabaseManager;