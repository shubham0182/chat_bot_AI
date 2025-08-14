function changeTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);

    // Update active state for theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.onclick.toString().includes(themeName)) {
            btn.classList.add('active');
        }
    });

    // Save theme preference
    localStorage.setItem('preferred-theme', themeName);
}

// Load saved theme
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('preferred-theme') || 'ios-light';
    changeTheme(savedTheme);
});

const chatbox = document.getElementById("chatbox");
const messageInput = document.getElementById("message-input");

function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    messageInput.value = "";

    // Typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("typing-indicator", "bot");
    typingDiv.innerHTML = "<span></span><span></span><span></span>";
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        typingDiv.remove();
        addMessage(data.reply, "bot");
    } catch (error) {
        typingDiv.remove();
        addMessage("Error connecting to server", "bot");
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}
