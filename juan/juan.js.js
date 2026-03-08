const chatPanel = document.querySelector(".chat-panel");
const chatMessages = document.querySelector(".chat-messages");
const chatInput = document.querySelector(".chat-input-row input");
const chatSend = document.querySelector(".chat-input-row button");

function addMessage(text, sender="bot") {

  const msg = document.createElement("div");
  msg.className = "msg msg-" + sender;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = text;

  msg.appendChild(bubble);
  chatMessages.appendChild(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {

  const text = chatInput.value.trim();

  if(!text) return;

  addMessage(text,"user");

  chatInput.value="";

  addMessage("Pensando...", "bot");

  const response = await fetch("https://juan-ai-zq22.onrender.com/chat",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify({message:text})
});
  const data = await response.json();

  chatMessages.lastChild.remove();

  addMessage(data.reply,"bot");
}

chatSend.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", function(e){
  if(e.key==="Enter") sendMessage();
});