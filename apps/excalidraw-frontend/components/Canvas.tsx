
"use client";

import { initDraw, type Tool } from "@/draw";
import { useEffect, useRef, useState } from "react";

export function Canvas({
    roomId,
    socket,
}: {
    roomId: string;
    socket: WebSocket;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const selectedToolRef = useRef<Tool>("rect");
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");
    const [zoom, setZoom] = useState(100);

    const tools: { label: string; value: Tool; icon: string }[] = [
        { label: "Rectangle", value: "rect", icon: "▱" },
        { label: "Circle", value: "circle", icon: "○" },
        { label: "Line", value: "line", icon: "╱" },
        { label: "Arrow", value: "arrow", icon: "↗" },
        { label: "Diamond", value: "diamond", icon: "◇" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let cancelled = false;
        let cleanup: (() => void) | undefined;

        initDraw(
            canvas,
            roomId,
            socket,
            () => selectedToolRef.current
        )
            .then((dispose) => {
                if (cancelled) dispose?.();
                else cleanup = dispose;
            })
            .catch((error) => {
                console.error("Canvas initialization failed:", error);
            });

        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, [roomId, socket]);

    function chooseTool(tool: Tool) {
        selectedToolRef.current = tool;
        setSelectedTool(tool);
    }

    return (
        <main className="fixed inset-0 overflow-hidden bg-[#f4f5f8]">
            {/* Full-screen drawing workspace */}
            <div className="absolute inset-0">
                <canvas
                    ref={canvasRef}
                    className="block h-full w-full bg-white"
                    style={{
                        touchAction: "none",
                    }}
                />
            </div>


            {/* Drawing toolbar */}
            <div className="absolute left-1/2 top-4 z-10 flex max-w-[95vw] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-lg">
                {tools.map((tool) => (
                    <button
                        key={tool.value}
                        type="button"
                        title={tool.label}
                        aria-label={tool.label}
                        onClick={() => chooseTool(tool.value)}
                        className={`flex h-10 items-center gap-2 rounded-xl px-3 transition ${
                            selectedTool === tool.value
                                ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <span className="text-xl">{tool.icon}</span>
                        <span className="hidden text-sm sm:inline">
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={() => setZoom((z) => Math.max(50, z - 10))}
                    className="h-9 w-9 rounded-lg text-lg text-gray-700 hover:bg-gray-100"
                >
                    −
                </button>

                <span className="min-w-12 text-center text-sm text-gray-700">
                    {zoom}%
                </span>

                <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={() => setZoom((z) => Math.min(150, z + 10))}
                    className="h-9 w-9 rounded-lg text-lg text-gray-700 hover:bg-gray-100"
                >
                    +
                </button>
            </div>
        </main>
    );
}
