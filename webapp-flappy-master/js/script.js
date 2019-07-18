jQuery("#scoresbtn").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").append(
    "<p>"+"Scores"+"</p>"
  )
  jQuery("#scoresbtn").addClass("active");
  jQuery("#creditsbtn").removeClass("active");
  jQuery("#helpbtn").removeClass("active");
})

jQuery("#creditsbtn").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").append(
    "<p>"+"This game was made by Mehzar Rizvi"+"</p>"
  )
  jQuery("#scoresbtn").removeClass("active");
  jQuery("#creditsbtn").addClass("active");
  jQuery("#helpbtn").removeClass("active");
})

jQuery("#helpbtn").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").append(
    "<p>"+"Help"+"</p>"
  )
  jQuery("#scoresbtn").removeClass("active");
  jQuery("#creditsbtn").removeClass("active");
  jQuery("#helpbtn").addClass("active");
})
