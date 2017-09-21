$(document).ready(function () {
    /****************************************
     ****** INITIALIZE THE PARSE SERVER *****
     ****************************************/

    Parse.initialize("O6sEjAj5DfCQMpch2EIv8ofT39AoLQcy3bUpB83C", "TMaH6aab2aKbhXly8QZuJvMisyGhcKx7ATaK0B2v");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    /* ************************************ */

    /****************************************
     **** INITIALIZE THE USER OBJECT  *******
     ***************************************/

    var user = new Parse.User();

    /* ************************************ */

    /************************************* */
    /**********STORE THE SESSION  **********/
    /************************************* */

    var currentSession;

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
        static setAttributes(examname, standard, timing, subjectList, dateList, maxMarksList) {
            var studentTimetable = new StudentTimetable();
            studentTimetable.set('schoolCode', currentUser.attributes.schoolID); // To be changed later .
            studentTimetable.set('teacher', teacher);
            studentTimetable.set("section", section);
            studentTimetable.set("subject", subject);
            studentTimetable.set("standard", standard);
            studentTimetable.set("day", day);

            return studentTimetable;
        }
    }

    /********************************************************* */

    /************** GLOBAL FUNCTIONS ************************* */

    function clearTheDay(){

    }

    function clearTheEntireForm(){
        
    }


});