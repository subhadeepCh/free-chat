const socket = io("https://guarded-reaches-08801.herokuapp.com/");
var chats = document.getElementById("chats");
var auth = {
  "Saved Messages": "You",
};
var roomName = "";

function updateScroll(){
    var top = $(".chat-body").prop("scrollHeight");
    var bottom = $(".chat-body").prop("clientHeight");
    $(".chat-body").scrollTop(top-bottom);
}

$(".chats").click(() => {
  $(".chats").addClass("active");
  $(".camera").removeClass("active");
  $(".status").removeClass("active");
  $(".calls").removeClass("active");

  $(".chat-page").removeClass("invisible");
  $(".camera-page").addClass("invisible");
  $(".status-page").addClass("invisible");
  $(".call-page").addClass("invisible");

});

$(".camera").click(() => {
  $(".camera").addClass("active");
  $(".chats").removeClass("active");
  $(".status").removeClass("active");
  $(".calls").removeClass("active");

  $(".chat-page").addClass("invisible");
  $(".camera-page").removeClass("invisible");
  $(".status-page").addClass("invisible");
  $(".call-page").addClass("invisible");
});

$(".status").click(() => {
  $(".status").addClass("active");
  $(".chats").removeClass("active");
  $(".camera").removeClass("active");
  $(".calls").removeClass("active");

  $(".chat-page").addClass("invisible");
  $(".camera-page").addClass("invisible");
  $(".status-page").removeClass("invisible");
  $(".call-page").addClass("invisible");
});

$(".calls").click(() => {
  $(".calls").addClass("active");
  $(".chats").removeClass("active");
  $(".camera").removeClass("active");
  $(".status").removeClass("active");

  $(".chat-page").addClass("invisible");
  $(".camera-page").addClass("invisible");
  $(".status-page").addClass("invisible");
  $(".call-page").removeClass("invisible");
});

$("#return").click(() => {
  $("#openRoom").addClass("invisible");
  $("#closeRoom").removeClass("invisible");
  $(".chat-body").append(' <div class="notif-container"> You Left </div>');
  socket.emit("userLeft", { name: auth[roomName], room: roomName });
});

$(".chat-page").on("click", ".person", function () {
  const toJoin = $(this).find(".profile").find(".room").text();
  $("#RoomName").text(toJoin);
  roomName = toJoin;

  $(".chat-body").html("");

  socket.emit("userJoined", { name: auth[roomName], room: roomName });

  $(".chat-body").append(' <div class="notif-container">You Joined </div>');

  $("#openRoom").removeClass("invisible");
  $("#closeRoom").addClass("invisible");


  updateScroll();
});

$("#JoinRoom").click(() => {
  const name = $("#Name").val();
  const room = $("#Room").val();

  auth[room] = name;
  console.log(auth);
  $(".chat-page").append(
    '<div class="person"><div class="profile-pic"><img src="https://picsum.photos/' +
      (200 + Math.floor(Math.random() * 100)) +
      '" /></div><div class="profile"><span class="room"><strong>' +
      room +
      '</strong></span><span class="date">7/28/21</span></div></div>'
  );
});

$("#CreateRoom").click(() => {
  const name = $("#Name").val();
  const room = $("#Room").val();

  auth[room] = name;
  console.log(auth);

  if (name && room) {
    socket.emit("create", { name: name, room: room });
  }

  $("#Name").val("");
  $("#Room").val("");

  $(".chat-page").append(
    '<div class="person"><div class="profile-pic"><img src="https://picsum.photos/' +
      (200 + Math.floor(Math.random() * 100)) +
      '" /></div><div class="profile"><span class="room"><strong>' +
      room +
      '</strong></span><span class="date">7/28/21</span></div></div>'
  );
});

socket.on("joined", (res) => {
  alert("joined", res);
});

socket.on("created", (res) => {
  alert("created", res);
});

socket.on("error", (res) => {
  alert(res);
});

socket.on("userJoined", (res) => {
  $(".chat-body").append(
    ' <div class="notif-container">' + res + " Joined </div>"
  );
  updateScroll();
});

socket.on("userLeft", (res) => {
  $(".chat-body").append(
    ' <div class="notif-container">' + res + " Left </div>"
  );
  updateScroll();
});

$(".sendMsg").click(() => {
  const text = $("#msg").val();
  console.log(text);
  $(".chat-body").append(
    '<div class="message-container"><div class="user-message">'+text+'</div></div>'
  );
  socket.emit("sendMsg",{text:text,room:roomName,name:auth[roomName]});
  $("#msg").val("");
  $("#attach").val("");
  updateScroll();
});

socket.on("sendMsg", res=>{
    $(".chat-body").append(
       ' <div class="external-message-container">'+
          '<div class="user-name"><strong>'+res.name+'</strong></div>'+
          '<div class="user-message">'+res.text+'</div></div>'
      );
      updateScroll();
});

document.getElementById("attach").addEventListener(
  "change",
  function () {
    const reader = new FileReader();
    reader.onload = function () {
      const bytes = new Uint8Array(this.result);
      socket.emit("image", {bytes:bytes, name:auth[roomName] ,room: roomName});
    };
    reader.readAsArrayBuffer(this.files[0]);
  },
  false
);

socket.on('image', data => {
    const image = data.image;
    const name = data.name;
    const img = new Image();
    img.src = `data:image/jpg;base64,${image}`; 
    if(name===auth[roomName]){
        $(".chat-body").append('<div class="image-container">'+
    '<img src="'+img.src+'"/></div>'
    );
    }else{
        $(".chat-body").append('<div class="external-image-container">'+
    '<div class="user-name"><strong>'+name+'</strong></div>'+
    '<img src="'+img.src+'"/></div>'
    );
    }

    updateScroll();
});
