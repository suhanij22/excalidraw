
"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/signin";
            return;
        }

        const ws = new WebSocket(
            `${WS_URL}?token=${encodeURIComponent(token)}`
        );

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        };

        ws.onerror = () => {
    console.error("WebSocket connection failed:", WS_URL);
};

ws.onclose = (event) => {
    console.log("WebSocket close code:", event.code);
    console.log("WebSocket close reason:", event.reason);
    console.log("Was connection clean?", event.wasClean);
    setSocket(null);
};

        return () => {
            ws.close();
        };
    }, []);

    if (!socket) {
        return <div>Connecting to server...</div>;
    }

    return <Canvas socket={socket} roomId={roomId} />;
}
