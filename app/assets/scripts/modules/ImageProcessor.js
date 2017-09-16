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
    
        this.resetPercentage();

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "",
        };
        if (url){
            // Display the image.
            document.querySelector("#sourceImage").src = url;
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
            personGroupId: 'jon-snow'
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
            if (data[0].candidates.length > 0) {
                confidence = data[0].candidates[0].confidence;
            }
            this.updatePercentage(confidence);
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            
        }.bind(this))
    
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
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

}

export default ImageProcessor;