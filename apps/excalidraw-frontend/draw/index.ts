
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
    | {
          type: "rect";
          x: number;
          y: number;
          width: number;
          height: number;
      }
    | {
          type: "circle";
          centerX: number;
          centerY: number;
          radius: number;
      };

export async function initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket
) {
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let existingShape: Shape[] = await getExistingShapes(roomId);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";

    clearCanvas(existingShape, canvas, ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);

            // Ignore malformed or unsupported shapes.
            const shape: Shape = parsedShape.shape ?? parsedShape;

            existingShape.push(shape);
            clearCanvas(existingShape, canvas, ctx);
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        clicked = true;

        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!clicked) return;

        clicked = false;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width: currentX - startX,
            height: currentY - startY,
        };

        existingShape.push(shape);
        clearCanvas(existingShape, canvas, ctx);

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: "chat",
                    roomId,
                    message: JSON.stringify({ shape }),
                })
            );
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!clicked) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = currentX - startX;
        const height = currentY - startY;

        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeRect(startX, startY, width, height);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Return cleanup so listeners can be removed on unmount.
    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
    };
}

function clearCanvas(
    existingShape: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShape.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.strokeRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height
            );
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(
                shape.centerX,
                shape.centerY,
                shape.radius,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
    const response = await axios.get(
        `${HTTP_BACKEND}/chats/${roomId}`
    );

    const messages = response.data.messages;

    return messages.flatMap((x: { message: string }) => {
        try {
            const messageData = JSON.parse(x.message);
            const shape = messageData.shape ?? messageData;

            if (shape.type === "rect" || shape.type === "circle") {
                return [shape as Shape];
            }

            return [];
        } catch {
            return [];
        }
    });
}
