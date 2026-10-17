
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export type Tool = "rect" | "circle" | "line" | "arrow" | "diamond";

export type Shape =
    | { type: "rect"; x: number; y: number; width: number; height: number }
    | { type: "circle"; centerX: number; centerY: number; radius: number }
    | { type: "line"; x: number; y: number; width: number; height: number }
    | { type: "arrow"; x: number; y: number; width: number; height: number }
    | { type: "diamond"; x: number; y: number; width: number; height: number };

export async function initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    getSelectedTool: () => Tool
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let existingShape: Shape[] = [];

    try {
        existingShape = await getExistingShapes(roomId);
    } catch (error) {
        console.error("Could not load existing shapes:", error);
    }

    // Make the canvas match the visible browser window.
    const resizeCanvas = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Draw using CSS-pixel coordinates, even on high-DPI displays.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        clearCanvas(existingShape, canvas, ctx, width, height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    const getPosition = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();

        return {
            x: (e.clientX - rect.left) * (window.innerWidth / rect.width),
            y: (e.clientY - rect.top) * (window.innerHeight / rect.height),
        };
    };

    const createShape = (
        tool: Tool,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): Shape => {
        const width = x2 - x1;
        const height = y2 - y1;

        switch (tool) {
            case "rect":
                return { type: "rect", x: x1, y: y1, width, height };

            case "circle":
                return {
                    type: "circle",
                    centerX: x1,
                    centerY: y1,
                    radius: Math.hypot(width, height),
                };

            case "line":
                return { type: "line", x: x1, y: y1, width, height };

            case "arrow":
                return { type: "arrow", x: x1, y: y1, width, height };

            case "diamond":
                return { type: "diamond", x: x1, y: y1, width, height };
        }
    };

    const handleMessage = (event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data);

            if (message.type !== "chat") return;

            const parsedMessage = JSON.parse(message.message);
            const shape = parsedMessage.shape ?? parsedMessage;

            if (isShape(shape)) {
                existingShape.push(shape);
                clearCanvas(
                    existingShape,
                    canvas,
                    ctx,
                    window.innerWidth,
                    window.innerHeight
                );
            }
        } catch (error) {
            console.error("Could not process incoming shape:", error);
        }
    };

    socket.addEventListener("message", handleMessage);

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const position = getPosition(e);
        clicked = true;
        startX = position.x;
        startY = position.y;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!clicked) return;

        const position = getPosition(e);

        clearCanvas(
            existingShape,
            canvas,
            ctx,
            window.innerWidth,
            window.innerHeight
        );

        const preview = createShape(
            getSelectedTool(),
            startX,
            startY,
            position.x,
            position.y
        );

        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        drawShape(ctx, preview);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!clicked) return;

        clicked = false;

        const position = getPosition(e);
        const shape = createShape(
            getSelectedTool(),
            startX,
            startY,
            position.x,
            position.y
        );

        existingShape.push(shape);

        clearCanvas(
            existingShape,
            canvas,
            ctx,
            window.innerWidth,
            window.innerHeight
        );

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: "chat",
                    roomId,
                    message: JSON.stringify({ shape }),
                })
            );
        } else {
            console.error("WebSocket is not connected; shape was not saved.");
        }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
        socket.removeEventListener("message", handleMessage);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("resize", resizeCanvas);
    };
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.beginPath();

    switch (shape.type) {
        case "rect":
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            break;

        case "circle":
            ctx.arc(
                shape.centerX,
                shape.centerY,
                shape.radius,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            break;

        case "line":
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.stroke();
            break;

        case "arrow": {
            const x1 = shape.x;
            const y1 = shape.y;
            const x2 = x1 + shape.width;
            const y2 = y1 + shape.height;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLength = 12;

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(
                x2 - headLength * Math.cos(angle - Math.PI / 6),
                y2 - headLength * Math.sin(angle - Math.PI / 6)
            );

            ctx.moveTo(x2, y2);
            ctx.lineTo(
                x2 - headLength * Math.cos(angle + Math.PI / 6),
                y2 - headLength * Math.sin(angle + Math.PI / 6)
            );

            ctx.stroke();
            break;
        }

        case "diamond": {
            const left = Math.min(shape.x, shape.x + shape.width);
            const right = Math.max(shape.x, shape.x + shape.width);
            const top = Math.min(shape.y, shape.y + shape.height);
            const bottom = Math.max(shape.y, shape.y + shape.height);

            ctx.moveTo((left + right) / 2, top);
            ctx.lineTo(right, (top + bottom) / 2);
            ctx.lineTo((left + right) / 2, bottom);
            ctx.lineTo(left, (top + bottom) / 2);
            ctx.closePath();
            ctx.stroke();
            break;
        }
    }
}

function clearCanvas(
    shapes: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) {
    // Clear using the canvas's internal pixel dimensions.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // White workspace.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Subtle grid.
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();

    const gridSize = 25;

    for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }

    ctx.stroke();

    // Existing shapes.
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 2;
    shapes.forEach((shape) => drawShape(ctx, shape));
}

function isShape(value: unknown): value is Shape {
    if (!value || typeof value !== "object") return false;

    const shape = value as Record<string, unknown>;

    switch (shape.type) {
        case "rect":
        case "line":
        case "arrow":
        case "diamond":
            return (
                typeof shape.x === "number" &&
                typeof shape.y === "number" &&
                typeof shape.width === "number" &&
                typeof shape.height === "number"
            );

        case "circle":
            return (
                typeof shape.centerX === "number" &&
                typeof shape.centerY === "number" &&
                typeof shape.radius === "number" &&
                shape.radius >= 0
            );

        default:
            return false;
    }
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = response.data.messages ?? [];

    return messages.flatMap((item: { message: string }) => {
        try {
            const parsed = JSON.parse(item.message);
            const shape = parsed.shape ?? parsed;

            return isShape(shape) ? [shape] : [];
        } catch {
            return [];
        }
    });
}
