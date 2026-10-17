type Shape={
    type:"rect";
    x:number;
    y:number;
    width:number;
    height:number
}|{
    type:"circle";
    centerX:number;
    centerY:number;
    radius:number
}
export function initDraw(canvas:HTMLCanvasElement)
{
        const ctx = canvas.getContext("2d");
        
        let existingShape:Shape[]=[];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if(!ctx)
        {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.strokeStyle = "white";

        let clicked = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener("mousedown", (e) => {
            clicked = true;

            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        });

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            const width = currentX - startX;
            const height = currentY - startY;

            existingShape.push({
                type:"rect",
                x:startX,
                y:startY,
                height,
                width
            })
        });

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                const rect = canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                const width = currentX - startX;
                const height = currentY - startY;

                clearCanvas(existingShape,canvas,ctx);
               
                ctx.strokeRect(startX, startY, width, height);
            }
        });
}

function clearCanvas(existingShape:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     ctx.fillRect(0,0,canvas.width,canvas.height);

     existingShape.map((shape)=>{
        if(shape.type==='rect')
        {
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
     })
}