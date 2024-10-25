import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyC6ffbJ4ppz9MUEl5nh5Cs5LAvuc239vM4'; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Define the default prompt
const defaultPrompt = "You are a healthcare assistant for cardiac patients. Provide medical guidance, lifestyle tips, and answer questions related to heart health. Respond with empathy and professionalism.";

// Initialize conversation history
let conversationHistory = `${defaultPrompt}\n`;

// Handle form submission
document.getElementById('promptForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const prompt = document.getElementById('prompt').value;
  if (prompt.trim() === '') return;

  addMessageToChat(prompt, 'user-message');
  
  // Append the user message to the conversation history
  conversationHistory += `User: ${prompt}\n`;

  document.getElementById('prompt').value = '';

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content with conversation history
    const result = await model.generateContent(conversationHistory);
    
    const botResponse = result.response.text();

    // Append bot response to the conversation history
    conversationHistory += `Bot: ${botResponse}\n`;

    // Typewriter effect for bot's response
    addMessageToChat(botResponse, 'bot-message');

    // Optional: Limit the history length to the last few messages
    if (conversationHistory.length > 2000) {
      conversationHistory = `${defaultPrompt}\n` + conversationHistory.slice(-1500); // Adjust slice as needed
    }
    
  } catch (error) {
    addMessageToChat(`Error: ${error.message}`, 'bot-message');
  }
});

// Prevent Enter key from adding a newline in the textarea
document.getElementById('prompt').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent newline
    document.getElementById('promptForm').dispatchEvent(new Event('submit')); // Trigger form submission
  }
});

function addMessageToChat(text, className) {
  const chatWindow = document.getElementById('chatWindow');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', className);

  // Apply typewriter effect for bot responses
  if (className === 'bot-message') {
    typeWriterEffect(text, messageDiv);
  } else {
    messageDiv.textContent = text;
  }

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function typeWriterEffect(text, element) {
  let index = 0;

  function typeNextChar() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeNextChar, 30); // Adjust typing speed here (milliseconds)
    }
  }

  typeNextChar();
}
