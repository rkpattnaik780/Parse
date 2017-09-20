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

     /************************************* */
    /**********STORE THE SESSION  **********/
    /************************************* */

    var currentSession ;

    /************************************* */
    /*******  CHECK IF LOGGED IN  **********/
    /***************************************/

    var currentUser = Parse.User.current();
    if (!currentUser) {
        alert("You need to login!");
        location.href = "../index.html";
    }

    /************************************* */

    /* ************************************ */

    /****************************************
     ****** DEFINE THE TEACHER CLASS  *******
     ****************************************/

    class Teacher extends Parse.Object {
        constructor() {
            super('Teacher');
        }
        static setAttributes(schoolCode, name, email, contactNo, address, department, teacherID, qualifications) {
            var teacher = new Teacher();
            teacher.set('schoolCode', schoolCode);
            teacher.set('name', name);
            teacher.set("email", email);
            teacher.set("teacherID", teacherID);
            teacher.set("contactNo", contactNo);
            teacher.set("address", address);
            teacher.set("department", department);
            teacher.set("qualifications", qualifications);

            return teacher;
        }
    }

    /***************************************************************************** */
    /********************** GET CURRENT SESSION TOKEN **************************** */
    /***************************************************************************** */

    var current = Parse.Session.current().then(session => {
        currentSession = session.attributes.sessionToken ;
    });

    /***************************************************************************** */

    $("#submit").click(function () {

        var schoolCode = $("#scode").val();
        var name = $("#name").val();
        var email = $("#email").val();
        var teacherID = Number($("#trid").val());
        var contactNo = Number($("#contact").val());
        var address = $("#address").val();
        var department = $("#dept").val();
        var qualifications = $("#qftns").val();

        /************************************************************************* */
        /************ Check if all the input forms are correctly filled !! *********/
        /************************************************************************* */

        if (schoolCode && name && email && address && department) {

            if (!validateEmail(email)) {
                alert("Email ID is not valid!");
                clearAllFields();
            } else if (!/\S/.test(name)) {
                alert("Name cant be empty spaces!");
                clearAllFields();
            } else if (isNaN(teacherID)) {
                alert("Teacher ID is not in proper format");
                clearAllFields();
            } else if (isNaN(contactNo)) {
                alert("Contact No. is not in proper format");
                clearAllFields();
            } else if (!/\S/.test(address)) {
                alert("Address cant be empty spaces!");
                clearAllFields();
            } else if (!/\S/.test(department)) {
                alert("Deaprtment cant be empty spaces!");
                clearAllFields();
            } else if (!/\S/.test(qualifications)) {
                alert("Qualifications can't be empty");
                clearAllFields();
            } else {

                /******************  ALL INPUT FIELDS ARE CORRECTLY FILLED *******************/

                saveToCloud(schoolCode, name, email, contactNo, address, department, teacherID, qualifications);

                clearAllFields();
            }

        } else {
            alert("No empty field allowed!");
        }

    });

    /**************************************************************************** */
    /****************  FUNCTION TO GENERATE PASSWORD  *************************** */
    /**************************************************************************** */

    function generatePassword(phoneNo) {
        var a = Number(phoneNo.substring(5));
        a = a * 7 + 5619;
        a = a % 999999;
        return a.toString();
    }

    /**************************************************************************** */
    /****************  FUNCTION TO CLEAR THE FORM  ****************************** */
    /**************************************************************************** */

    function clearAllFields() {
        $("#scode").val("");
        $("#name").val("");
        $("#email").val("");
        $("#contact").val("");
        $("#trid").val("");
        $("#address").val("");
        $("#dept").val("");
        $("#qftns").val("");
    }

    /**************************************************************************** */
    /****************  FUNCTION TO VALIDATE EMAIL ID FORMAT  ******************** */
    /**************************************************************************** */

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**************************************************************************** */
    /****************  FUNCTION TO SAVE TO CLOUD   ****************************** */
    /**************************************************************************** */

    function saveToCloud(schoolCode, name, email, contactNo, address, department, teacherID, qualifications) {
        var newTeacher = Teacher.setAttributes(schoolCode, name, email, contactNo, address, department, teacherID, qualifications);

        newTeacher.save(null, {
            success: function (newTeacher) {
                alert("Teacher record added");

            },
            error: function (newTeacher, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

        /*  **************************************************************************** 
            ***************CREATE A NEW USER AT THE TIME OF REGISTRATION****************
            **************************************************************************** */

        user.set("username", schoolCode + teacherID);

        user.set("password", generatePassword(contactNo.toString()));

        user.set("email", email);

        user.set("contactNo",Number($("#contact").val()));

        user.set("accountType", "teacher");

        user.signUp(null, {
            success: function (user) {

                alert("User added");

                /*********************** LOGOUT   ************************ */

                var currentUser = Parse.User.current();
                alert("Successfully registered");
                Parse.User.logOut().then(function () {

                    /********* SET THE CURRENT USER ***************** */

                    Parse.User.become(currentSession).then(function (user) {
                        alert("Correct user set");
                        location.reload();
                    }, function (error) {
                        console.log(error);
                    });

                    /*********************************************** */

                });

                sendMessage(contactNo, schoolCode, teacherID);

                clearAllFields();

            },
            error: function (user, error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    }

    function sendMessage(contactNo, schoolCode, teacherID) {
        var message = "Your username - " + schoolCode + teacherID + " password - " + generatePassword(contactNo.toString());
        var message = encodeURI(message);
        var temp = "https://control.msg91.com/api/sendhttp.php?" +
            "authkey=" + "174873AZUblpkT3Pm59bc04e1" +
            "&mobiles=" + contactNo + "&message=" + message + " & new&mobile&sender=RECESS&route=4";

        $.get(temp, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
        });

    }

    /************************************* */
    /*************  LOG OUT ****************/
    /***************************************/

    $("#logout").click(function () {
        if (currentUser) {
            Parse.User.logOut().then(() => {
                location.href = "../index.html";
            });
        }
    });

    /************************************* */

    /*
    
        My Edit for active class

    */

    $("#regLink").addClass("active");
    $("#regLink2").addClass("active");


});