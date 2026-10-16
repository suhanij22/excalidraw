
"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        let disposed = false;
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZTYwYjQ5NS0zNGYyLTRhN2MtODQ0MC03Nzg3MDhhMWE1NzAiLCJpYXQiOjE3OTIxNDU4NzV9.CA5pbfZZKsYlMcDA-45iIaO4K9vkIi__5X4FsHf1D3c

`);

        ws.onopen = () => {
            if (disposed) {
                ws.close();
                return;
            }

            setSocket(ws); 
            setLoading(false);
        };

        ws.onerror = (event) => {
            if (!disposed) {
                console.error("WebSocket connection failed:", event);
            }
        };

        ws.onclose = () => {
            if (!disposed) {
                setSocket(undefined);
                setLoading(false);
            }
        };

        return () => {
            disposed = true;

            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            } else if (ws.readyState === WebSocket.CONNECTING) {
                ws.addEventListener(
                    "open",
                    () => ws.close(),
                    { once: true }
                );
            }
        };
    }, []);

    return { socket, loading };
}
