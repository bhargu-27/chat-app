import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const Chat = () => {
    const router = useRouter();
    const { role } = router.query;
    const headers = {
        'Content-Type': 'application/json'
    };
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const getThreads = async () => {
            let res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/getThreadsMessages`, headers);
            try {
                if (res.data.isSuccess) {
                    setThreads(res.data.threadMessages);
                }
            } catch (err) {
                console.err(err);
            }
        };
        getThreads();
    }, []);

    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    
    const handleSelectThread = (threadId) => {
        setSelectedThreadId(threadId === selectedThreadId ? null : threadId);
    };

    const handleCreateNewThread =async() => {
        let res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/createThread`, headers);
        if(!res.data.isSuccess){
            console.err(res.data.message)
        }
        const newThreadId = res.data.thread._id;
        setThreads([
            ...threads,
            {
                threadId: newThreadId,
                messages: [],
            },
        ]);
        setSelectedThreadId(newThreadId);
    };

    const handleMessageSend = async(e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        let values = {
            threadId:selectedThreadId,
            message:newMessage,
            user:role
        }
        let res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/sendMessage`,values, headers);
        if(!res.data.isSuccess){
            console.err(res.data.message)
        }
        const updatedMessages = threads.map((thread) => {
            if (thread.threadId === selectedThreadId) {
                return {
                    ...thread,
                    messages: [
                        ...thread.messages,
                        { message: newMessage, user: role, time: new Date().toISOString() },
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
                <p className="mb-4">Welcome, {role}!</p>

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
                            <h2 className="text-xl font-bold">Thread</h2>
                            {selectedThreadId === thread.threadId && (
                                <div>
                                    <ul>
                                        {thread.messages
                                            .sort((a, b) => new Date(a.time) - new Date(b.time))
                                            .map((msg, index) => (
                                                <li
                                                    key={index}
                                                    className={`p-2 mb-2 rounded ${
                                                        msg.user === role ? 'ml-auto bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                                                    }`}
                                                    style={{
                                                        maxWidth: '70%',
                                                        textAlign: msg.user === role ? 'right' : 'left',
                                                        wordWrap: 'break-word',
                                                    }}
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