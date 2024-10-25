import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyC6ffbJ4ppz9MUEl5nh5Cs5LAvuc239vM4'; 
const genAI = new GoogleGenerativeAI(API_KEY);


const defaultPrompt = "You are a healthcare assistant for cardiac patients. Provide medical guidance, lifestyle tips, and answer questions related to heart health. Respond with empathy and professionalism.";

document.getElementById('promptForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const prompt = document.getElementById('prompt').value;
  if (prompt.trim() === '') return;

  addMessageToChat(prompt, 'user-message');

  document.getElementById('prompt').value = '';

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    
    const result = await model.generateContent(`${defaultPrompt} ${prompt}`);
    
    addMessageToChat(result.response.text(), 'bot-message');
  } catch (error) {
    addMessageToChat(`Error: ${error.message}`, 'bot-message');
  }
});

function addMessageToChat(text, className) {
  const chatWindow = document.getElementById('chatWindow');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', className);
  messageDiv.textContent = text;

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
