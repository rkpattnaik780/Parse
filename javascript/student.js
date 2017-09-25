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

    /*** GET THE CURRENT SESSION ***********/

    var currentSession = currentUser.attributes.sessionToken;

    /* ************************************ */

    /****************************************
     ****** DEFINE THE STUDENT CLASS  *******
     ****************************************/

    class Student extends Parse.Object {
        constructor() {
            super('Student');
        }
        static setAttributes(name, address, registrationNo, contactNo, standard, section, photo) {
            var student = new Student();
            student.set('schoolId', currentUser.attributes.schoolId);
            student.set('name', name);
            student.set("address", address);
            student.set("studentId", registrationNo);
            student.set("contactNo", contactNo);
            student.set("class", Number(standard));
            student.set("section", section);
            student.set("photo", photo);

            return student;
        }
    }

    /***************************************************************************** */


    $("#submit").click(function () {
        var name = $("#name").val();
        var address = $("#address").val();
        email = $("#email").val();
        var registrationNo = Number($("#regno").val());
        var contactNo = Number($("#contact").val());
        var standard = $("#std").val();
        var section = $("#section").val();
        var photo = $("#photo").val();

        /* Check if all the input forms are correctly filled !!   */
        if (name && email && standard && section && address) { // if any field is empty
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
            } else {

                 alert("inside the all clear block");
                var fileUpload = $("#photo")[0];
                if (fileUpload.files.length > 0) {
                    var file = fileUpload.files[0];
                    var filename = "display." + extractTheFileExtension(photo);

                    var parseFile = new Parse.File(filename, file); console.log(parseFile);

                    saveToCloud(name, address, registrationNo, contactNo, standard, section, parseFile);

                }



                clearAllFields();
                
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
        $("#std").val("1");
        $("#section").val("A");
        $("#photo").val("");
        $("#address").val("");
    }

    /*********************** CHECK VALIDITY OF EMAIL ID *********************/

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /****************************** SAVING TO THE CLOUD *********************/

    function saveToCloud(name, address, registrationNo, contactNo, standard, section, photo) {

        var newStudent = Student.setAttributes(name, address, registrationNo, contactNo, standard, section, photo);

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



        user.set("username", currentUser.attributes.schoolId + registrationNo);

        user.set("password", generatePassword($("#contact").val()));

        user.set("email", email);

        user.set("userType", "student");

        user.set("schoolId", currentUser.attributes.schoolId);


        /*  **************************************************************************** 
            *************** STORE THE REGISTERED USER TO CLOUD *************************
            **************************************************************************** */

        user.signUp(null, {
            success: function (user) {

                alert("User added");

                /*********************************************** */
                /* *********** LOGOUT   ************************ */
                /*********************************************** */
                sendMessage(contactNo, registrationNo);
                var currentUser = Parse.User.current();
                alert("Successfully registered");
                Parse.User.logOut().then(function () {
                    Parse.User.become(currentSession).then(function (user) {
                        location.reload();
                        clearAllFields();
                    }, function (error) {
                        // The token could not be validated.
                    });
                });

                /*********************************************** */
                /* *********** SEND MESSAGE TO THE USER  ******* */
                /*********************************************** */

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

    function extractTheFileExtension(str) {
        str = str.split(".");
        return str[str.length - 1];
    }

    function sendMessage(contactNo, registrationNo) {

        var message = "Your username - " + currentUser.attributes.schoolId + registrationNo + " password - " + generatePassword(contactNo.toString());
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