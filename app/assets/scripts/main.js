import ImageProcessor from './modules/ImageProcessor';
import FeatureDetector from './modules/FeatureDetector';
import DropZone from './modules/DropZone';
import $ from 'jquery';

var iP = new ImageProcessor();
$('#urlbutton').on('click', function(){
    iP.processImage();
});
var fD = new FeatureDetector();
// var dZ = new DropZone(fD, iP);