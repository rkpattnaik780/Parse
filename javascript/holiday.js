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
        static setAttributes(title, content) {
            var notice = new Notice();
            notice.set('schoolCode', currentUser.attributes.schoolID);
            notice.set('title', title);
            notice.set("content", content);
            notice.set("attachment", null);

            return notice;
        }
    }

    /**************************************** */

    /********** SUBMIT BUTTON  ****************/

    $("#submit").click(function () {

        var title = $("#title").val();
        var month = $("#month").val();
        var dateTo = Number($("#to").val());
        var dateFrom = Number()

    });

    /****************** CLEAR BUTTON **********/

    $("#clear").click(function () {
        clearTheForm();
    });

    /**************  GLOBAL FUNCTIONS *********/

    function saveToCloud(title, content, attachment) {

        var newNotice = Notice.setAttributes(title, content);

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

    /***********   CLEAR THE FORM  ****************/

    function clearTheForm() {
        $("#title").val("");
        $("#content").val("");
        $("#month").val("January");
        $("#from").val("");
        $("#to").val("");
    }

});