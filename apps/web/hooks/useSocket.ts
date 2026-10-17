
"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        let disposed = false;
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/signin";
            return;
        }

        const ws = new WebSocket(
            `${WS_URL}?token=${encodeURIComponent(token)}`
        );
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
