
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return null;
        }

        if (!decoded.userId || typeof decoded.userId !== "string") {
            return null;
        }

        return decoded.userId;
    } catch {
        return null;
    }
}

wss.on("listening", () => {
    console.log("WebSocket server listening on port 8080");
});

wss.on("error", (error) => {
    console.error("WebSocket server error:", error);
});

wss.on("connection", (ws, request) => {
    const url = request.url;

    if (!url) {
        ws.close(1008, "Missing URL");
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1] ?? "");
    const token = queryParams.get("token") ?? "";
    const userId = checkUser(token);

    if (!userId) {
        console.log("Invalid JWT token");
        ws.close(1008, "Invalid token");
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws,
    });

    console.log("User connected:", userId);

    ws.on("message", async (data) => {
        try {
            const parsedData = JSON.parse(data.toString());

            if (parsedData.type === "join_room") {
                const roomId = String(parsedData.roomId);
                const user = users.find((x) => x.ws === ws);

                if (user && !user.rooms.includes(roomId)) {
                    user.rooms.push(roomId);
                }

                console.log("Joined room:", roomId);
                return;
            }

            if (parsedData.type === "leave_room") {
                const user = users.find((x) => x.ws === ws);

                if (user) {
                    user.rooms = user.rooms.filter(
                        (room) => room !== String(parsedData.roomId)
                    );
                }

                return;
            }

            if (parsedData.type === "chat") {
                const roomId = Number(parsedData.roomId);
                const message = parsedData.message;

                if (!Number.isInteger(roomId) || roomId <= 0) {
                    console.log("Invalid room ID:", parsedData.roomId);
                    return;
                }

                const room = await prismaClient.room.findUnique({
                    where: { id: roomId },
                });

                if (!room) {
                    console.log("Room not found:", roomId);
                    return;
                }

                await prismaClient.chat.create({
                    data: {
                        roomId,
                        message,
                        userId,
                    },
                });

                users.forEach((user) => {
                    if (
                        user.rooms.includes(String(roomId)) &&
                        user.ws.readyState === WebSocket.OPEN
                    ) {
                        user.ws.send(
                            JSON.stringify({
                                type: "chat",
                                message,
                                roomId,
                            })
                        );
                    }
                });
            }
        } catch (error) {
            console.error("WebSocket message error:", error);
        }
    });

    ws.on("close", () => {
        const index = users.findIndex((user) => user.ws === ws);

        if (index !== -1) {
            users.splice(index, 1);
        }

        console.log("User disconnected:", userId);
    });

    ws.on("error", (error) => {
        console.error("Client WebSocket error:", error);
    });
});
