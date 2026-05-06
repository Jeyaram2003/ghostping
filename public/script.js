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

/* USERNAME */

let username = "";

/* JOIN */

joinBtn.addEventListener("click", () => {

    if(usernameInput.value.trim() !== ""){

        username = usernameInput.value;

        loginScreen.style.display = "none";

        app.style.display = "flex";

        socket.emit("user joined", username);

    }

});

/* SEND */

form.addEventListener("submit", (e)=>{

    e.preventDefault();

    if(input.value){

        const messageData = {

            username:username,

            message:input.value

        };

        socket.emit("chat message", messageData);

        input.value="";

    }

});

/* RECEIVE */

socket.on("chat message",(data)=>{

    const div = document.createElement("div");

    div.classList.add("message");

    if(data.username === username){

        div.classList.add("me");

    }else{

        div.classList.add("other");

    }

    div.innerHTML = `

        <div class="username">
            ${data.username}
        </div>

        <div class="message-text">
            ${data.message}
        </div>

    `;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;

});

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