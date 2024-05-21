const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const typingIndicator = document.getElementById("typing-indicator");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

const promptForName = () => {
  let name;
  do {
    name = prompt("Enter your name to join");
  } while (!name);

  socket.emit("new-user-joined", name);
};

// Check if the user has a name, and prompt if not
if (!localStorage.getItem("userName")) {
  promptForName();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`you: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

socket.on("user-joined", (name) => {
  append(`${name} : joined the chat`, "right");
});

socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} : left the chat`, "left");
});

// Handle name update
socket.on("name-updated", (name) => {
  localStorage.setItem("userName", name);
});



// Function to display typing indicator
function showTypingIndicator(name) {
    typingIndicator.innerText = `${name} is typing...`;
  }
  
  // Function to hide typing indicator
  function hideTypingIndicator() {
    typingIndicator.innerText = "";
  }
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    hideTypingIndicator();
    append(`you: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });
  
  messageInput.addEventListener("input", () => {
    socket.emit("typing");
  });
  
  socket.on("user-typing", (name) => {
    showTypingIndicator(name);
  });
  
  socket.on("user-stop-typing", () => {
    hideTypingIndicator();
  });
  
// Rest of your existing code for handling messages, user joining, and leaving
