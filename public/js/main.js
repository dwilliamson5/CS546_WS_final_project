(function ($) {

    var commentForm = $('#new-comment-form'),
        commentInput = $('#comment'),
        commentArea = $('#comments-list'),
        noCommentNotice = $('#no_comment_notice'),
        noBidNotice = $('#no_bids_notice'),
        bidsArea = $('#bids-list'),
        bidForm = $('#new-bid-form'),
        bidInput = $('#bid'),
        highestBid = $('#highest_bid');

    commentForm.submit(function (event) {
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

            $.ajax(requestConfig).then(function (responseMessage) {
                noCommentNotice.hide();
                var newElement = $(responseMessage);
                commentArea.append(newElement);
                commentForm.trigger('reset');
            });
        }
    });

    bidForm.submit(function (event) {
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

            $.ajax(requestConfig).then(function (responseMessage) {
                noBidNotice.hide();
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
