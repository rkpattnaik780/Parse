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

var class1rec = [], class2rec = [], class3rec = [], class4rec = [], class5rec = [], class6rec = [], class7rec = [];
var class8rec = [], class9rec = [], class10rec = [], class11rec = [], class12rec = [];

var app = angular.module('students', []);
app.controller('myCtrl', function ($scope) {

    $scope.selectedClass = "1";

    /********** RETRIEVE THE DATA  ********/

    var getTheData = new Parse.Query("Student");
    getTheData.equalTo("schoolId", currentUser.attributes.schoolId);

    getTheData.find({
        success: function (results) {

            $scope.$apply(function () {
                groupTheRecords(results);
                console.log($scope.selectedClass);
                console.log(results);
                $scope.list = class1rec;
                console.log($scope.list);
            });
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

    /************************************ */

    $scope.filter = function () {
        setTheProperArray();
    }

    $scope.filter = function () {
        setTheProperArray();
    }



/************************************ */

 function changeTheFilterList(t) {

        $scope.$apply(function () {
            groupTheRecords(results);
            console.log($scope.selectedClass);
            console.log(results);
            $scope.list = t;
            console.log($scope.list);
        });

    }


function setTheProperArray() {

    var t = Number($scope.selectedClass);

    switch (t) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            $scope.list = class1rec;
            break;
        case 2:
            $scope.list = class2rec;
            break;
        case 3:
            $scope.list = class3rec;
            break;
        case 4:
            $scope.list = class4rec;
            break;
        case 5:
            $scope.list = class5rec;
            break;
        case 6:
            $scope.list = class6rec;
            break;
        case 7:
            $scope.list = class7rec;
            break;
        case 8:
            $scope.list = class8rec;
            break;
        case 9:
            $scope.list = class9rec;
            break;
        case 10:
            $scope.list = class10rec;
            break;
        case 11:
            $scope.list = class11rec;
            break;
        case 12:
            $scope.list = class12rec;
            break;
    }
}



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

/**************** GLOBAL FUNCTIONS ***********************/

function groupTheRecords(results) {

    for (var i = 0; i < results.length; i++) {
        if (results[i].attributes.class === 12) {
            class12rec.push(results[i]);
        } else if (results[i].attributes.class === 11) {
            class11rec.push(results[i]);
        } else if (results[i].attributes.class === 10) {
            class10rec.push(results[i]);
        } else if (results[i].attributes.class === 9) {
            class9rec.push(results[i]);
        } else if (results[i].attributes.class === 8) {
            class8rec.push(results[i]);
        } else if (results[i].attributes.class === 7) {
            class7rec.push(results[i]);
        } else if (results[i].attributes.class === 6) {
            class6rec.push(results[i]);
        } else if (results[i].attributes.class === 5) {
            class5rec.push(results[i]);
        } else if (results[i].attributes.class === 4) {
            class4rec.push(results[i]);
        } else if (results[i].attributes.class === 3) {
            class3rec.push(results[i]);
        } else if (results[i].attributes.class === 2) {
            class2rec.push(results[i]);
        } else {
            class1rec.push(results[i]);
        }
    }
}





