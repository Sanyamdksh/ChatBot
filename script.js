const chatIp = document.querySelector(".input textarea");
const sendChat = document.querySelector(".input span");
const chatBox = document.querySelector(".chatbox");
const toggler = document.querySelector(".toggler");

let userInput;
const apiKey = "AIzaSyASphX5wS-9MqyLUtK-W3KSV338u9QUyTI";

const createMessage = (message, className) => {
  const outMessage = document.createElement("out");
  outMessage.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="hello">🤖</span><p>/p>`;
  outMessage.innerHTML = chatContent;
  outMessage.querySelector("p").textContent = message;
  return outMessage;
};

const generateResponse = (incomingBot) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  const botMessage = incomingBot.querySelector("p");
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userInput }],
        },
      ],
    }),
  };
  fetch(apiUrl, request)
    .then((res) => res.json())
    .then((data) => {
      botMessage.textContent = data.candidates[0].content.parts[0].text;
      //   console.log(data);
    })
    .catch((error) => {
      botMessage.classList.add("Error");
      botMessage.textContent = "Oops! Something went wrong.Please try again";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const handleChat = () => {
  userInput = chatIp.value.trim();
  if (!userInput) return;
  chatIp.value = "";
  chatBox.appendChild(createMessage(userInput, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);
  setTimeout(() => {
    const incomingBot = createMessage("Generating...", "incoming");
    chatBox.appendChild(incomingBot);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingBot);
  }, 600);
};
toggler.addEventListener("click", () => document.body.classList.toggle("show"));
sendChat.addEventListener("click", handleChat);
