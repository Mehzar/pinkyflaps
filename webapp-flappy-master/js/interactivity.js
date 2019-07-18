
function registerScore(score) {
  var playername = prompt("What is your name?");
  var scoreEntry = "<li>"+playername+": "+score.toString()+"</li>";
  jQuery("#scores").append(scoreEntry);
}
