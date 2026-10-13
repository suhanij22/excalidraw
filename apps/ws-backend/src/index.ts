import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,request) {
    const url=request.url;  //what url they were tring to connect to
    //ws://localhost:3000?token=123123
    if(!url)
    {
        return;
    }
    const queryParams=new URLSearchParams(url.split('?')[1]);   //it splits ["ws://localhost:3000","token=123123"]
    const token=queryParams.get('token')||"";

    const decoded= jwt.verify(token,JWT_SECRET);
    if(typeof decoded==='string')
    {
        ws.close();
        return;
    }
    if(!decoded||!decoded.userId)
    {
        ws.close();
        return ;
    }

  ws.on('message', function message(data) {
    ws.send("pong");
  });

}); 