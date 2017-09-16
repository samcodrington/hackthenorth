import $ from 'jquery';
import config from '../../../../public/data/config.js';


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

    onNameQueryResponse(response) {
        console.log('response received!', response);
        if (response && response.results.length > 0) {
            var tmdbId = response.results[0].id;
            $('#tmdbId').text(tmdbId);

            var query = {};
            query.api_key = api_key;

            var url = uri_root + 'person/' + tmdbId + '/images';
            // Get Image from TMDB
            $.get(url, query, this.onImageQueryResponse.bind(this));
        } else {
            $('#tmdbId').text('No ID was found');
        }
    }

    onImageQueryResponse(response) {
        if (response && response.profiles.length > 0) {
            $('#tmdbImgContainer').empty();
            var i = 0;
            for (let profile of response.profiles) {
                if (i < max_image_set_size) { // Only need datasets of 5 or less

                    var url = this.base_url + this.img_size + '/' + profile.file_path;
                    
                    $('#tmdbImgContainer').append(
                        $('<img>').attr('src', url)
                    );
                }
            }
        } else {
            $('#tmdbImgContainer').empty();
        }
    }

    createAzurePersonGroup(groupId, groupName){
        var query = {};
        query.api_key = config.azure.key;
        query.name = groupName;
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ groupId + "/persons"
    }

    createAzurePerson(name) {
        var query = {};
        query.api_key = config.azure.key;
        query.name = name;
        var person_group_id = null;//TODO:
        var url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+ person_group_id + "/persons"

        $.get(url,query,this.onAzurePersonResponse)
    }
    onAzurePersonResponse(response){
        var azureID = response.personID;
        $('#AzureID').text(azureID);
    }

}

export default DatabaseManager;