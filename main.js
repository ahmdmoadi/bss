let c = document.querySelector("canvas");
let ctx = c.getContext("2d");

c.width = round(window.innerWidth * .9);
c.height = round(window.innerHeight * .45);

//eslint:ignore
let layers = [{ x: 0, y: 0, w: 10, h: 10, c: "black", v: true }];

let tmp = { x: 0, y: 0 }

let md = false;
let hl = {x:0,y:0,w:0,h:0}

let color_select = document.querySelector("input[type=color]")
let current_color = color_select.value;
color_select.addEventListener("change",e=>{
    current_color = e.target.value;
})

c.addEventListener("mousedown", e => {
    md = !0;
    tmp.x = hl.x = e.offsetX;
    tmp.y = hl.y = e.offsetY;
});

c.addEventListener("mousemove",e=>{
    hl.w = e.offsetX-hl.x;
    hl.h = e.offsetY-hl.y;
})

c.addEventListener("mouseup",e=>{
    md=!1;
    // 
    layers.push({x:tmp.x,y:tmp.y,w:e.offsetX-tmp.x,h:e.offsetY-tmp.y,c:current_color,v:true})
});

function init() {
    constructGrid();
}
function constructGrid(inverted=0) {
    let imgData = ctx.getImageData(0,0,c.width,c.height);
    let {data, width, height} = imgData;
    let len = data.length;
    for(let i=0;i<len/4;i++) {
        let r = 4*i+0;
        let g = 4*i+1;
        let b = 4*i+2;
        let a = 4*i+3;
        function set(r,g,b,a) {
            data[4*i]=r;
            data[4*i+1]=g;
            data[4*i+2]=b;
            data[4*i+3]=a;
        }
        let x = i%width;
        // let y = i-(i%width)/width;
        // if(x===10 && y===10)
        // set(255,0,0,255);
        if(x%10!==0) {
            set(0,0,0,255)
        }
    }
    imgData.data=data;
    ctx.putImageData(imgData,0,0);
}constructGrid();
function loop() {
    ctx.clearRect(0,0,c.width,c.height);
    layers.forEach(layer=>{
        ctx.fillStyle = layer.c;
        if(!layer.v)return;
        ctx.fillRect(layer.x,layer.y,layer.w,layer.h);
    });
    if(md) {
        ctx.fillStyle = "rgba(255,0,0,.5)"
        ctx.fillRect(hl.x,hl.y,hl.w,hl.h);
    }
    requestAnimationFrame(loop);
}//loop();