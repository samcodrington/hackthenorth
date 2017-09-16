import $ from 'jquery';


// Drag and drop code primarily from:
// https://css-tricks.com/drag-and-drop-file-uploading/
var fD, iP;
class DropZone {

    constructor(featureDetector, imageProcessor) {

        fD = featureDetector;
        iP = imageProcessor;
        this.$form = $('.drop-zone');
        this.$input = $('#file');

        this.enableInputAutoSubmit();

        if (fD.advancedUpload) {
            this.$form.addClass('has-advanced-upload');

            this.enableDragAndDrop();
        }

        this.enableSubmitEvent();
    }

    enableInputAutoSubmit() {
        this.$input.on('change', (event) => {
            this.$form.trigger('submit');
        });
    }

    enableDragAndDrop() {
        var droppedFiles = false;
        this.$form.on('drag dragstart dragend dragover dragenter dragleave drop', (event) => {
            event.preventDefault();
            event.stopPropagation();
        })
        .on('dragover dragenter', () => {
            this.$form.addClass('is-dragover');
        })
        .on('dragleave dragend drop', () => {
            this.$form.removeClass('is-dragover');
        })
        .on('drop', (event) => {
            this.droppedFiles = event.originalEvent.dataTransfer.files;
            this.$form.trigger('submit');
        });
    }

    enableSubmitEvent() {
        this.$form.on('submit', function(event) {
            if (this.$form.hasClass('is-uploading')) return false;

            this.$form.addClass('is-uploading').removeClass('is-error');

            if (fD.advancedUpload) {
                // Ajax for modern browsers
                event.preventDefault();
                event.stopPropagation();

                console.log('this.$form', this.$form[0]);
                var ajaxData = new FormData(document.getElementById('drop-zone'));

                if (this.droppedFiles && this.droppedFiles.length > 0) {
                    // ajaxData = this.droppedFiles[0]
                    var file = this.droppedFiles[0];

                    var reader = new FileReader();
                    reader.onload = function() {
                        var arrayBuffer = this.result,
                        array = new Uint8Array(arrayBuffer);
                        // binaryString = String.fromCharCode.apply(null, array);

                        // console.log('bS: ', binaryString);
                        iP.verifyJonSnow(false, array);
                    }
                    reader.readAsArrayBuffer(file);
            
                    // console.log('this.droppedFiles', this.droppedFiles);
                    // $.each(this.droppedFiles, function(i, file) {
                    //     console.log('file: ', file);
                    //     ajaxData.append(this.$input.attr('name'), file);
                    // }.bind(this));
                }

                // $.ajax({
                //     url: this.$form.attr('action'),
                //     type: this.$form.attr('method'),
                //     data: ajaxData,
                //     dataType: 'json',
                //     cache: false,
                //     contentType: false,
                //     processData: false,
                //     complete: () => {
                //         this.$form.removeClass('is-uploading');
                //     },
                //     success: (data) => {
                //         this.$form.addClass(data.success == true ? 'is-success' : 'is-error');
                //         if (!data.success) console.error(data.error); //TODO: replace with a visible span/div
                //     },
                //     error: () => {
                //         //TODO: log, alert, etc.
                //     }
                // });
            } else {
                // TODO: ajax for legacy browsers
            }

        }.bind(this));
    }

}

export default DropZone;