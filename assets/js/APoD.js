var url = "https://api.nasa.gov/planetary/apod?api_key=oqA95h2K09FKOTNoIFnVrvbVeUiaKx9UnqwF1EI6";


$.ajax({
  url: url,
  success: handleResult
});

function handleResult(result){
  if("copyright" in result) {
    $("#copyright").text("Image credits: " + result.copyright);
  }
  else {
    $("#copyright").text("Image credits: Public Domain");
  }
  
  if(result.media_type == "video") {
    $("#APoD").css("display", "none"); 
    $("#APoD_vid").attr("src", result.url);
  }
  else {
    $("#APoD_vid").css("display", "none"); 
    $("#APoD").attr("src", result.url);
  }
  $("#apod_explaination").text(result.explanation);
  $("#apod_title").text(result.title);
  $("#src").attr("href",result.hdurl);
}