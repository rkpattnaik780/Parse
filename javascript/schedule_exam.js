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

    var maxMarksList = [];
    var dateList = [] ;
    var subjectList = [] ;

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
            examSchedule.set('schoolCode', "1000"); // To be changed later .
            examSchedule.set('name', examname);
            examSchedule.set("timing", timing);
            examSchedule.set("subjectList", subjectList);
            examSchedule.set("standard", standard);
            examSchedule.set("dateList", dateList);
            examSchedule.set("maxMarksList", maxMarksList);

            return examSchedule;
        }
    }

    /***************************************************************************** */

    /******************APPENDING TO THE LISTS  *************************************/

    $("#add_exam").click(function(){
        var newDate = $("#date").val();
        var subject = $("#subject").val();
        var maxMarks = $("#maxmarks").val();
        if(!(newDate && subject && maxMarks)){
            alert("All fields are compulsary");
        }else{
            maxMarksList.push(maxMarks);
            subjectList.push(subject);
            dateList.push(newDate);
            appendToBottom(newDate , subject , maxMarks);
        }
        console.log({"marks" : maxMarksList, "subjects" : subjectList , "dateList" : dateList});
        clearTheInnerForm();
    });

    /***************************************************************************** */

    /****************** CLEAR THE INNER FORM ***************************************/

    $("#clear_exam").click(function(){

        clearTheInnerForm();

    });

    /***************************************************************************** */

    /****************** CLEARING THE TABLE FORM ************************************/

    function clearTheInnerForm(){

        $("#date").val("");
        $("#subject").val("");
        $("#maxmarks").val("");

    }

    /***************************************************************************** */

    /****************** APPEND TO THE BOTTOM OF TABLE ******************************/

    function appendToBottom(newDate , subject , maxMarks){
       // var temp = "<tr><td>" + newDate + "</td><td>" + subject + "</td><td>" + maxMarks + "</td></tr>" ;
      var temp = "<tr><td>" + newDate + "</td><td>" + subject + "</td><td>" + maxMarks + "</td><td>A</td></tr>" ;

      //  var temp = "<tr><td>" + "newDate" + "</td><td>" + "subject" + "</td><td>" + "maxMarks" + "</td><td>A</td></tr>" ;
        $("#list").append(temp);
    }

    /***************************************************************************** */

});