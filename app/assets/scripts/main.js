import imageProcessor from './modules/ImageProcessor';
import $ from 'jquery';

var iP = new imageProcessor();
$('#urlbutton').on('click', function(){
    iP.processImage();
});