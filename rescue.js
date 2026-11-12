/* Run in the developer console of the ChatGPT conversation you want to save. */
(async () => {
  try {
    const match = location.pathname.match(/^\/c\/([a-zA-Z0-9-]+)\/?$/);
    if (location.origin !== 'https://chatgpt.com' || !match) throw new Error('Open the conversation on chatgpt.com first.');
    const session = await fetch('/api/auth/session', { credentials: 'same-origin' });
    if (!session.ok) throw new Error(`Session request failed (${session.status}).`);
    const { accessToken } = await session.json();
    if (!accessToken) throw new Error('No signed-in session found.');
    const response = await fetch(`/backend-api/conversation/${match[1]}`, {
      credentials: 'same-origin', headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error(`Conversation request failed (${response.status}).`);
    const conversation = await response.json();
    if (!conversation.mapping || !conversation.current_node) throw new Error('Unexpected response; no conversation downloaded.');
    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatgpt-conversation-${match[1]}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    console.log(`Saved conversation JSON: ${Object.keys(conversation.mapping).length} nodes. Check your browser downloads.`);
  } catch (error) {
    console.error('Conversation rescue failed:', error.message);
  }
})();
