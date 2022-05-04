import { uploadImage, getUniqueName } from './s3Operations.js';

(function ($) {

    var signupForm = $('#signup-form'),
        imageInput = $('#image'),
        imageURLInput = $('#imageURL');

    var shouldSubmit = false;

    signupForm.submit(function (event) 
    {
        if (shouldSubmit) {
            return;
        }

        event.preventDefault();
        var success = addImage();
    });

    function addImage() {

        var files = document.getElementById('image').files;

        if (!files.length) {
            // DISPLAY NO IMAGE ERROR ON UI
            return false;
        }

        var file = files[0];
        var fileName = getUniqueName(file.name);

        uploadImage(fileName, file, updateInput);
        
        return true;
    }

    function updateInput(fileURL) {

        imageURLInput.val(fileURL);
        imageInput.val('');

        shouldSubmit = true;
        signupForm.submit();
    }

})(window.jQuery);