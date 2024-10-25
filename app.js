import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyC6ffbJ4ppz9MUEl5nh5Cs5LAvuc239vM4'; 
const genAI = new GoogleGenerativeAI(API_KEY);


const defaultPrompt = "You are a healthcare assistant for cardiac patients. Provide medical guidance, lifestyle tips, and answer questions related to heart health. Respond with empathy and be friendly include emojis in responses and dont add ** for bullets just add line spacing. Don't say 'I understand', just get the point. Keep it short and precise.";


let conversationHistory = `${defaultPrompt}\n`;


document.getElementById('promptForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const prompt = document.getElementById('prompt').value;
  if (prompt.trim() === '') return;

  addMessageToChat(prompt, 'user-message');

  
  conversationHistory += `User: ${prompt}\n`;

  document.getElementById('prompt').value = '';

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    
    const result = await model.generateContent(conversationHistory);

    const botResponse = result.response.text();

    
    conversationHistory += `${botResponse}\n`;

    
    addMessageToChat(botResponse, 'bot-message');

    
    const botMessageDiv = document.querySelector('.bot-message:last-child');
    botMessageDiv.innerHTML = ''; 
    typeWriterEffect(botResponse, botMessageDiv);

  } catch (error) {
    addMessageToChat(`Error: ${error.message}`, 'bot-message');
  }
});


document.getElementById('prompt').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    document.getElementById('promptForm').dispatchEvent(new Event('submit')); 
  }
});

function addMessageToChat(text, className) {
  const chatWindow = document.getElementById('chatWindow');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', className);
  
  messageDiv.innerHTML = text; 
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function typeWriterEffect(text, element) {
  let index = 0;

  function typeNextChar() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeNextChar, 30); 
    }
  }

  typeNextChar();
}
