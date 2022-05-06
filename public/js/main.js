(function($) {

	var commentForm = $('#new-comment-form'),
        commentInput = $('#comment'),
        commentArea = $('#comments-list'),
        commentAlert = $('#error-alert'),
        bidsArea = $('#bids-list'),
        bidForm = $('#new-bid-form'),
        bidInput = $('#bid'),
        highestBid = $('#highest_bid');

	commentForm.submit(function(event) {
        event.preventDefault();
        hideCommentError();

		var commment = commentInput.val();

		if (commment) {
            var requestConfig = {
                method: 'POST',
                url: commentForm.attr('action'),
                contentType: 'application/json',
                data: JSON.stringify({
                    comment: commment
                })
            };

            $.ajax(requestConfig).then(function(responseMessage) {
                if (responseMessage.error && responseMessage.error.length > 0) {
                    showCommentError(responseMessage.error);
                    return;
                }

                var newElement = $(responseMessage);
                commentArea.append(newElement);
                commentForm.trigger('reset');
            });
		}
    });

    bidForm.submit(function(event) {
		event.preventDefault();

		var bid = bidInput.val();

		if (bid) {
            var requestConfig = {
                method: 'POST',
                url: bidForm.attr('action'),
                contentType: 'application/json',
                data: JSON.stringify({
                    bid: bid
                })
            };

            $.ajax(requestConfig).then(function(responseMessage) {
                var newElement = $(responseMessage);
                bidsArea.append(newElement);
                bidForm.trigger('reset');
            });

            if (parseInt(bid) > parseInt(highestBid.text())) {
                highestBid.text(bid);
            }
		}
	});

    function showCommentError(message) {
        commentInput.val('');
        commentAlert.empty();
        commentAlert.append(message);
        commentAlert.removeClass('invisible');
        commentAlert.addClass('visible');
    }

    function hideCommentError() {
        commentAlert.removeClass('visible');
        commentAlert.addClass('invisible');
    }
})(window.jQuery);
