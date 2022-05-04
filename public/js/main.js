(function($) {

	var commentForm = $('#new-comment-form'),
        commentInput = $('#comment'),
        commentArea = $('#comments-list'),
        bidsArea = $('#bids-list'),
        bidForm = $('#new-bid-form'),
        bidInput = $('#bid'),
				highestBid = $('#highest_bid');

	commentForm.submit(function(event) {
		event.preventDefault();

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
})(window.jQuery);
