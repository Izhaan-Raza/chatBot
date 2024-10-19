import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key
const API_KEY = 'AIzaSyD2_H1OBQ6mlxlYIJnKAaMIV4TEcRIDbO4'; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Form submit handler
document.getElementById('promptForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const prompt = document.getElementById('prompt').value;
  if (prompt.trim() === '') return; // Prevent empty submissions

  // Append user's message to chat window
  addMessageToChat(prompt, 'user-message');

  // Clear input field
  document.getElementById('prompt').value = '';

  try {
    // Get the Gemini model (update if necessary)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate the response from the prompt
    const result = await model.generateContent(prompt);
    
    // Append the bot's response to chat window
    addMessageToChat(result.response.text(), 'bot-message');

  } catch (error) {
    // Handle and display any errors
    addMessageToChat(`Error: ${error.message}`, 'bot-message');
  }
});

// Function to append messages to the chat window
function addMessageToChat(text, className) {
  const chatWindow = document.getElementById('chatWindow');

  // Create a new message div
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', className);
  messageDiv.textContent = text;

  // Append the message to the chat window
  chatWindow.appendChild(messageDiv);

  // Scroll to the bottom of the chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
