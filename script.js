const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth ;
ctx.canvas.height = window.innerHeight;
const mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove',(e)=>{
    mouse.x=e.x;
    mouse.y=e.y;
})

const image = new Image();
image.src='images/simmu.jpg'


image.addEventListener('load',()=>{
 
    ctx.drawImage(image, 0, 0, 70, 87);
    const dataCoord = ctx.getImageData(0, 0, 70, 87);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let particleArray=[]
    
    class Particle{
        constructor(x,y,r,g,b){
            this.x = x;
            this.y = y;
            this.size = 3;
            this.r=r;
            this.g=g;
            this.b=b;
            this.baseX=x;
            this.baseY=y;
            this.density=Math.random() * 40 + 1;
        }

        draw(){
            ctx.beginPath();
            ctx.fillStyle=`rgb(${this.r}, ${this.g}, ${this.b})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update(){
            let dx =mouse.x-this.x
            let dy = mouse.y-this.y
            let distance= Math.sqrt(dx * dx + dy * dy)
            let forceDirectionX = dx / distance;
            let forceDistanceY = dy / distance;
            let force = (mouse.radius - distance)/mouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDistanceY * force * this.density;

            if (distance < mouse.radius){
                this.x-=directionX;
                this.y-=directionY;  
            }
            else{
                if(this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/10;
                }
    
                if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -=dy/10;
                }
            }
        }

    }

    function init(){
    
        for (let y=0; y< dataCoord.height; y++){
            for (let x=0; x< dataCoord.width; x++){
                let red=dataCoord.data[(y * 4* dataCoord.width) + (x*4)]
                let green=dataCoord.data[(y*4*dataCoord.width)+(x*4)+ 1]
                let blue = dataCoord.data[(y*4*dataCoord.width)+(x*4)+2]
                particleArray.push(new Particle(x*7+200,y*7+15, red, green, blue))
            }
        }
    }

    function animate(){
        ctx.clearRect( 0, 0, canvas.width, canvas.height);
        
        for (let i=0; i< particleArray.length; i++){
            particleArray[i].draw();
            particleArray[i].update();
        }

        requestAnimationFrame(animate);
    }
    init();
    animate();
})





