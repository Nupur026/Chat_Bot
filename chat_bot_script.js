const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
let responseData = [];

window.onload = () => {
  fetch("bot_responses.json")
    .then((res) => res.json())
    .then((data) => (responseData = data))
    .catch((err) => console.error("Error loading bot responses:", err));

  const saved = localStorage.getItem("chatHistory");
  if (saved) chatBox.innerHTML = saved;

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
};

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
  
    // Bubble
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "bubble";
    bubbleDiv.textContent = text;
  
    // Timestamp
    const timestampDiv = document.createElement("span");
    timestampDiv.className = "timestamp";
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    timestampDiv.textContent = timestamp;
  
    // Add green tick (✅) after the timestamp
    const greenTick = document.createElement("span");
    greenTick.className = "green-tick";
    greenTick.textContent = " ✅"; // Green tick symbol
    timestampDiv.appendChild(greenTick);
  
    // Append elements
    msgDiv.appendChild(bubbleDiv);
    msgDiv.appendChild(timestampDiv);
  
    // Add a class for sent messages to show ticks
    if (sender === "user") {
      setTimeout(() => {
        msgDiv.classList.add("sent");  // Add "sent" class for double ticks
      }, 500);
    }
  
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChat();
  }
  
  function appendTypingEffect(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
  
    // Typing Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    
    const typingDots = document.createElement("div");
    typingDots.className = "typing";
    typingDots.innerHTML = "<span></span><span></span><span></span>";
      
    bubble.appendChild(typingDots);
  
    // Timestamp for typing
    const timestampDiv = document.createElement("span");
    timestampDiv.className = "timestamp";
    timestampDiv.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  
    msgDiv.appendChild(bubble);
    msgDiv.appendChild(timestampDiv);
  
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  
    setTimeout(() => {
      bubble.innerHTML = text;
      saveChat();
    }, 1200);  // After 1.2 seconds, show the bot reply
  }
  
  

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message); // 👈 Show user's message
  userInput.value = "";

  setTimeout(() => {
    const reply = getBotReply(message.toLowerCase());
    appendTypingEffect("bot", reply); // 👈 Show "bot is typing..." animation + reply
  }, 500);
}

function getBotReply(msg) {
  msg = msg.toLowerCase();

  for (let item of responseData) {
    if (item.keywords.some((keyword) => msg.includes(keyword))) {
      if (item.reply === "dynamic_time") {
        return `🕒 It's ${new Date().toLocaleTimeString()}`;
      }
      if (item.reply === "dynamic_date") {
        return `📅 Today is ${new Date().toDateString()}`;
      }
      return item.reply;
    }
  }

  return "🤔 I didn’t quite get that. Try asking something else.";
}


function saveChat() {
  localStorage.setItem("chatHistory", chatBox.innerHTML);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function clearChat() {
  if (confirm("Clear chat history?")) {
    chatBox.innerHTML = "";
    localStorage.removeItem("chatHistory");
  }
}
