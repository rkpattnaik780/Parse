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

    /***************************************************************** */

    $("#submit").click(function () {
        var userID = $("#username").val();
        var password = $("#pwd").val();

        if (userID && password) {
            alert("Successful");

            /**************************************************************** */
            /****************** LOGIN *****************************************/
            /**************************************************************** */

            loginToAccount( userID , password);




        } else {
            alert("All fields are compulsary");
            clearAllFields();
        }
    });

    /**************************************************************** */
    /****************** CLEAR THE FIELDS  *****************************/
    /**************************************************************** */

    function clearAllFields() {
        $("#username").val("");
        $("#pwd").val("");
    }

    /*************************************************************** */
    /******************     FUNCTION TO LOGIN   **********************/
    /*************************************************************** */

    function loginToAccount(user, pwd) {
        Parse.User.logIn(user, pwd, {
            success: function (user) {
                //console.log(user.attributes.accountType);
                checkAndRedirect(user.attributes.userType);
            },
            error: function (user, error) {
               console.log(error);
            }
        });
    }

    /*************************************************************** */
    /*** CHECK IF USER IS ADMIN AND REDIRECT TO REGISTRATION PAGES ***/
    /*************************************************************** */

    function checkAndRedirect(type){
        if(type === "admin"){
            alert("Yeah the user is an admin");
            location.href = "./htmlpages/dashboard.html" ;
        }else{
            alert("Only admins are allowed to login");
        }
    }
});