import $ from 'jquery';
import config from '../../../../public/data/config.js';

class ImageProcessor {

    constructor() {
        this.events();
    }

    events() {
        $('#urlSubmit').on('click', function() {
            var url = $('#urlBox').val();
            this.detectFaces(url);
        }.bind(this));
    }

    detectFaces(url) {
        var subscriptionKey = (config.azure.key);
        var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";
        var contentType = "application/json";
        var requestBody = '{"url": ' + '"' + url + '"}';

        $('.column').empty();

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "",
        };
        if (url){
            // Display the image.
            document.querySelector(".img-container img").src = url;
        }
    
        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),
    
            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type",contentType);
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
    
            type: "POST",
    
            // Request body.
            data: requestBody
        })
    
        .done(function(data) {
            for (let face of data) {
                this.getActorFromFaceID(face.faceId);
            }
        }.bind(this))
    
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : ($.parseJSON(jqXHR.responseText).message) ? 
                $.parseJSON(jqXHR.responseText).message : $.parseJSON(jqXHR.responseText).error.message;
            this.printError(errorString);
        }.bind(this));
    }

    getActorFromFaceID(faceID){
        var subscriptionKey = (config.azure.key);
        var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/identify";
        var contentType = "application/json";
        var requestBody = JSON.stringify({
            faceIds: [faceID],
            personGroupId: 'group1'
        });

        $.ajax({
            url: uriBase,
    
            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type",contentType);
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
    
            type: "POST",
    
            // Request body.
            data: requestBody
        })
    
        .done(function(data) {
            // Show formatted JSON on webpage.
            
            var confidence = 0;
            // Only one face is sent each call so 'data' should have length 1
            if (data[0].candidates.length > 0) {
                // data[0].candidates can be of length 0 or more, each has a 'personId' and a 'confidence' property
                this.generateCards(data[0].candidates);
            }
            
        }.bind(this))
    
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : ($.parseJSON(jqXHR.responseText).message) ? 
                $.parseJSON(jqXHR.responseText).message : $.parseJSON(jqXHR.responseText).error.message;
            this.printError(errorString);
        }.bind(this));
    }

    resetPercentage() {
        $('#percentage').text(0);
    }

    updatePercentage(updatePercentage) {
        updatePercentage *= 100;    // Convert to value out of 100 instead of out of 1
        updatePercentage = Math.round(updatePercentage * 100) / 100; // Round to 2 decimal places
        $('.result').removeClass('hidden');
        var $percentage = $('#percentage')
        if (updatePercentage > $percentage.text()) {
            $percentage.text(updatePercentage);
        }
        $('.error').addClass('hidden');
    }

    printError(errorString) {
        $('.result').addClass('hidden');
        $('.error').removeClass('hidden');
        $('.error__text').text(errorString);
    }

    generateCards(candidates) {
        for (let candidate of candidates) {
            let $nameSpan = $('<span>').text('Loading...');
            let $html = $('<div>', {'class': 'card'}).append(
                $('<h2>').text('Name: ').append(
                    $nameSpan
                ),
                $('<h2>').text('Facial Match: ').append(
                    $('<span>', {'class': 'title'}).text(this.toPercentage(candidate.confidence)),
                    $('<span>').text('%')
                )
            )

            // Asynchronously  load name from personId
            var query = {};
            query.personId = candidate.personId;
            $.get('/api/actor', query, function(result) {
                if (result.error) {
                    $nameSpan.text('Error loading name.');
                } else {
                    var resultJSON = JSON.parse(result);
                    $nameSpan.text(resultJSON.name);
                }
            });

            // Add to DOM
            $('.column--actors').append($html);
        }
    }

    toPercentage(confidence) {
        confidence *= 100;
        confidence = Math.round(confidence * 100) / 100;
        return confidence;
    }

}

export default ImageProcessor;