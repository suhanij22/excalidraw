
"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[];
    id: string;
}) {
    const { socket, loading } = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (!socket || loading) return;

        const joinRoom = () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "join_room",
                    roomId: id
                }));
            }
        };

        const handleMessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data);

            if (parsedData.type === "chat") {
                setChats(c => [...c, { message: parsedData.message }]);
            }
        };

        socket.addEventListener("open", joinRoom);
        socket.addEventListener("message", handleMessage);

        // Handle sockets that are already connected.
        joinRoom();

        return () => {
            socket.removeEventListener("open", joinRoom);
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, loading, id]);

    const sendMessage = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket is not connected yet.");
            return;
        }

        if (!currentMessage.trim()) return;

        socket.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }));

        setCurrentMessage("");
    };

    return (
        <div>
            {chats.map((m, index) => (
                <div key={index}>{m.message}</div>
            ))}

            <input
                type="text"
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") sendMessage();
                }}
            />

            <button
                onClick={sendMessage}
                disabled={!socket || socket.readyState !== WebSocket.OPEN}
            >
                Send message
            </button>
        </div>
    );
}
