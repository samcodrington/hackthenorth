import $ from 'jquery';

class DropZone {

    constructor(featureDetector) {

        this.$form = $('.drop-zone');

        if (featureDetector.advancedUpload) {
            this.$form.addClass('has-advanced-upload');
        }
    }

}

export default DropZone;