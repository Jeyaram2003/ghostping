const socket = io();

/* ELEMENTS */

const loginScreen = document.getElementById("loginScreen");

const app = document.getElementById("app");

const usernameInput = document.getElementById("usernameInput");

const joinBtn = document.getElementById("joinBtn");

const form = document.getElementById("form");

const input = document.getElementById("input");

const chat = document.getElementById("chat");

const usersDiv = document.getElementById("users");

const imageInput = document.getElementById("imageInput");

/* USERNAME */

let username = "";

/* JOIN */

joinBtn.addEventListener("click",()=>{

    if(usernameInput.value.trim() !== ""){

        username = usernameInput.value;

        loginScreen.style.display = "none";

        app.style.display = "flex";

        socket.emit("user joined",username);

    }

});

/* SEND TEXT */

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    if(input.value){

        const messageData = {

            username:username,

            message:input.value

        };

        socket.emit("chat message",messageData);

        input.value="";

    }

});

/* SEND IMAGE */

imageInput.addEventListener("change", async ()=>{

    const file = imageInput.files[0];

    if(!file) return;

    const formData = new FormData();

    formData.append("image",file);

    const response = await fetch("/upload",{

        method:"POST",

        body:formData

    });

    const data = await response.json();

    socket.emit("image message",{

        username:username,

        imageUrl:data.imageUrl

    });

});

/* RECEIVE TEXT */

socket.on("chat message",(data)=>{

    addMessage(data,false);

});

/* RECEIVE IMAGE */

socket.on("image message",(data)=>{

    addMessage(data,true);

});

/* ADD MESSAGE */

function addMessage(data,isImage){

    const div = document.createElement("div");

    div.classList.add("message");

    if(data.username === username){

        div.classList.add("me");

    }else{

        div.classList.add("other");

    }

    if(isImage){

        div.innerHTML = `

            <div class="username">
                ${data.username}
            </div>

            <img
            src="${data.imageUrl}"
            class="chat-image"
            />

        `;

    }else{

        div.innerHTML = `

            <div class="username">
                ${data.username}
            </div>

            <div class="message-text">
                ${data.message}
            </div>

        `;

    }

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;

}

/* ONLINE USERS */

socket.on("online users",(users)=>{

    usersDiv.innerHTML="";

    users.forEach((user)=>{

        const div = document.createElement("div");

        div.classList.add("user");

        div.innerHTML=`🟢 ${user}`;

        usersDiv.appendChild(div);

    });

});