import React, { useState } from 'react';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';

const Chat = () => {
    const router = useRouter();
    const { name, role } = router.query;
    /*
        Data Model For Message 
        Initially we have array of threads 
    */
    const [threads, setThreads] = useState([
        {
            threadId: 1,
            messages: [
                { message: 'Hello', type: 'sent' },
                { message: 'Hi', type: 'received' },
                { message: 'I wanted to talk about the prescription you provided last time', type: 'sent' },
                { message: 'Yes sure, What do you want to know?', type: 'received' },
                { message: 'At what time do I need to take it?', type: 'sent' },
                { message: 'Evening after dinner!', type: 'received' },
            ],
        },
        {
            threadId: 2,
            messages: [
                { message: 'Hello', type: 'sent' },
                { message: 'Hi', type: 'received' },
            ],
        },
        {
            threadId: 3,
            messages: [
                { message: 'Hello', type: 'sent' },
                { message: 'Hi', type: 'received' },
            ],
        },
    ]);

    const [selectedThreadId, setSelectedThreadId] = useState(1);
    const [newMessage, setNewMessage] = useState('');

    const handleSelectThread = (threadId) => {
        setSelectedThreadId(threadId === selectedThreadId ? null : threadId);
    };

    const handleCreateNewThread = () => {
        const newThreadId = threads.length + 1;
        setThreads([
            ...threads,
            {
                threadId: newThreadId,
                messages: [],
            },
        ]);
        setSelectedThreadId(newThreadId);
    };

    const handleMessageSend = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const updatedMessages = threads.map((thread) => {
            if (thread.threadId === selectedThreadId) {
                return {
                    ...thread,
                    messages: [
                        ...thread.messages,
                        { message: newMessage, type: 'sent' },
                    ],
                };
            }
            return thread;
        });

        setThreads(updatedMessages);
        setNewMessage('');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-lg border rounded-lg p-4">
                <h1 className="text-3xl font-bold mb-4">Patient-Doctor Chat</h1>
                <p className="mb-4">Welcome, {name} ({role})!</p>

                {threads.map((thread) => (
                    <div key={thread.threadId} className="mb-4">
                        <div
                            className={`p-4 rounded ${selectedThreadId === thread.threadId
                                    ? 'bg-gray-200'
                                    : 'bg-white hover:bg-gray-100 cursor-pointer'
                                }`}
                                onClick={(e) => {
                                    const targetTagName = e.target.tagName.toLowerCase();
                                    if (targetTagName !== 'input' && targetTagName !== 'button') {
                                        handleSelectThread(thread.threadId);
                                    }
                                }}
                        >
                            <h2 className="text-xl font-bold">Thread {thread.threadId}</h2>
                            {selectedThreadId === thread.threadId && (
                                <div>
                                    <ul>
                                        {thread.messages.map((msg, index) => (
                                            <li
                                                key={index}
                                                className={`p-2 mb-2 rounded ${msg.type === 'sent' ? 'ml-auto bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                                                    }`}
                                                style={{ maxWidth: '70%', textAlign: msg.type === 'sent' ? 'right' : 'left', wordWrap: 'break-word' }}
                                            >
                                                {msg.message}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex mt-4">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleMessageSend(e);
                                                }
                                            }}
                                            placeholder="Type your message..."
                                            className="flex-grow border border-gray-300 rounded-l py-2 px-4"
                                        />
                                        <button
                                            onClick={handleMessageSend}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleCreateNewThread}
                >
                    + Create New Thread
                </button>
            </div>
        </div>
    );
};

export default Chat;
