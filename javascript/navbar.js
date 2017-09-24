
$(document).ready(function(){
    
        $(".superLink").click(function(){
    
            var display = $(this).children(".sub-list").css("display");
    
            if(display === "block") {
                
                $(this).children(".sub-list").css("display", "none");
    
            }
            else {
    
                $(this).children(".sub-list").css("display", "block");
    
            }
                
    });
});