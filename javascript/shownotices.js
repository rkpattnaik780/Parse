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

var app = angular.module('notices', []);
app.controller('myCtrl', function ($scope) {

     /********** RETRIEVE THE DATA  ********/

    var getTheData = new Parse.Query("Notice");
    getTheData.equalTo("schoolId", currentUser.attributes.schoolId);

    getTheData.find({
        success: function (results) {

            console.log(results);

            $scope.$apply(function () {

                $scope.list = results;
            });
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

    /************************************* */
    /************************************* */
    /*************  LOG OUT ****************/
    /***************************************/
    
    $scope.logOut = function () {
        if (currentUser) {
            Parse.User.logOut().then(() => {
                location.href = "../index.html";
            });
        }
    };

});
