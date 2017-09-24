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
     ******* DEFINE THE Notice CLASS  ********
     ****************************************/

    class Notice extends Parse.Object {
        constructor() {
            super("Notice");
        }
        static setAttributes(title, content, attachment) {
            var notice = new Notice();
            notice.set('schoolId', currentUser.attributes.schoolId);
            notice.set('subject', title);
            notice.set("content", content);
            notice.set("attachment", attachment);

            return notice;
        }
    }

    /**************************************** */

    /********** SUBMIT BUTTON  ****************/

    $("#submit").click(function () {

        var title = $("#title").val();
        var content = $("#content").val();
        var name = $("#attachment").val();

        if (name && content && title) {

            var fileUpload = $("#attachment")[0];
            if (fileUpload.files.length > 0) {
                var file = fileUpload.files[0];
                var name = "notice." + extractTheFileExtension(name); 

                var parseFile = new Parse.File(name, file);
               // var newNotice = Notice.setAttributes( title , content , parseFile);
                saveToCloud(title, content, parseFile);
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

    function saveToCloud(title, content, attachment) {

        var newNotice = Notice.setAttributes(title, content, attachment);

        newNotice.save(null, {
            success: function (newNotice) {
                alert("Notice record added");
                clearTheForm();

            },
            error: function (newNotice, error) {
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
    }


});