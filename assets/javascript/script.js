var config = {
    apiKey: "AIzaSyCMyhuh9wKfwzvQdIMdmfBglfSGgVM5uKc",
    authDomain: "loydsdb.firebaseapp.com",
    databaseURL: "https://loydsdb.firebaseio.com",
    projectId: "loydsdb",
    storageBucket: "loydsdb.appspot.com",
    messagingSenderId: "751193456581"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#submit-button").on("click", function() {
	event.preventDefault();
	var trainNameInput   = $("#trainName").val().trim();
	var destinationInput = $("#destination").val().trim();
    var firstTrainTimeInput = $("#firstTrain").val().trim();
	var frequencyInput   = $("#frequency").val().trim();

	database.ref().push({
		trainName:      trainNameInput,
		destination:    destinationInput,
        firstTrainTime: firstTrainTimeInput,
		frequency:      frequencyInput
    });
});

database.ref().orderByChild("dateAdded").limitToLast(10000).on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(sv.firstTrainTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % sv.frequency;

    // Minute Until Train
    var tMinutesTillTrain = sv.frequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");

    $("#trainNameDisplay").append("<br>" + sv.trainName);
    $("#destinationDisplay").append("<br>" + sv.destination);
    $("#frequencyDisplay").append("<br>" + sv.frequency);
    $("#nextArrivalDisplay").append("<br>" + nextTrain);
    $("#minutesAwayDisplay").append("<br>" + tMinutesTillTrain);
    // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code); 
});


