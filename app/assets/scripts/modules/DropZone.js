import $ from 'jquery';


// Drag and drop code primarily from:
// https://css-tricks.com/drag-and-drop-file-uploading/
var fD;
class DropZone {

    constructor(featureDetector) {

        fD = featureDetector;
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
        this.$form.on('submit', (event) => {
            if (this.$form.hasClass('is-uploading')) return false;

            this.$form.addClass('is-uploading').removeClass('is-error');

            if (fD.advancedUpload) {
                // Ajax for modern browsers
                event.preventDefault();

                console.log('this.$form', this.$form.get(0));
                var ajaxData = new FormData(this.$form.get(0));

                if (this.droppedFiles) {
                    console.log('this.droppedFiles', this.droppedFiles);
                    $.each(this.droppedFiles, function(i, file) {
                        console.log(i + 'attr(name)', this.$input.attr('name'));
                        ajaxData.append(this.$input.attr('name'), file);
                    }.bind(this));
                }

                console.log('ajaxData', ajaxData);

                $.ajax({
                    url: this.$form.attr('action'),
                    type: this.$form.attr('method'),
                    data: ajaxData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    complete: () => {
                        this.$form.removeClass('is-uploading');
                    },
                    success: (data) => {
                        this.$form.addClass(data.success == true ? 'is-success' : 'is-error');
                        if (!data.success) console.error(data.error); //TODO: replace with a visible span/div
                    },
                    error: () => {
                        //TODO: log, alert, etc.
                    }
                });
            } else {
                // TODO: ajax for legacy browsers
            }

        });
    }

}

export default DropZone;