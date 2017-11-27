  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBrUpwsxEuYhvY-LPd4eloIirVBm3sjFmY",
    authDomain: "loydsdb-e99c8.firebaseapp.com",
    databaseURL: "https://loydsdb-e99c8.firebaseio.com",
    projectId: "loydsdb-e99c8",
    storageBucket: "loydsdb-e99c8.appspot.com",
    messagingSenderId: "825679351821"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#submit-button").on("click", function() {
	event.preventDefault();
	var trainNameInput      = $("#trainName").val().trim();
	var destinationInput    = $("#destination").val().trim();
    var firstTrainTimeInput = $("#firstTrain").val().trim();
	var frequencyInput      = $("#frequency").val().trim();

	database.ref().push({
		trainName:      trainNameInput,
		destination:    destinationInput,
        firstTrainTime: firstTrainTimeInput,
		frequency:      frequencyInput,
        dateAdded:      firebase.database.ServerValue.TIMESTAMP
    });

    console.log(firebase.database.ServerValue.TIMESTAMP);
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


