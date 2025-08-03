# Journal Prompt Generator Microservice

## Communication Contract for Journal Prompt Generator Microservice

### 1. REQUEST data

To make a request, send a GET request to this endpoint: https://journal-prompt-generator-microservice.onrender.com/prompts

No parameters are required - this is a simple GET request that will generate 3 random journal prompts focused on exploring feelings and emotions, self-discovery, and gratitude.

**Example request:**
```javascript
const response = await fetch('https://journal-prompt-generator-microservice.onrender.com/prompts');
```

### 2. RECEIVE data

To receive data from the microservice, await the response from the request and parse it as text. The microservice returns a plain text string with 3 journal prompts, each separated by a newline character.

**Example:**
```javascript
const response = await fetch('https://journal-prompt-generator-microservice.onrender.com/prompts');

if (response.ok) {
    const data = await response.text();
    const prompts = data.split('\n');
    console.log(prompts);
    // Output example:
    // [
    //   "What emotions are you feeling right now and why?",
    //   "What personal strength did you discover about yourself today?", 
    //   "Name three things you're genuinely grateful for this week."
    // ]
} else {
    console.error('Failed to fetch prompts:', response.status);
}
```

**Response Format:**
- **Success (200):** Plain text string with 3 prompts separated by newlines
- **Error (500):** Plain text string with 3 fallback prompts separated by newlines
- **Not Found (404):** JSON error message

### UML Sequence Diagram
![UML](https://github.com/user-attachments/assets/325ba2b4-5552-48c5-bdec-1d8ace603fbf)



