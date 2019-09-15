// Get references to page elements
let $responseText = $("#response-text");
let $submitBtn = $("#submit");
let $responseList = $("#response-list");
var $questionId = $("#question-id");


// regex validate helper function, no empty strings 
function validate(element) {
    let regex = /^(?!\s*$)[a-zA-Z.+\s'-]+$/;
    if (regex.test(element)) {
        return true;
    } else {
        return false;
    }
}
// The API object contains methods for each kind of request we'll make
let API = {

    postResponse: function(response) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "../api/responses",
            data: JSON.stringify(response)
        });
    },

    getResponses: function() {
        return $.ajax({
            url: "../api/responses",
            type: "GET"
        });
    },

    deleteResponse: function(id) {
        return $.ajax({
            url: "../api/responses/" + id,
            type: "DELETE"
        });
    },

    editQuestion: function(id) {
        return $.ajax({
            url: "api/questions/" + id,
            type: "UPDATE"
        });
    }
};

// repopulate list
let refreshResponses = function() {
    API.getResponses().then(function(data) {
        let $responses = data.map(function(response) {
            console.log('getting responses, supposedly');
            let $a = $("<a>")
                .text(response.body)
                .attr("href", "/responses/" + response.id);

            let $li = $("<li>")
                .attr({
                    class: "list-group-item",
                    "data-id": response.id
                })
                .append($a);

            var $button = $("<button>")
                .addClass("btn btn-danger float-right delete")
                .text("ｘ");

            $li.append($button);

            return $li;
        });

        $responseList.empty();
        $responseList.append($responses);
    });
};
// run refresh responses, which gets all responses, on page load... run it again later after a delete
refreshResponses();

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
let handleFormSubmit = function(event) {
    event.preventDefault();
    console.log('submit form fired');


    var newResponse = {
        body: $("#response-text").val().trim(),
        questionId: $questionId.attr("data-id")
    };
    console.log(`new response is ${newResponse.body}`);
    // eventually, validate input here with same rules as validation in the DB. If true, then send ajax post, if false, then throw up an alert
    Object.keys(newResponse.body).forEach(element =>
        console.log(validate(newResponse[element]))
    );

    if (!(newResponse.body)) {
        alert("You must enter some text!");
        return;
    }

    // make the post!
    API.postResponse(newResponse).then(function() {
        refreshResponses();
    });

    // clear the form fields in the view!
    $responseText.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
    var idToDelete = $(this)
        .parent()
        .attr("data-id");

    API.deleteResponse(idToDelete).then(function() {
        refreshResponses();
    });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$responseList.on("click", ".delete", handleDeleteBtnClick);