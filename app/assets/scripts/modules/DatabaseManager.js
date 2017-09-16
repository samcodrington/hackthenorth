import $ from 'jquery';

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

}

export default DatabaseManager;