
"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
       if(canvasRef.current)
       {
        
        initDraw(canvasRef.current);
       }
    }, [canvasRef]);

    return (
        <div style={{ width: "1000px", height: "1000px", margin: 0 }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    backgroundColor: "black",
                    border: "1px solid white",
                }}
            />
            <div className="absolute top-0">
                <button className="bg-white text-black">rectangle</button>
                <br />
                <button className="bg-white text-black">circle</button>
            </div>
        </div>
    );
}
