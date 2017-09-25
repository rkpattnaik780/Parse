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
     ******* DEFINE THE event CLASS  ********
     ****************************************/

    class Event extends Parse.Object {
        constructor() {
            super("Event");
        }
        static setAttributes( eventDate, title, content, attachment) {
            var event = new Event();
            event.set('schoolId', currentUser.attributes.schoolId);
            event.set("eventDate", new Date(eventDate));
            event.set('subject', title);
            event.set("content", content);
            event.set("attachment", attachment);

            return event;
        }
    }

    /**************************************** */

    /********** SUBMIT BUTTON  ****************/

    $("#submit").click(function () {

        var title = $("#title").val();
        var content = $("#content").val();
        var name = $("#attachment").val();
        var eventDate = $("#date").val();

        if (name && content && title && eventDate) {

            var fileUpload = $("#attachment")[0];
            if (fileUpload.files.length > 0) {
                var file = fileUpload.files[0];
                var name = "event." + extractTheFileExtension(name); 
                var parseFile = new Parse.File(name, file);
               // var newevent = event.setAttributes( title , content , parseFile);
                alert("Successful");
                saveToCloud(eventDate , title, content, parseFile);
            }

        } else {
            alert("All fields are compulsary");
            clearTheForm();
        }

    });

    /****************** CLEAR BUTTON **********/

    $("#clear").click(function () {
        clearTheForm();
    });

    /************ GLOBAL FUNCTIONS  ***********/

    function saveToCloud(eventDate, title, content, attachment) {
console.log("Savetocloud called");
        var newevent = Event.setAttributes(eventDate, title, content, attachment);
console.log(newevent);
        newevent.save(null, {
            success: function (newevent) {
                alert("event record added");
                clearTheForm();

            },
            error: function (newevent, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });

    }

    function extractTheFileExtension(str) {
        str = str.split(".");
        return str[str.length - 1];
    }
    /***************** CLEAR THE FORMS ****** */

    function clearTheForm() {
        $("#title").val("");
        $("#content").val("");
        $("#attachment").val("");
        $("#date").val("");
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