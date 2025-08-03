// Test program to demonstrate the Journal Prompt Generator Microservice

const fetch = require('node-fetch');

async function testJournalPromptMicroservice() {
    console.log('=== Journal Prompt Generator Microservice Test ===\n');
    
    const microserviceUrl = 'http://localhost:3001/prompts';
    
    try {
        console.log('1. Making GET request to microservice...');
        console.log(`   URL: ${microserviceUrl}`);
        
        // Make the request to the microservice
        const startTime = Date.now();
        const response = await fetch(microserviceUrl);
        const endTime = Date.now();
        
        console.log(`   Response Status: ${response.status}`);
        console.log(`   Response Time: ${endTime - startTime}ms\n`);
        
        if (response.ok) {
            // Get the response data as text
            const data = await response.text();
            console.log('2. Successfully received data from microservice:');
            console.log('   Raw response:');
            console.log(`   "${data}"\n`);
            
            // Parse the prompts
            const prompts = data.split('\n').filter(prompt => prompt.trim() !== '');
            console.log('3. Parsed journal prompts:');
            prompts.forEach((prompt, index) => {
                console.log(`   ${index + 1}. ${prompt}`);
            });
            console.log(`\n   Total prompts received: ${prompts.length}`);
            
            // Demonstrate multiple calls to show variability
            console.log('\n4. Testing variability - making second request...');
            const response2 = await fetch(microserviceUrl);
            if (response2.ok) {
                const data2 = await response2.text();
                const prompts2 = data2.split('\n').filter(prompt => prompt.trim() !== '');
                console.log('   Second set of prompts:');
                prompts2.forEach((prompt, index) => {
                    console.log(`   ${index + 1}. ${prompt}`);
                });
                
                // Check for differences
                const differences = prompts.filter((prompt, index) => prompt !== prompts2[index]);
                console.log(`\n   Prompts that changed: ${differences.length}/3`);
            }
            
        } else {
            console.log('2. Error response from microservice:');
            const errorData = await response.text();
            console.log(`   Error: ${errorData}`);
        }
        
    } catch (error) {
        console.error('3. Request failed with error:');
        console.error(`   ${error.message}`);
    }
}

// Test health endpoint as well
async function testHealthEndpoint() {
    console.log('\n=== Testing Health Endpoint ===');
    try {
        const response = await fetch('http://localhost:3001/health');
        if (response.ok) {
            const data = await response.json();
            console.log('Health check passed:', data);
        }
    } catch (error) {
        console.log('Health check failed:', error.message);
    }
}

// Run the tests
async function runAllTests() {
    await testJournalPromptMicroservice();
    await testHealthEndpoint();
    console.log('\n=== Test Complete ===');
}

// Execute if running directly (Node.js)
if (typeof window === 'undefined') {
    runAllTests();
}

// Export for use in other environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testJournalPromptMicroservice, testHealthEndpoint };
}