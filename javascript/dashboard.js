var lat, lng;


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
    
        /************************************* */
        /*******  CHECK IF LOGGED IN  **********/
        /***************************************/
    
        var currentUser = Parse.User.current();
        if (!currentUser) {
            alert("You need to login!");
            location.href = "../index.html";
        }
    
        /************************************* */
    
        /************ GET THE SCHOOL INFO  *****/
    
        var getTheData = new Parse.Query("SchoolInfo");
        getTheData.equalTo("schoolId", currentUser.attributes.schoolId);
    
        getTheData.find({
            success: function (results) {
    
                console.log(results[0]);
    
                $("#photo").attr("src",results[0].attributes.photo._url);
                $("#name").html(results[0].attributes.schoolName);
                $("#address").html(results[0].attributes.address);
                $("#contact").html("Contact No. - " + results[0].attributes.contactNo);
                lat = parseFloat(results[0].attributes.location._latitude); 
                lng = parseFloat(results[0].attributes.location._longitude);
    
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    
        /************************************* */
    
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
    
    

    
    



 
    
    });




    /* Map Global Function */
    function initMap(){
        var uluru = {lat: lat, lng: lng};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
    };
    

    