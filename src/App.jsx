import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "sk-proj-3k7gYhEJO8x6cDLOwhe5T3BlbkFJDyptwSxSvhySqRg6ua5Y";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];

    // update our messages state
    setMessages(newMessages)

    // set a typing indicator
    setTyping(true);

    // process message to chatGPT
    await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages { seender: "user" or "ChatGPT",m message: "The message content here" }
    // apiMessages { role: "user" or "assistant", content: "The message content here" }

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    })

    // role: "user" -> a message from the user, "assistant" -> response from chatGPT
    // "system" -> generally one initial message defining how we want chatgpt to talk

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old"
    }

    const apiRequestBody = {
      "mode": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer "+ API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList TypingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
