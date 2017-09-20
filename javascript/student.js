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
     ****** DEFINE THE STUDENT CLASS  *******
     ****************************************/

    class Student extends Parse.Object {
        constructor() {
            super('Student');
        }
        static setAttributes(schoolCode, name, email, registrationNo, contactNo, standard, section) {
            var student = new Student();
            student.set('schoolCode', schoolCode);
            student.set('name', name);
            student.set("email", email);
            student.set("registrationNo", registrationNo);
            student.set("contactNo", contactNo);
            student.set("standard", standard);
            student.set("section", section);

            return student;
        }
    }

    /***************************************************************************** */

    /***************************************************************************** */
    /********************** GET CURRENT SESSION TOKEN **************************** */
    /***************************************************************************** */

    var current = Parse.Session.current().then(session => {
        currentSession = session.attributes.sessionToken;
    });


    $("#submit").click(function () {
        var schoolCode = $("#scode").val();
        var name = $("#name").val();
        var email = $("#email").val();
        var registrationNo = Number($("#regno").val());
        var contactNo = Number($("#contact").val());
        var standard = $("#std").val();
        var section = $("#section").val();

        /* Check if all the input forms are correctly filled !!   */
        if (schoolCode && name && email && standard && section) { // if any field is empty
            if (!validateEmail(email)) {
                alert("Email ID is not valid!");
                clearAllFields();
            } else if (!/\S/.test(name)) {
                alert("Name cant be empty spaces!");
                clearAllFields();
            } else if (isNaN(registrationNo)) {
                alert("Registration No should be an integer!");
                clearAllFields();
            } else if (isNaN(contactNo)) {
                alert("Contact No should be an integer!");
                clearAllFields();
            } else if (!/\S/.test(schoolCode)) {
                alert("School Code can't be empty spaces!!");
                clearAllFields();
            } else {
                saveToCloud(schoolCode, name, email, registrationNo, contactNo, standard, section);
            }

        } else {
            alert("All fields are compulsary");
            clearAllFields();
        }
    });

    /************* FUNCTION TO CLEAR ALL THE FIELDS *********************/

    function clearAllFields() {
        $("#scode").val("");
        $("#name").val("");
        $("#email").val("");
        $("#regno").val("");
        $("#contact").val("");
        $("#std").val("I");
        $("#section").val("A")
    }

    /*********************** CHECK VALIDITY OF EMAIL ID *********************/

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /****************************** SAVING TO THE CLOUD *********************/

    function saveToCloud(schoolCode, name, email, registrationNo, contactNo, standard, section) {

        var newStudent = Student.setAttributes(schoolCode, name, email, registrationNo, contactNo, standard, section);

        newStudent.save(null, {
            success: function (newStudent) {
                alert("Student record added");

            },
            error: function (newStudent, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

        /*  **************************************************************************** 
            ***************CREATE A NEW USER AT THE TIME OF REGISTRATION****************
            **************************************************************************** */



        user.set("username", schoolCode + registrationNo);

        user.set("password", generatePassword($("#contact").val()));

        console.log(generatePassword($("#contact").val()));

        user.set("email", email);

        user.set("accountType", "student");

        user.set("contactNo", Number($("#contact").val()));

        /*  **************************************************************************** 
            *************** STORE THE REGISTERED USER TO CLOUD *************************
            **************************************************************************** */

        user.signUp(null, {
            success: function (user) {

                alert("User added");

                /*
                https://control.msg91.com/api/sendhttp.php?authkey=YourAuthKey&mobiles=9999999999&message=test & new&mobile&sender=RECESS&route=4
                
                174873AZUblpkT3Pm59bc04e1
                
                You have successfully registered fro RECESS . Your username - *** & password - ****
                */

                /*********************************************** */
                /* *********** LOGOUT   ************************ */
                /*********************************************** */

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


                /* *********** SEND MESSAGE TO THE USER  ******* */
                /*********************************************** */

                sendMessage(contactNo, schoolCode, registrationNo);

                clearAllFields();

            },
            error: function (user, error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    }

    function generatePassword(phoneNo) {
        var a = Number(phoneNo.substring(5));
        a = a * 7 + 5619;
        a = a % 999999;
        return a.toString();
    }

    function sendMessage(contactNo, schoolCode, registrationNo) {

        var message = "Your username - " + schoolCode + registrationNo + " password - " + generatePassword(contactNo.toString());
        var message = encodeURI(message);
        console.log(generatePassword(contactNo.toString()));
        var temp = "https://control.msg91.com/api/sendhttp.php?" +
            "authkey=" + "174873AZUblpkT3Pm59bc04e1" +
            "&mobiles=" + contactNo + "&message=" + message + " & new&mobile&sender=RECESS&route=4";

        $.get(temp, function (data, status) {
            console.log(data);
            alert("Data: " + data + "\nStatus: " + status);
        });

    }


    /*
    
        My Edit for active class

    */

    $("#regLink").addClass("active");
    $("#regLink1").addClass("active");

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


});