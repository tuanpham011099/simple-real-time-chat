const socket = io();

let message = document.getElementById("message");
let mess_box = document.getElementById("message_box");
let form = document.getElementById("form");

socket.emit("user_connected", ROOM_ID);

form.addEventListener("submit", submitForm = (e) => {
    e.preventDefault();
    if (message.value === "") {
        return;
    }
    socket.emit("message_send", USER_ID, ROOM_ID, message.value);
    message.value = "";
});



socket.on("message_received", (userName, message) => {
    let element = `<li class="${userName===USER_ID?"out":"in"}">
                        <div class="chat-body">
                            <div class="chat-message">
                                <h5>${userName}</h5>
                                <p>${message}</p>
                            </div>
                        </div>
                    </li>`
    mess_box.insertAdjacentHTML("beforeend", element);
})