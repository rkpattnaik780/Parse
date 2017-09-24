$(document).ready(function () {
    /****************************************
     ****** INITIALIZE THE PARSE SERVER *****
     ****************************************/

    Parse.initialize("O6sEjAj5DfCQMpch2EIv8ofT39AoLQcy3bUpB83C", "TMaH6aab2aKbhXly8QZuJvMisyGhcKx7ATaK0B2v");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    /* ************************************ */

    /************************************* */
    /*******  GLOBAL VARIABLES  ************/
    /***************************************/

    var teacher = [];
    var subject = [];
    var currentPeriod = 1;
   // var daysPlanned = [];
   

    /**** SHOW THE PERIOD ON LOAD********* */

    $("#period").val(currentPeriod);

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
     * DEFINE THE StudentTimetable CLASS  ***
     ****************************************/

    class StudentTimetable extends Parse.Object {
        constructor() {
            super("StudentTimetable");
        }
        static setAttributes(teacher, section, standard, subject, day) {
            var studentTimetable = new StudentTimetable();
            studentTimetable.set('schoolId', currentUser.attributes.schoolId); // To be changed later .
            studentTimetable.set('teacher', teacher);
            studentTimetable.set("section", section);
            studentTimetable.set("subject", subject);
            studentTimetable.set("class", Number(standard));
            studentTimetable.set("day", day);

            return studentTimetable;
        }
    }

    /********************************************************* */

    /*****************  ON CLICK EVENTS ************************/

    $("#submit").click(function () {

        var standard = $("#std").val();
        var section = $("#section").val();
        var day = $("#day").val();

        if(!(standard && section)){
            alert("All fields are compulsary");
        }else if( teacher.length === 0){
            alert("No timetable set for the day");
        }else{
            saveToCloud(teacher, section, standard, subject, day);
        }

        

    });

    $("#add_day").click(function () {

        var t = $("#teacher").val();
        var s = $("#subject").val();

        if (t && s) {
            addToTheDay(t, s);
            clearTheLowerForm();
        } else {
            alert("All fields are compulsary");
            clearTheLowerForm();
        }

    });

    /**************** CLEAR BUTTONS ************************** */

    $("#clear_form").click(function () {
        clearTheLowerForm();
    });

    $("#clrform").click(function () {
        clearTheUpperForm();
    });

    $("#clear_day").click(function () {
        clearTheDay();
    });

    /************** GLOBAL FUNCTIONS ************************* */

    function saveToCloud(teacher, section, standard, subject, day) {

        var newStudentTimetable = StudentTimetable.setAttributes(teacher, section, standard, subject, day);

        newStudentTimetable.save(null, {
            success: function (newStudentTimetable) {
                alert("StudentTimetable record added");
                clearTheUpperForm();
                clearTheLowerForm();
                clearTheDay();
                loadTheDaysDropDown();
                currentPeriod = 1 ;
                $("#period").val(currentPeriod);
            },
            error: function (newStudentTimetable, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    }

    function clearTheDay() {

        teacher = [];
        subject = [];
        currentPeriod = 1;
        showTheTimeTableForDay();

    }

    function clearTheLowerForm() {
        $("#subject").val("");
        $("#teacher").val("");

    }

    function clearTheUpperForm() {
        $("#std").val("1");
        $("#section").val("A");
    }

    /****************** SHOW THE TIMETABLE FOR THE DAY *****************/

    function showTheTimeTableForDay() {

        $("#timetable").html("");

        for (var i = 0; i < subject.length; i++) {
            var temp = "<tr><td>" + (i + 1) + "</td><td>" + subject[i] + "</td><td>" +
                teacher[i] + "</td></tr>";
            $("#timetable").append(temp);
        }
    }

    /************ TO ADD TO THE TIMETABLE FOR PARTICULAR DAY ******/

    function addToTheDay(t, s) {

        teacher.push(t);
        subject.push(s);
        $("#period").val(++currentPeriod);
        showTheTimeTableForDay();

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