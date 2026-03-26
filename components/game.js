let canvasWidth = 360;
let canvasHeight = 640;
let canvas;
let context;

let groundY = 576;

let birdWidth = 34;
let birdHeight = 24;
let birdX = canvasWidth/11;
let birdY = canvasHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipeArray = []
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = canvasWidth;
let pipeY = 0; 
let topPipeImg;
let bottomPipeImg;
let velocityX = 0;

let velocityY = 0;
let g = 0;

let started = false;
let gameover = false;
let dead = false;

let pipeGap = 120;

let score = 0;
let highScore = 0;

window.onload = () => {

    canvas = document.getElementById('canvas')    
    context = canvas.getContext('2d');

    birdImg = new Image();
    birdImg.src = "../assets/flappybird.png";
    birdImg.onload = () => {
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    };

    topPipeImg = new Image();
    topPipeImg.src = "../assets/toppipe.png"
    bottomPipeImg = new Image();
    bottomPipeImg.src = "../assets/bottompipe.png"

    setInterval(placePipes, 1500)

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handlePress);

    requestAnimationFrame(update)
}
const customFont = new FontFace('Arcade','url(./assets/arcadeclassic/ARCADECLASSIC.TTF)')
customFont.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
})

function update()
{
    context.clearRect(0,0,canvasWidth,canvasHeight);
    requestAnimationFrame(update);
    
    if (birdY >= groundY-60 && started==true)
    {
        birdY = groundY-60;
        velocityX = 0;
        velocityY = 0;
        gameover = true;
        dead = true;
    }
    else
    {
        if (gameover == false)
        {
            velocityY = velocityY + g
            birdY += velocityY
        }
    }



    context.drawImage(birdImg,birdX,birdY,birdWidth,birdHeight);

    if (!gameover)
    {
        for (let i = 0; i< pipeArray.length; i++)
        {
            let pipes = pipeArray[i];
            pipes[0].x += velocityX;
            pipes[1].x += velocityX;
            context.drawImage(pipes[0].img,pipes[0].x,pipes[0].y,pipes[0].width,pipes[0].height);
            context.drawImage(pipes[1].img,pipes[1].x,pipes[1].y,pipes[1].width,pipes[1].height);
            
            if (pipes[0].x <= birdX && pipes[0].passed == false && !dead)
            {
                pipes[0].passed = true;
                pipes[1].passed = true;
                score += 1
            }

            if (birdX < pipes[0].x + pipeWidth && birdX + birdWidth > pipes[0].x && ( birdY < pipes[0].y + pipeHeight || birdY + birdHeight > pipes[1].y))
                {
                    dead = true;
                    velocityX = 0
                }
            }

            if (score >= highScore)
            {
                highScore = score;
            }



            if (started == false)
            {
                context.fillStyle = "white";
                context.font = "50px 'Arcade'";
                context.fillText("The  Flappiest",15,55);
                context.fillText("Of  Birds",65,105);
                context.font = "30px 'Arcade'";
                context.fillText("Click   SPACE   to   Start!", 20, 175)
            }
            else
            {
                if (gameover != true)
                {
                    context.fillStyle = "white";
                    context.font = "50px 'Arcade'";
                    context.fillText("Score: " + score, 90, 55);
                    context.font = "30px 'Arcade'";
                    context.fillText("Best Score: " + highScore, 90, 105)
                }
            }
    }

    else
    {
        if (gameover==true && started==true)
        {
            context.clearRect(0,0,canvasWidth,300)
            context.fillStyle = "white";
            context.font = "50px 'Arcade'";
            context.fillText("You   Died!",65,55);
            context.font = "30px 'Arcade'";
            context.fillText("Your   Score: " +score, 85, 105)
            context.fillText("Your  Best  Score: " +highScore, 50, 155)
            context.fillText("Press  Space  to",70,205);
            context.fillText("Start again!",90,225)
        }
    }
} 

function placePipes()
{
    if (started == true && gameover != true)
    {
        let randomY = pipeY - canvasHeight/6 - Math.random() * pipeHeight/1.49;

        let topPipe = {
            img: topPipeImg,
            x: pipeX,
            y: randomY,
            width: pipeWidth,
            height: pipeHeight,
            passed: false
        }

        let bottomPipe = {
            img: bottomPipeImg,
            x: pipeX,
            y: randomY + pipeHeight + pipeGap,
            width: pipeWidth,
            height: pipeHeight,
            passed: false
        }

        pipeArray.push([topPipe, bottomPipe])

    }
}

function handleKey(event)
{
    if (event.key == ' ')
    {
        if (!started && !dead)
        {
            started = true;
            gameover = false;
            velocityY = -3;
            velocityX = -2;
            g = 0.1;
        }
        else if (gameover && dead)
        {
            restartGame();
        }
        else if (!dead)
        {
            velocityY = -3;
        }
    }
}

function restartGame()
{
    birdY = bird.y;
    velocityY = 0;
    velocityX = -2;
    g = 0.1;

    pipeArray = [];
    score = 0;

    gameover = false;
    dead = false;
}

function handlePress()
{
    if (!started && !dead)
    {
        started = true;
        gameover = false;
        velocityY = -3;
        velocityX = -2;
        g = 0.1;
    }

    else if (gameover && dead)
    {
        restartGame();
    }
    
    else if (!dead)
    {
        velocityY = -3;
    }
}