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
    /*
    Sample Thread Objects :
    const thread=[
        {
            "threadId": "66217d8a565a46d362639c45",
            "subject": "Consumption",
            "messages": [
                {
                    "_id": "66217dad565a46d362639c47",
                    "message": "Hello doctor what are the consumption restrictions as I am taking new medicines now",
                    "time": "2024-04-18T20:08:13.053Z",
                    "threadId": "66217d8a565a46d362639c45",
                    "user": "patient",
                    "__v": 0
                }
            ]
        },
        {
            "threadId": "66217a01e62e3056b5256a09",
            "subject": "Appointment",
            "messages": [
                {
                    "_id": "66217a0ae62e3056b5256a0b",
                    "message": "Hello doctor",
                    "time": "2024-04-18T19:52:42.679Z",
                    "threadId": "66217a01e62e3056b5256a09",
                    "user": "patient",
                    "__v": 0
                },
                {
                    "_id": "66217d6a565a46d362639c3f",
                    "message": "I wanted reschedule my appointment",
                    "time": "2024-04-18T20:07:06.319Z",
                    "threadId": "66217a01e62e3056b5256a09",
                    "user": "patient",
                    "__v": 0
                }
            ]
        },
        {
            "threadId": "662175052b57c540035f8fc0",
            "subject": "extra medicines",
            "messages": [
                {
                    "_id": "6621750d2b57c540035f8fc2",
                    "message": "Hi",
                    "time": "2024-04-18T19:31:25.185Z",
                    "threadId": "662175052b57c540035f8fc0",
                    "user": "patient",
                    "__v": 0
                }
            ]
        },
        {
            "threadId": "66216e66cb973321b303622f",
            "subject": "exercise",
            "messages": [
                {
                    "_id": "66216f3bcb973321b3036231",
                    "message": "Hello",
                    "time": "2024-04-18T19:06:35.628Z",
                    "threadId": "66216e66cb973321b303622f",
                    "user": "patient",
                    "__v": 0
                },
                {
                    "_id": "6621767c2b57c540035f8fd9",
                    "message": "Hey",
                    "time": "2024-04-18T19:37:32.044Z",
                    "threadId": "66216e66cb973321b303622f",
                    "user": "doctor",
                    "__v": 0
                },
                {
                    "_id": "662179eae62e3056b5256a04",
                    "message": "Hey",
                    "time": "2024-04-18T19:52:10.457Z",
                    "threadId": "66216e66cb973321b303622f",
                    "user": "patient",
                    "__v": 0
                }
            ]
        }
    ]
    */
    const [newThreadSubject, setNewThreadSubject] = useState('');

    useEffect(() => {
        const getThreads = async () => {
            let res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/getThreadsMessages`, headers);
            try {
                if (res.data.isSuccess) {
                    setThreads(res.data.threadMessages);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getThreads();
    }, []);

    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const handleSelectThread = (threadId) => {
        setSelectedThreadId(threadId === selectedThreadId ? null : threadId);
    };

    const handleCreateNewThread = async () => {
        let res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/createThread`, { subject: newThreadSubject }, headers);
        if (!res.data.isSuccess) {
            console.error(res.data.message);
            return;
        }
        const newThreadId = res.data.thread._id;
        setThreads([
            ...threads,
            {
                threadId: newThreadId,
                subject: newThreadSubject,
                messages: [],
            },
        ]);
        setSelectedThreadId(newThreadId);
        setNewThreadSubject('');
    };

    const handleMessageSend = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        let values = {
            threadId: selectedThreadId,
            message: newMessage,
            user: role
        }
        let res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/sendMessage`, values, headers);
        if (!res.data.isSuccess) {
            console.error(res.data.message);
            return;
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
                            <h2 className="text-xl font-bold">{thread.subject}</h2>
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

                <div className="flex mt-4">
                    <input
                        type="text"
                        value={newThreadSubject}
                        onChange={(e) => setNewThreadSubject(e.target.value)}
                        placeholder="Enter subject of the new thread..."
                        className="flex-grow border border-gray-300 rounded py-2 px-4"
                    />
                    <button
                        onClick={handleCreateNewThread}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        Create Thread
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
