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

    var subject = [];
    var section = [];
    var standard = [];

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
     * DEFINE THE teacherTimetable CLASS  ***
     ****************************************/

    class TeacherTimetable extends Parse.Object {
        constructor() {
            super("TeacherTimetable");
        }
        static setAttributes(teacherId, section, standard, subject, day) {
            var teacherTimetable = new TeacherTimetable();
            teacherTimetable.set('schoolCode', currentUser.attributes.schoolID); // To be changed later .
            teacherTimetable.set('teacherId', teacherId);
            teacherTimetable.set("section", section);
            teacherTimetable.set("subject", subject);
            teacherTimetable.set("standard", standard);
            teacherTimetable.set("day", day);

            return teacherTimetable;
        }
    }

    /********************************************************* */

    /*****************  ON CLICK EVENTS ************************/

    $("#submit").click(function(){

        var teacherId = $("#tr_id").val();
        var day = $("#day").val();

        if(!(teacherId && day)){
            alert("All fields are compulsary");
        }else if(subject.length === 0){
            alert("No timetable has been generated");
        }else{
            saveToCloud(teacherId, section, standard, subject, day);
        }
    });

    $("#add_day").click(function () {
        if ($("#subject").val()) {
            subject.push($("#subject").val());
            standard.push($("#std").val());
            section.push($("#section").val());
            loadTheTimeTable();
        }

        else {
            alert("All fields are compulsary");
        }

        clearTheLowerForm();
    });

    /************  CLEAR BUTTONS  ******************************/

    $("#clrform").click(function () {
        clearTheUpperForm();
    });

    $("#clear_form").click(function () {
        clearTheLowerForm();
    });

    $("#clear_day").click(function () {
        clearTheArrays();
        loadTheTimeTable();
        clearTheLowerForm();
    });

    /********************   GLOBAL FUNCTIONS   *****************/

    function saveToCloud(teacherId, section, standard, subject, day) {

        var newTeacherTimetable = TeacherTimetable.setAttributes(teacherId, section, standard, subject, day);

        newTeacherTimetable.save(null, {
            success: function (newTeacherTimetable) {
                alert("TeacherTimetable record added");
                clearTheUpperForm();
                clearTheLowerForm();
                clearTheArrays();
                loadTheTimeTable();
            },
            error: function (newTeacherTimetable, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    }

    /****** LOAD THE TIMETABLE  *******/

    function loadTheTimeTable() {

        $("#timetable").html("");

        for (var i = 0; i < subject.length; i++) {
            var temp = "<tr><td>" + standard[i] + "</td><td>" + section[i] + "</td><td>" +
                subject[i] + "</td></tr>";
            $("#timetable").append(temp);
        }
    }

    function clearTheUpperForm() {
        $("#tr_id").val("");
        $("#day").val("Monday");
    }

    function clearTheLowerForm() {

        $("#std").val("I");
        $("#section").val("A");
        $("#subject").val("");

    }

    function clearTheArrays() {
        subject = [];
        standard = [];
        section = [];
    }
});