(function ($) {
    var commentForm = $("#new-comment-form"),
        commentInput = $("#comment"),
        commentArea = $("#comments-list"),
        noCommentNotice = $("#no_comment_notice"),
        noBidNotice = $("#no_bids_notice"),
        commentAlert = $("#error-alert-comment"),
        bidAlert = $("#error-alert-bid"),
        bidsArea = $("#bids-list"),
        bidForm = $("#new-bid-form"),
        bidInput = $("#bid"),
        highestBid = $("#highest_bid"),
        profileInfoForm = $("profile-form"),
        usernameInput = $("#username"),
        nameInput = $("#name"),
        emailInput = $("#email"),
        bioInput = $("#bio"),
        //profImageInput = $("#image"),
        passwordEditForm = $("password-form"),
        currentPasswordInput = $("#current_password"),
        newPasswordInput = $("#new_password"),
        newPasswordConfirmationInput = $("#new_password_confirmation"),
        signUpForm = $("#signup-form"),
        passwordInput = $("#password"),
        passwordConfirmationInput = $("#password_confirmation"),
        universityInput = $("#universityId"),
        loginForm = $("#login-form"),
        emailDomainInput = $("#emailDomain"),
        editUniversityForm = $("#edit-university-form"),
        updateItemForm = $("#update-item-form"),
        titleInput = $("#title"),
        descriptionInput = $("#description"),
        keywordsInput = $("#keywords"),
        priceInput = $("#price"),
        pickUpMethodInput = $("#pick_up_method"),
        soldInput = $("#sold"),
        newUniversityForm = $("#new-university-form"),
        newItemForm = $("#new-item-form"),
        newRatingForm = $("#new-rating-form"),
        ratingInput = $("#rating"),
        errorStatus = $("#error-status"),
        errorMessage = $("#error-message");

    commentForm.submit(function (event) {
        hideCommentError();

        var comment = commentInput.val();

        if (comment) {
            var requestConfig = {
                method: "POST",
                url: commentForm.attr("action"),
                contentType: "application/json",
                data: JSON.stringify({
                    comment: comment,
                }),
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                if (responseMessage.error && responseMessage.error.length > 0) {
                    showCommentError(responseMessage.error);
                    return;
                }

                noCommentNotice.hide();

                var newElement = $(responseMessage);
                commentArea.append(newElement);
                commentForm.trigger("reset");
            });
        }
    });

    bidForm.submit(function (event) {
        hideBidError();

        var bid = bidInput.val();

        if (bid) {
            var requestConfig = {
                method: "POST",
                url: bidForm.attr("action"),
                contentType: "application/json",
                data: JSON.stringify({
                    bid: bid,
                }),
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                if (responseMessage.error && responseMessage.error.length > 0) {
                    showBidError(responseMessage.error);
                    return;
                }

                noBidNotice.hide();

                var newElement = $(responseMessage);
                bidsArea.append(newElement);
                bidForm.trigger("reset");
            });

            if (parseInt(bid) > parseInt(highestBid.text())) {
                highestBid.text(bid);
            }
        }
    });

    profileInfoForm.submit((event) => {
        var username = usernameInput.val(),
            name = nameInput.val(),
            email = emailInput.val(),
            bio = bioInput.val();
        //imageURL = profileImageInput.val();

        if (!username || !name || !email || !bio) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }
        const alphanumeric = new RegExp(/^[a-z0-9]+$/i);
        const emailFormat = new RegExp(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
        );

        if (!alphanumeric.test(username)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError(
                "400",
                "Username can only contain alphanumeric characters."
            );
            return;
        }

        if (!emailFormat.test(email)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Invalid Email.");
            return;
        }

        if (username.trim().length < 4) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Username must be at least 4 characters.");
            return;
        }
    });

    passwordEditForm.submit((event) => {
        var currentPassword = currentPasswordInput.val(),
            newPassword = newPasswordInput.val(),
            newPasswordConfirmation = newPasswordConfirmationInput.val();

        if (!currentPassword || !newPassword || !newPasswordConfirmation) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }

        if (newPassword.length < 6 || newPassword.includes(" ")) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError(
                "400",
                "Password must be at least 6 characters, with no spaces."
            );
            return;
        }

        if (newPassword !== newPasswordConfirmation) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Passwords do not match");
            return;
        }

        //check that old password is correct
    });

    signUpForm.submit((event) => {
        var username = usernameInput.val(),
            name = nameInput.val(),
            email = emailInput.val(),
            password = passwordInput.val(),
            passwordConfirmation = passwordConfirmationInput.val(),
            bio = bioInput.val(),
            universityId = universityInput.val();
        //imageURL = profileImageInput.val();

        if (
            !username ||
            !name ||
            !email ||
            !bio ||
            !password ||
            !passwordConfirmation ||
            !universityId
        ) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }
        const alphanumeric = new RegExp(/^[a-z0-9]+$/i);
        const emailFormat = new RegExp(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
        );

        if (!alphanumeric.test(username)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError(
                "400",
                "Username can only contain alphanumeric characters."
            );
            return;
        }

        if (!emailFormat.test(email)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Invalid email address.");
            return;
        }

        if (username.trim().length < 4) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Username must be at least 4 characters.");
            return;
        }

        if (password.length < 6 || password.includes(" ")) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError(
                "400",
                "Password must be at least 6 characters, with no spaces."
            );
            return;
        }

        if (password !== passwordConfirmation) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Passwords do not match");
            return;
        }
    });

    loginForm.submit((event) => {
        var username = usernameInput.val(),
            password = passwordInput.val(),
            universityId = universityInput.val();

        if (!username || !password || !universityId) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }
        const alphanumeric = new RegExp(/^[a-z0-9]+$/i);

        if (!alphanumeric.test(username)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError(
                "400",
                "Username can only contain alphanumeric characters"
            );
            return;
        }

        if (username.trim().length < 4) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Username must be at least 4 characters.");
            return;
        }

        if (password.length < 6 || password.includes(" ")) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError(
                "400",
                "Password must be at least 6 characters, with no spaces."
            );
            return;
        }
    });

    editUniversityForm.submit((event) => {
        var name = nameInput.val(),
            emailDomain = emailDomainInput.val();

        if (!name || !emailDomain) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }

        let emailRegex = new RegExp(
            "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
        );

        if (!emailRegex.test(emailDomain)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Invalid email domain");
            return;
        }
    });

    updateItemForm.submit((event) => {
        var title = titleInput.val(),
            description = descriptionInput.val(),
            keywords = keywordsInput.val(),
            price = priceInput.val(),
            pickUpMethod = pickUpMethodInput.val(),
            sold = soldInput.val();

        if (
            !title ||
            !description ||
            !keywords ||
            !price ||
            !pickUpMethod ||
            !sold
        ) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }

        if (parseInt(price) === NaN) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Price must be a number");
            return;
        }
    });

    newUniversityForm.submit((event) => {
        var name = nameInput.val(),
            emailDomain = emailDomainInput.val();

        if (!name || !emailDomain) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }

        let emailRegex = new RegExp(
            "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
        );

        if (!emailRegex.test(emailDomain)) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Invalid email domain");
            return;
        }
    });

    newItemForm.submit((event) => {
        var title = titleInput.val(),
            description = descriptionInput.val(),
            keywords = keywordsInput.val(),
            price = priceInput.val(),
            pickUpMethod = pickUpMethodInput.val(),
            sold = soldInput.val();

        if (
            !title ||
            !description ||
            !keywords ||
            !price ||
            !pickUpMethod ||
            !sold
        ) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }

        if (parseInt(price) === NaN) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Price must be a number");
            return;
        }
    });

    newRatingForm.submit((event) => {
        var rating = ratingInput.val();
        if (!rating) {
            event.preventDefault();
            //throw error on screen for user to see
            handleError("400", "Missing required fields");
            return;
        }
    });

    function showCommentError(message) {
        commentInput.val("");
        commentAlert.empty();
        commentAlert.append(message);
        commentAlert.removeAttr("hidden");
    }

    function hideCommentError() {
        commentAlert.attr("hidden", true);
    }

    function showBidError(message) {
        bidInput.val("");
        bidAlert.empty();
        bidAlert.append(message);
        bidAlert.removeAttr("hidden");
    }

    function hideBidError() {
        bidAlert.attr("hidden", true);
    }

    function handleError(status, message) {
        errorStatus.empty();
        errorMessage.empty();
        errorStatus.append(status);
        errorMessage.append(message);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})(window.jQuery);
