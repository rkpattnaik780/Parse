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
    var email;

    /************************************* */
    /*******  CHECK IF LOGGED IN  **********/
    /***************************************/

    var currentUser = Parse.User.current();
    console.log(currentUser);
    if (!currentUser) {
        alert("You need to login!");
        location.href = "../index.html";
    }

    /************************************* */

    /*** GET THE CURRENT SESSION ***********/

    var currentSession = currentUser.attributes.sessionToken;
    console.log(currentSession);
    /* ************************************ */

    /****************************************
     ****** DEFINE THE TEACHER CLASS  *******
     ****************************************/

    class Teacher extends Parse.Object {
        constructor() {
            super('Teacher');
        }
        static setAttributes(name, contactNo, address, department, teacherID, qualification, photo) {
            var teacher = new Teacher();
            teacher.set('schoolId', currentUser.attributes.schoolId);
            teacher.set('name', name);
            teacher.set("teacherID", teacherID);
            teacher.set("contactNo", contactNo);
            teacher.set("address", address);
            teacher.set("department", department);
            teacher.set("qualification", qualification);
            teacher.set("photo", photo);

            return teacher;
        }
    }

    /***************************************************************************** */

    $("#submit").click(function () {

        var name = $("#name").val();
        email = $("#email").val();
        var teacherID = Number($("#trid").val());
        var contactNo = Number($("#contact").val());
        var address = $("#address").val();
        var department = $("#dept").val();
        var qualification = $("#qftns").val();
        var photo = $("#photo").val();

        /************************************************************************* */
        /************ Check if all the input forms are correctly filled !! *********/
        /************************************************************************* */

        if (name && email && address && department && qualification && photo) {

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
            } else if (!/\S/.test(qualification)) {
                alert("qualification can't be empty");
                clearAllFields();
            } else {

                /******************  ALL INPUT FIELDS ARE CORRECTLY FILLED *******************/
                alert("inside the all clear block");
                var fileUpload = $("#photo")[0];
                if (fileUpload.files.length > 0) {
                    var file = fileUpload.files[0];
                    var filename = "display." + extractTheFileExtension(photo);

                    var parseFile = new Parse.File(filename, file); console.log(parseFile);

                    saveToCloud(name, contactNo, address, department, teacherID, qualification, parseFile);

                }



                clearAllFields();
            }

        } else {
            alert("No empty field allowed!");
            clearAllFields();
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
        $("#photo").val("");
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

    function saveToCloud(name, contactNo, address, department, teacherID, qualification, photo) {
        var newTeacher = Teacher.setAttributes(name, contactNo, address, department, teacherID, qualification, photo);

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

        user.set("username", currentUser.attributes.schoolId + teacherID);

        user.set("password", generatePassword(contactNo.toString()));

        user.set("email", email);
        // console.log(email);

        user.set("schoolId", currentUser.attributes.schoolId);

        user.set("userType", "teacher"); console.log(user);

        user.signUp(null, {
            success: function (user) {
                console.log("Inside signup success");

                alert("User added");

                /*********************** LOGOUT   ************************ */

                var currentUser = Parse.User.current();
                sendMessage(contactNo, teacherID);
                alert("Successfully registered");
                Parse.User.logOut().then(function () {
                    Parse.User.become(currentSession).then(function (user) {
                        location.reload();
                        clearAllFields();
                    }, function (error) {
                        // The token could not be validated.
                    });
                });

            },
            error: function (user, error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    }

    function sendMessage(contactNo, teacherID) {
        var message = "Your username - " + currentUser.attributes.schoolId + teacherID + " password - " + generatePassword(contactNo.toString());
        var message = encodeURI(message);
        var temp = "https://control.msg91.com/api/sendhttp.php?" +
            "authkey=" + "174873AZUblpkT3Pm59bc04e1" +
            "&mobiles=" + contactNo + "&message=" + message + " & new&mobile&sender=RECESS&route=4";

        $.get(temp, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
        });

    }

    function extractTheFileExtension(str) {
        str = str.split(".");
        return str[str.length - 1];
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