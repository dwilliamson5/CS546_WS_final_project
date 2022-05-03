(function($) {

	var commentForm = $('#new-comment-form'),
		commentInput = $('#comment'),
		commentArea = $('#comments-list');

	// commentForm.submit(function(event) {
	// 	event.preventDefault();

	// 	var commment = commentInput.val();

	// 	if (commment) {			
    //         var requestConfig = {
    //             method: 'POST',
    //             url: commentForm.attr('action'),
    //             contentType: 'application/json',
    //             data: JSON.stringify({
    //                 comment: commment
    //             })
    //         };

    //         $.ajax(requestConfig).then(function(responseMessage) {
    //             var newElement = $(responseMessage);
    //             commentArea.append(newElement);
    //         });
	// 	}
	// });
})(window.jQuery);