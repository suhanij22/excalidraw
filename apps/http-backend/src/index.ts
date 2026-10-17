import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app=express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
}));

app.post("/signup",async (req,res)=>{
    const parsedData=CreateUserSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.json({
            message:"incorrect inputs"
        })
        return ;
    }
    //db call
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name,
            },
        });

        res.json({ userId: user?.id });
    } 
    catch(err)
    {
        res.status(411).json({
            message:"user already exists with this username"
        })
    }
});


app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "incorrect inputs"
        });
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.username,
                password: parsedData.data.password
            }
        });

        if (!user) {
            return res.status(403).json({
                message: "not authorized"
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET
        );

        return res.json({ token });

    } catch (err) {
        console.error("SIGNIN ERROR:", err);

        return res.status(500).json({
            message: "Signin failed"
        });
    }
});


app.post("/room",middleware,async(req,res)=>{
    const parsedData=CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.json({
            message:"incorrect inputs"
        })
        return ;
    }
    const userId= req.userId;
     if (!userId) {
        res.status(401).json({ message: "unauthorized" });
        return;
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId,   // now narrowed to string
            },
        });

        res.json({ roomId: room.id });
    } catch (err) {
        console.error(err);
        res.status(411).json({
            message: "room already exists with this name",
        });
    }
});



app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    const room = await prismaClient.room.findFirst({
      where: { slug },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        slug,
      });
    }

    return res.json({ room });
  } catch (err) {
    console.error("ROOM FETCH ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch room",
    });
  }
});


app.get("/room/id/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID",
        });
    }

    try {
        const room = await prismaClient.room.findUnique({
            where: { id },
        });

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        return res.json({ room });
    } catch (error) {
        console.error("ROOM ID LOOKUP ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch room",
        });
    }
});


app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (!Number.isInteger(roomId) || roomId <= 0) {
    return res.status(400).json({
      message: "Invalid room ID",
    });
  }

  try {
    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
    });

    return res.json({ messages });
  } catch (err) {
    console.error("FETCH CHATS ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch chats",
    });
  }
});

app.listen(3001,()=>{
console.log("3001 running")
});