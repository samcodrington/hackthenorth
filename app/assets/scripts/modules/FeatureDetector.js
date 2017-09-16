class FeatureDetector {

    constructor() {
        this.advancedUpload = this.isAdvancedUpload();
    }

    isAdvancedUpload() {
        var div = document.createElement('div');
        return (('draggable' in div) ||
                    ('ondragstart' in div) &&
                    ('ondrop' in div)) &&
                'FormData' in window &&
                'FileReader' in window
    }

}

export default FeatureDetector;