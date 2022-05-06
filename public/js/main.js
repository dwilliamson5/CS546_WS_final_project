(function ($) {
    var commentForm = $("#new-comment-form"),
        commentInput = $("#comment"),
        commentArea = $("#comments-list"),
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
        passwordConfirmationInput = $("#password-confirmation"),
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

    commentForm.submit((event) => {
        event.preventDefault();

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

            $.ajax(requestConfig).then((responseMessage) => {
                var newElement = $(responseMessage);
                commentArea.append(newElement);
                commentForm.trigger("reset");
            });
        }
    });

    bidForm.submit((event) => {
        event.preventDefault();

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

            $.ajax(requestConfig).then((responseMessage) => {
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
        event.preventDefault();

        var username = usernameInput.val(),
            name = nameInput.val(),
            email = emailInput.val(),
            bio = bioInput.val();
        //imageURL = profileImageInput.val();

        if (!username || !name || !email || !bio) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }
        const alphanumeric = new RegExp(/^[a-z0-9]+$/i);
        const emailFormat = new RegExp(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
        );

        if (!alphanumeric.test(username)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append(
                "Username can only contain alphanumeric characters."
            );
            return;
        }

        if (!emailFormat.test(email)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Invalid Email.");
            return;
        }

        if (username.trim().length < 4) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Username must be at least 4 characters.");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: profileInfoForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                name: name,
                email: email,
                bio: bio,
                //imageURL: imageURL,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            profileInfoForm.trigger("reset");
        });
    });

    passwordEditForm.submit((event) => {
        event.preventDefault();

        var currentPassword = currentPasswordInput.val(),
            newPassword = newPasswordInput.val(),
            newPasswordConfirmation = newPasswordConfirmationInput.val();

        if (!currentPassword || !newPassword || !newPasswordConfirmation) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }

        if (newPassword.length < 6 || newPassword.contains(" ")) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append(
                "Password must be at least 6 characters, with no spaces."
            );
            return;
        }

        if (newPassword !== newPasswordConfirmation) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Passwords do not match");
            return;
        }

        //check that old password is correct

        var requestConfig = {
            method: "POST",
            url: passwordEditForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            passwordEditForm.trigger("reset");
        });
    });

    signUpForm.submit((event) => {
        event.preventDefault();

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
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }
        const alphanumeric = new RegExp(/^[a-z0-9]+$/i);
        const emailFormat = new RegExp(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
        );

        if (!alphanumeric.test(username)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append(
                "Username can only contain alphanumeric characters."
            );
            return;
        }

        if (!emailFormat.test(email)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Invalid email address.");
            return;
        }

        if (username.trim().length < 4) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Username must be at least 4 characters.");
            return;
        }

        if (password.length < 6 || password.contains(" ")) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append(
                "Password must be at least 6 characters, with no spaces."
            );
            return;
        }

        if (password !== passwordConfirmation) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Passwords do not match");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: signUpForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                name: name,
                email: email,
                password: password,
                bio: bio,
                universityId: universityId,
                //imageURL: imageURL,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            signUpForm.trigger("reset");
        });
    });

    loginForm.submit((event) => {
        event.preventDefault();

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
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }
        const alphanumeric = new RegExp(/^[a-z0-9]+$/i);
        const emailFormat = new RegExp(
            "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
        );

        if (!alphanumeric.test(username)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append(
                "Username can only contain alphanumeric characters"
            );
            return;
        }

        if (!emailFormat.test(email)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Invalid email address");
            return;
        }

        if (username.trim().length < 4) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Username must be at least 4 characters.");
            return;
        }

        if (password.length < 6 || password.contains(" ")) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append(
                "Password must be at least 6 characters, with no spaces."
            );
            return;
        }

        if (password !== passwordConfirmation) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Passwords do not match");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: loginForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                name: name,
                email: email,
                password: password,
                bio: bio,
                universityId: universityId,
                //imageURL: imageURL,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            loginForm.trigger("reset");
        });
    });

    editUniversityForm.submit((event) => {
        event.preventDefault();

        var name = nameInput.val(),
            emailDomain = emailDomainInput.val();

        if (!name || !emailDomain) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }

        let emailRegex = new RegExp(
            "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
        );

        if (!emailRegex.test(emailDomain)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Invalid email domain");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: editUniversityForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                emailDomain: emailDomain,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            editUniversityForm.trigger("reset");
        });
    });

    updateItemForm.submit((event) => {
        event.preventDefault();

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
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }

        if (parseInt(price) === NaN) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Price must be a number");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: updateItem.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                title: title,
                description: description,
                keywords: keywords,
                price: price,
                pickUpMethod: pickUpMethod,
                sold: sold,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            updateItemForm.trigger("reset");
        });
    });

    newUniversityForm.submit((event) => {
        event.preventDefault();

        var name = nameInput.val(),
            emailDomain = emailDomainInput.val();

        if (!name || !emailDomain) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }

        let emailRegex = new RegExp(
            "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:[A-Z]{2}|edu)\\b"
        );

        if (!emailRegex.test(emailDomain)) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Invalid email domain");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: editUniversityForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                emailDomain: emailDomain,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            editUniversityForm.trigger("reset");
        });
    });

    newItemForm.submit((event) => {
        event.preventDefault();

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
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }

        if (parseInt(price) === NaN) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Price must be a number");
            return;
        }

        var requestConfig = {
            method: "POST",
            url: updateItem.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                title: title,
                description: description,
                keywords: keywords,
                price: price,
                pickUpMethod: pickUpMethod,
                sold: sold,
            }),
        };

        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            newItemForm.trigger("reset");
        });
    });

    newRatingForm.submit((event) => {
        event.preventDefault();
        var rating = ratingInput.val();
        if (!rating) {
            //throw error on screen for user to see
            errorStatus.append("400");
            errorMessage.append("Missing required fields");
            return;
        }
        var requestConfig = {
            method: "POST",
            url: newRatingForm.attr("action"),
            contentType: "application/json",
            data: JSON.stringify({
                rating: rating,
            }),
        };
        $.ajax(requestConfig).then((responseMessage) => {
            var newElement = $(responseMessage);
            //I don't think there's any visual update to the form here, but it would make sense to add one so this can be a TODO
            newRatingForm.trigger("reset");
        });
    });
})(window.jQuery);
