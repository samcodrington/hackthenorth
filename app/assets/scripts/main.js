import ImageProcessor from './modules/ImageProcessor';
import FeatureDetector from './modules/FeatureDetector';
import DatabaseManager from './modules/DatabaseManager';
import $ from 'jquery';

var iP = new ImageProcessor();
$('#urlbutton').on('click', function(){
    iP.processImage();
});
var fD = new FeatureDetector();
var dM = new DatabaseManager();