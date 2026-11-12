# ChatGPT Conversation Rescue

Save a stuck or very long ChatGPT conversation when scrolling and copying messages is impractical. This small browser-console script retrieves the conversation you already have open and downloads its original JSON. An optional local converter makes a readable text transcript.

Tested with a long conversation in Safari on macOS. ChatGPT's internal web endpoints are undocumented and can change without notice. This is an independent project, not an official OpenAI tool.

## Recover a conversation

1. Sign in at [chatgpt.com](https://chatgpt.com/) and open the conversation. Its address must look like `https://chatgpt.com/c/...`.
2. Open the browser developer console. In Safari, enable developer features in Settings if needed, then use Option + Command + C. In Chrome or Edge, use Option + Command + J on macOS or Ctrl + Shift + J on Windows/Linux.
3. Open [rescue.js](rescue.js) in this repository, copy its entire contents, paste it into the console, and press Enter. Only paste code into your browser console after you have read and understood it.
4. Find the JSON file in your browser's downloads. The console reports how many conversation nodes were returned.

The script talks only to the current ChatGPT origin using your existing session. It does not send your conversation or session token to this project or another server. Keep the download private: it contains your conversation and can include sensitive metadata.

## Make a readable transcript

With Node.js installed, download or clone this repository, then run:

```sh
node transcript.mjs /path/to/conversation.json /path/to/transcript.txt
```

The converter follows the current conversation path from its last node to the root and writes user and assistant text in order. It refuses to overwrite an existing output file. The JSON retains alternate versions and other nodes returned by ChatGPT; the text file does not. Images, uploads, and other non-text content are placeholders in the transcript. Their bytes are not downloaded by this tool. Some message types, tools, formatting, and metadata are only in the JSON.

If the page cannot open at all, the account session is unavailable, or the endpoint changes, this method may not work. ChatGPT's account data export is another option. A successful download is not a guarantee that every attachment remains available.

## Verify locally

```sh
node --test
```
