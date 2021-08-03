var video = document.querySelector("#video");
var audio = document.querySelector("#audio");
var start = true;


const recordVideo = () =>{
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio:true })
          .then(function (stream) {
              video.srcObject = stream;
              audio.srcObject = stream;
          })
          .catch(function (error) {
            console.log("Something went wrong!", error);
          });
      }
}
const toggleStart = () => {
    start = !start;
    if(!start){
        video.srcObject.getTracks()[0].stop();
        video.srcObject.getTracks()[1].stop();
        audio.srcObject.getTracks()[0].stop();
        audio.srcObject.getTracks()[1].stop();
        video.srcObject = null;
        audio.srcObject = null;
    }
    else recordVideo();
    console.log(start);
}

window.onload = function(){
    console.log("Started");
    recordVideo();
}

