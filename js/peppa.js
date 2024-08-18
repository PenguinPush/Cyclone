const apiUrl = "https://www.wolframcloud.com/obj/f56467ee-f158-4438-a970-12ab46663703"

async function extractKeys(apiUrl) {
    const response = await fetch(apiUrl);
    const text = await response.text();

    const regex = /\((asst_[^\s]+) ([^\s]+)\)\[<\|\|\>\]/;
    const matches = text.match(regex);

    if (matches) {
        const [, assistantID, apiKey] = matches;
        return [assistantID, apiKey]
    } else {
        console.log(text)
        console.log("No matches found.");
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    let [assistantID, apiKey] = await extractKeys(apiUrl)

    async function createThread() {
        const response = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: "{}"
        });

        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to create thread');
        }

        return await response.json();
    }

    async function sendMessage(threadID, message) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({role: "user", content: message})
        });

        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to send message');
        }

        return await response.json();
    }

    async function runResponse(threadID) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadID}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({assistant_id: assistantID})
        });

        if (!response.ok) {
            console.log(response.text());
            throw new Error('Failed to generate response');
        }

        return await response.json();
    }

    async function checkRun(runID, threadID) {
        try {
            const response = await fetch(`https://api.openai.com/v1/threads/${threadID}/runs/${runID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            if (!response.ok) {
                console.log(response.text())
                throw new Error('Failed to fetch run status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching run status:', error);
            throw error;
        }
    }

    async function awaitRun(runID, threadID) {
        try {
            let status = 'queued';
            while (status === 'queued' || status === 'running' || status === 'in_progress') {
                const runStatus = await checkRun(runID, threadID);
                status = runStatus.status;

                console.log('Current status:', status);

                if (status === 'completed' || status === 'failed') {
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const finalStatus = await checkRun(runID, threadID);

            if (finalStatus.status === 'completed') {
                console.log('Run completed successfully');
                return finalStatus;
            } else if (finalStatus.status === 'failed') {
                console.error('Run failed');
            }
        } catch (error) {
            console.error('Error waiting for run completion:', error);
        }
    }

    async function getThreadResponse(threadID) {
        try {
            const response = await fetch(`https://api.openai.com/v1/threads/${threadID}/messages`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch thread messages');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching thread messages:', error);
            throw error;
        }
    }

    async function initializeThread() {
        const thread = await createThread();
        const threadID = thread.id;
        console.log('Thread created:', threadID);

        const messageRun = await runResponse(threadID);
        console.log('Created run:', messageRun);

        const runProcessed = await awaitRun(messageRun.id, threadID)
        console.log('Processed run:', runProcessed);

        const threadContents = await getThreadResponse(threadID)
        displayMessage(threadContents.data[0].content[0].text.value, 'botMessage');
    }

    function displayMessage(messageText, messageType) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', messageType);
        messageDiv.textContent = messageText;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    initializeThread()
});