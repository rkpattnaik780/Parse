$(document).ready(function () {
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

    /************************************* */

    /****************************************
     ** DEFINE THE SchoolHoliday CLASS  *****
     ****************************************/

    class SchoolHoliday extends Parse.Object {
        constructor() {
            super("SchoolHoliday");
        }
    }

    /************************************* */

    /****************************************
     ******* DEFINE THE Notice CLASS  ********
     ****************************************/

    class Notice extends Parse.Object {
        constructor() {
            super("Notice");
        }
        static setAttributes(title, content) {
            var notice = new Notice();
            notice.set('schoolId', currentUser.attributes.schoolId);
            notice.set('subject', title);
            notice.set("content", content);
            notice.set("attachment", null);

            return notice;
        }
    }

    /**************************************** */

    /*********  GLOBAL VARIABLES  *************/

    var title;
    var month;
    var dateTo;
    var dateFrom;

    /********** SUBMIT BUTTON  ****************/

    $("#submit").click(function () {

        title = $("#title").val();
        month = $("#month").val();
        dateTo = Math.floor(Number($("#to").val()));
        dateFrom = Math.floor(Number($("#from").val()));
        var content = $("#content").val();

        if (!content) {
            content = "A holiday from " + dateFrom + " to " + dateTo + " in the month " + month + " due to " + title + ".";
        }

        if (title) {

            if (isNaN(dateFrom) || isNaN(dateTo)) {
                alert("Dates should be integers");
                clearTheForm();
            } else if (dateTo < dateFrom) {
                alert("From should come before the to date");
                clearTheForm();
            } else {
                getObjectByMonth(month);
                saveToCloud(title,content);
            }

        } else {
            alert("Fields are compulsary");
            clearTheForm();
        }



    });

    /****************** CLEAR BUTTON **********/

    $("#clear").click(function () {
        clearTheForm();
    });

    /**************  GLOBAL FUNCTIONS *********/

    function saveToCloud(title, content) {

        var newNotice = Notice.setAttributes(title, content);

        newNotice.save(null, {
            success: function (newNotice) {
                alert("Notice record added");
                clearTheForm();

            },
            error: function (newNotice, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    }

    function getObjectByMonth(month) {

        var getTheObj = new Parse.Query("SchoolHoliday");
        getTheObj.equalTo("schoolId", currentUser.attributes.schoolId);
        getTheObj.equalTo("month", month);

        getTheObj.find({
            success: function (results) {
                updateHolidayObject(results[0]);
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    function updateHolidayObject(obj) {

        for (var i = dateFrom; i <= dateTo; i++) {

            obj.addUnique("dates", i);
        }
        console.log(obj);

        obj.save(null, {
            success: function (obj) {
               alert("Dates added");
               clearTheForm();
            },
            error: function (obj, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
        console.log("Successful");

    }

    /***********   CLEAR THE FORM  ****************/

    function clearTheForm() {
        $("#title").val("");
        $("#content").val("");
        $("#month").val("January");
        $("#from").val("");
        $("#to").val("");
    }


    /************************************* */
    /*************  LOG OUT ****************/
    /***************************************/

    $("#logout").click(function () {
        if (currentUser) {
            Parse.User.logOut().then(() => {
                location.href = "../index.html" ;
            });
        }
    });

    /************************************* */

});