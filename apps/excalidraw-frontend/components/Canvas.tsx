
"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({
    roomId,
    socket,
}: {
    roomId: string;
    socket: WebSocket;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        let cleanup: (() => void) | undefined;
        let cancelled = false;

        initDraw(canvas, roomId, socket).then((dispose) => {
            if (cancelled) {
                dispose?.();
            } else {
                cleanup = dispose;
            }
        });

        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, [roomId, socket]);

    return (
        <div
            className="relative"
            style={{ width: "1000px", height: "1000px" }}
        >
            <canvas
                ref={canvasRef}
                width={1000}
                height={1000}
                style={{
                    display: "block",
                    backgroundColor: "black",
                    border: "1px solid white",
                }}
            />

            <div className="absolute top-4 left-4 flex gap-2">
                <button
                    type="button"
                    className="bg-white text-black px-3 py-1 rounded"
                >
                    Rectangle
                </button>

                <button
                    type="button"
                    className="bg-white text-black px-3 py-1 rounded"
                >
                    Circle
                </button>
            </div>
        </div>
    );
}
