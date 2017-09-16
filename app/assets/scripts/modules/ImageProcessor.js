import $ from 'jquery';
let jQuery = $; // TODO: remove after we're no longer using example code
import config from '../../../../public/data/config.js';

class ImageProcessor {

    constructor() {
        this.events();
    }

    events() {
        $('#urlSubmit').on('click', function() {
            var url = $('#urlBox').val();
            this.verifyJonSnow(url);
        }.bind(this));
    }

    processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************
    
        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = (config.azure.key);
    
        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";
    
        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
        };
    
        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;
        console.log(sourceImageUrl);
    
        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),
    
            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
    
            type: "POST",
    
            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',

            
        })
    
        .done(function(data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
        })
    
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    };

    verifyJonSnow(url, imageData) {
        var subscriptionKey = (config.azure.key);
        var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";
        var contentType = "application/json";
        var requestBody = '{"url": ' + '"' + url + '"}';
    
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
        else {
            // Collect the file
            requestBody = imageData;
            console.log(requestBody);
            //TODO: Finish this
            contentType = "application/octet-stream";
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
            // Show formatted JSON on webpage.
            this.getActorFromFaceID(data[0].faceId);
            // TODO: Check each face in the result?
        }.bind(this))
    
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    };

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
            alert(errorString);
        });
    }

    updatePercentage(updatePercentage) {
        updatePercentage *= 100;    // Convert to value out of 100 instead of out of 1
        $('.result').removeClass('hidden');
        $('#percentage').text(updatePercentage);
    }

}

export default ImageProcessor;