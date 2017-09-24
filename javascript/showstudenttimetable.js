/****************************************
 ****** INITIALIZE THE PARSE SERVER *****
 ****************************************/

Parse.initialize("O6sEjAj5DfCQMpch2EIv8ofT39AoLQcy3bUpB83C", "TMaH6aab2aKbhXly8QZuJvMisyGhcKx7ATaK0B2v");
Parse.serverURL = 'https://parseapi.back4app.com/';

/* ************************************ */

/************************************* */
/*******  CHECK IF LOGGED IN  **********/
/***************************************/

var currentUser = Parse.User.current();
if (!currentUser) {
    alert("You need to login!");
    location.href = "../index.html";
}

/************************************ */

/*********** GLOBAL VARIABLES *********/

var timetables;
var class1table = [], class2table = [], class3table = [], class4table = [], class5table = [], class6table = [], class7table = [];
var class8table = [], class9table = [], class10table = [], class11table = [], class12table = [];


var app = angular.module('studentTimeTable', []);
app.controller('stabCtrl', function ($scope) {

    $scope.selectedClass = "1";

    /********** RETRIEVE THE DATA  ********/

    var getTheData = new Parse.Query("StudentTimetable");
    getTheData.equalTo("schoolId", currentUser.attributes.schoolId);

    getTheData.find({
        success: function (results) {

            $scope.$apply(function () {
                groupThetables(results);
                $scope.list = class1table;
                console.log($scope.list);
            });
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

    /********************** */

    $scope.filter = function () {
        setTheProperArray();
    }

    function setTheProperArray() {

        var t = Number($scope.selectedClass);

        switch (t) {
            case 0:
                day = "Sunday";
                break;
            case 1:
                $scope.list = class1table;
                break;
            case 2:
                $scope.list = class2table;
                break;
            case 3:
                $scope.list = class3table;
                break;
            case 4:
                $scope.list = class4table;
                break;
            case 5:
                $scope.list = class5table;
                break;
            case 6:
                $scope.list = class6table;
                break;
            case 7:
                $scope.list = class7table;
                break;
            case 8:
                $scope.list = class8table;
                break;
            case 9:
                $scope.list = class9table;
                break;
            case 10:
                $scope.list = class10table;
                break;
            case 11:
                $scope.list = class11table;
                break;
            case 12:
                $scope.list = class12table;
                break;
        }
    }

});




/**************** GLOBAL FUNCTIONS ***********************/

function groupThetables(results) {

    for (var i = 0; i < results.length; i++) {
        if (results[i].attributes.class === 12) {
            class12table.push(results[i]);
        } else if (results[i].attributes.class === 11) {
            class11table.push(results[i]);
        } else if (results[i].attributes.class === 10) {
            class10table.push(results[i]);
        } else if (results[i].attributes.class === 9) {
            class9table.push(results[i]);
        } else if (results[i].attributes.class === 8) {
            class8table.push(results[i]);
        } else if (results[i].attributes.class === 7) {
            class7table.push(results[i]);
        } else if (results[i].attributes.class === 6) {
            class6table.push(results[i]);
        } else if (results[i].attributes.class === 5) {
            class5table.push(results[i]);
        } else if (results[i].attributes.class === 4) {
            class4table.push(results[i]);
        } else if (results[i].attributes.class === 3) {
            class3table.push(results[i]);
        } else if (results[i].attributes.class === 2) {
            class2table.push(results[i]);
        } else {
            class1table.push(results[i]);
        }
    }
}