$(document).ready(function () {

    /****************************************
    ****** INITIALIZE THE PARSE SERVER *****
    ****************************************/

    Parse.initialize("O6sEjAj5DfCQMpch2EIv8ofT39AoLQcy3bUpB83C", "TMaH6aab2aKbhXly8QZuJvMisyGhcKx7ATaK0B2v");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    /****************************************
     **** INITIALIZE THE USER OBJECT  *******
     ***************************************/

    var user = new Parse.User();

    /************************************* */
    /**********STORE THE SESSION  **********/
    /************************************* */

    var currentSession ;

    /************************************* */

    /************************************* */
    /*******  CHECK IF LOGGED IN  **********/
    /***************************************/

    var currentUser = Parse.User.current();
    if (!currentUser) {
        alert("You need to login!");
        location.href = "../index.html";
    }

    /************************************* */

    /************************************* */
    /*************  LOG OUT ****************/
    /***************************************/

    /***************************************************************************** */
    /********************** GET CURRENT SESSION TOKEN **************************** */
    /***************************************************************************** */

    var current = Parse.Session.current().then(session => {
        currentSession = session.attributes.sessionToken ;
    });

    /***************************************************************************** */

    $("#logout").click(function () {
        if (currentUser) {
            Parse.User.logOut().then(() => {
                location.href = "../index.html" ;
            });
        }
    });

    /************************************* */

    /*
    
        My Edit for active class

    */

    $("#homeLink").addClass("active");

});