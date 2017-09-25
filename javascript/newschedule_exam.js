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

    /************************************* */
    /*******  GLOBAL VARIABLES  ************/
    /***************************************/

    var maxMarksList = [];
    var dateList = [];
    var subjectList = [];

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
     ****** DEFINE THE EXAM CLASS  **********
     ****************************************/

    class ExamSchedule extends Parse.Object {
        constructor() {
            super('ExamSchedule');
        }
        static setAttributes(examname, standard, timing, subjectList, dateList, maxMarksList) {
            var examSchedule = new ExamSchedule();
            examSchedule.set('schoolId', currentUser.attributes.schoolId); // To be changed later .
            examSchedule.set('name', examname);
            examSchedule.set("timing", timing);
            examSchedule.set("subjectList", subjectList);
            examSchedule.set("class", Number(standard));
            examSchedule.set("dateList", dateList);
            examSchedule.set("maxMarks", maxMarksList);

            return examSchedule;
        }
    }

    /***************************************************************************** */

    /*********************** SUBMIT THE FORM  **************************************/

    $("#submit").click(function () {

        var examname = $("#ex_name").val();
        var standard = $("#std").val();
        var timing = $("#timing").val();

        if (!(examname && standard && timing)) {
            alert("All fields are required");
            clearTheInnerForm();
            clearExamDetails();
        } else if (maxMarksList.length === 0) {
            alert("Complete exam detail not uploaded");
            clearTheInnerForm();
        } else {
            alert("Success"); 
            saveToCloud(examname, standard, timing, subjectList, dateList, maxMarksList);          
        }

    });

    /***************************************************************************** */

    /****************************** SAVING TO THE CLOUD *********************/

    function saveToCloud(examname, standard, timing, subjectList, dateList, maxMarksList) {

        var newExamSchedule = ExamSchedule.setAttributes(examname, standard, timing, subjectList, dateList, maxMarksList);

        newExamSchedule.save(null, {
            success: function (newExamSchedule) {
                alert("ExamSchedule record added");
                clearExamDetails();
                clearTheArrays();
                clearTheInnerForm();
                renderTheArrays();
                location.reload();

            },
            error: function (newExamSchedule, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    /******************APPENDING TO THE LISTS  *************************************/

    $("#add_exam").click(function () {
        var newDate = $("#date").val();
        var subject = $("#subject").val();
        var maxMarks = $("#maxmarks").val();
        if (!(newDate && subject && maxMarks)) {
            alert("All fields are compulsary");
        } else {
            maxMarksList.push(maxMarks);
            subjectList.push(subject);
            dateList.push(newDate);
            renderTheArrays();
        }

        clearTheInnerForm();
    });

    /***************************************************************************** */

    /****************** CLEAR THE INNER FORM ***************************************/

    $("#clear_exam").click(function () {

        clearTheInnerForm();

    });

    /***************************************************************************** */

    /****************** CLEARING THE TABLE FORM ************************************/

    function clearTheInnerForm() {

        $("#date").val("");
        $("#subject").val("");
        $("#maxmarks").val("");

    }

    /***************************************************************************** */

    /****************** APPEND TO THE BOTTOM OF TABLE ******************************/

    function renderTheArrays() {
        $("#list").html("");
        //var temp = "<tr><td>" + newDate + "</td><td>" + subject + "</td><td>" + maxMarks + "</td><td>A</td></tr>" ;
        for (var i = 0; i < dateList.length; i++) {
            var temp = "<tr><td>" + dateList[i] + "</td><td>" + subjectList[i] + "</td><td>" + maxMarksList[i] + "</td></tr>";
            $("#list").append(temp);
        }
    }

    /***************************************************************************** */

    /******************   CLEAR THE LIST  ******************************************/

    $("#clear_arr").click(function () {
        clearTheArrays();
        renderTheArrays();
    });

    /***************************************************************************** */

    /*********************  CLEAR THE ARRAYS FUNCTION****************************** */

    function clearTheArrays() {
        maxMarksList = [];
        dateList = [];
        subjectList = [];
    }

    /*********************  CLEAR THE EXAM DETAILS    **************************** */

    $("#clrform").click(function () {
       clearExamDetails();
    });

    /************** CLEAR THE EXAM DETAILS FUNCTION ****************************** */
    function clearExamDetails() {
        $("#ex_name").val("");
        $("#std").val("1");
        $("#timing").val("");
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