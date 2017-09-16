import $ from 'jquery';
let jQuery = $; // TODO: remove after we're no longer using example code
import config from '../../../../public/data/config.js';

class ImageProcessor {

    constructor() {
        this.processImage();
        this.events();
    }

    events() {
        $('#urlSubmit').on('click', () => {
            //TODO:
        });
    }

    processImage() {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************
    
        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = (config.azure.key);
        console.log("API Key is " + subscriptionKey);
    
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

    postFace(){
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************
    
        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = (config.azure.key);
        console.log("API Key is " + subscriptionKey);
    
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

}

export default ImageProcessor;