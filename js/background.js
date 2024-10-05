// Class for creating and managing individual stars
class Star {
    constructor(canvasWidth, canvasHeight) {
        // Initialize star properties with random values
        this.x = Math.random() * canvasWidth; // x position
        this.y = Math.random() * canvasHeight; // y position
        this.speed = Math.random() * 0.3 + 0.1; // movement speed
        this.radius = Math.random() * 0.7 + 0.2; // size of the star
        this.opacity = Math.random() * 0.5 + 0.5; // transparency level
        this.color = this.getRandomColor(); // color of the star
    }

    // Get a random color for the star from a predefined set
    getRandomColor() {
        const colors = ['#FFD700', '#FFFFFF', '#FF69B4', '#00FFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Move the star downwards and reset its position if it goes out of bounds
    move(canvasHeight) {
        this.y += this.speed; // update y position
        if (this.y > canvasHeight) { // if the star moves out of the canvas
            this.y = 0; // reset position to the top
        }
    }

    // Draw the star on the canvas with a shadow effect
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // draw the star as a circle
        ctx.shadowColor = this.color; // set shadow color
        ctx.shadowBlur = 15; // set shadow blur level
        ctx.fillStyle = this.color; // set fill color
        ctx.fill(); // fill the star
        ctx.shadowBlur = 0; // reset shadow blur
    }
}

// Class for creating and managing meteors
class Meteor {
    constructor(canvasWidth, canvasHeight, isFlaming = false) {
        // Initialize meteor properties with random values
        this.x = Math.random() * canvasWidth; // x position
        this.y = Math.random() * canvasHeight * 0.5; // y position (top half of canvas)
        this.length = Math.random() * 100 + 50; // length of the meteor tail
        this.angle = Math.PI / 4; // fixed angle of 45 degrees
        this.speed = Math.random() * 1.5 + 1; // speed of the meteor
        this.opacity = Math.random() * 0.5 + 0.5; // transparency level
        this.isFlaming = isFlaming; // whether the meteor is flaming or not
        this.color = this.isFlaming ? this.getFlamingColor() : '#FFFFFF'; // set color based on flaming status
        this.tailLength = this.length * 0.9; // length of the meteor tail for drawing
    }

    // Get a random flaming color for the meteor from a predefined set
    getFlamingColor() {
        const colors = ['#FF4500', '#FFA500', '#FFD700'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Move the meteor and update its properties
    move() {
        this.x += this.speed * Math.cos(this.angle) + Math.random() * 0.5; // update x position with random variation
        this.y += this.speed * Math.sin(this.angle); // update y position
        this.opacity -= 0.005; // decrease opacity to create fading effect
    }

    // Draw the meteor on the canvas with a gradient tail effect
    draw(ctx) {
        // Draw the meteor tail with a gradient
        const tailX = this.x - this.tailLength * Math.cos(this.angle);
        const tailY = this.y - this.tailLength * Math.sin(this.angle);
        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fade to transparent
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient; // set gradient color for the tail
        ctx.lineWidth = 3; // set line width
        ctx.globalAlpha = this.opacity; // set global alpha for fading effect
        ctx.stroke(); // draw the tail
        ctx.globalAlpha = 1; // reset global alpha

        // Draw the meteor head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // draw the head as a small circle
        ctx.fillStyle = this.color; // set fill color
        ctx.fill(); // fill the head

        // Apply shadow effect if the meteor is flaming
        if (this.isFlaming) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 20;
        }
    }
}

// Class for managing the aurora background and animations
class AuroraBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId); // get the canvas element
        this.ctx = this.canvas.getContext('2d'); // get the 2D drawing context
        this.stars = []; // array to hold stars
        this.meteors = []; // array to hold meteors
// Darker background colors
this.darkBlue = '#000000'; // أقصى درجة من اللون الأسود
this.deepBlue = '#000011'; // لون قريب جدًا من الأسود


        this.starCount = 400; // number of stars
        this.meteorCount = 5; // number of regular meteors
        this.flamingMeteorCount = 2; // number of flaming meteors
        this.init(); // initialize the background
        this.createStyles(); // create styles for the canvas and content
        this.animate(); // start the animation loop
    }

    // Initialize canvas size and create stars and meteors
    init() {
        this.canvas.width = window.innerWidth; // set canvas width to window width
        this.canvas.height = window.innerHeight; // set canvas height to window height
        this.initStars(); // create stars
        this.initMeteors(); // create meteors
        this.applyBodyStyles(); // apply basic body styles
    }

    // Create stars and add them to the array
    initStars() {
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }
    }

    // Create meteors and add them to the array
    initMeteors() {
        for (let i = 0; i < this.meteorCount; i++) {
            this.meteors.push(new Meteor(this.canvas.width, this.canvas.height));
        }

        for (let i = 0; i < this.flamingMeteorCount; i++) {
            this.meteors.push(new Meteor(this.canvas.width, this.canvas.height, true)); // add flaming meteors
        }
    }

    // Create and add CSS styles for the canvas and content
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            canvas {
                position: fixed;  
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                z-index: -1;  
                filter: brightness(60%);  
            }
            .about_content {
                position: absolute;  
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;  
                padding: 0px; 
                background: rgba(0, 0, 0, 0.6);  
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
                color: white;
                text-align: center;
                box-sizing: border-box;  
                overflow: auto; 
            }
        `;
        document.head.appendChild(style);
    }

    // Apply basic styles to the body element
    applyBodyStyles() {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.fontFamily = 'Arial, sans-serif';
    }

    // Draw the gradient background
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.darkBlue); // top color
        gradient.addColorStop(1, this.deepBlue); // bottom color
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // fill the canvas
    }

    // Draw all stars
    drawStars() {
        this.stars.forEach(star => {
            star.move(this.canvas.height); // update star position
            star.draw(this.ctx); // draw the star
        });
    }

    // Draw all meteors and handle their fading
    drawMeteors() {
        this.meteors.forEach((meteor, index) => {
            meteor.move(); // update meteor position
            meteor.draw(this.ctx); // draw the meteor

            // Reset meteor if it fades out
            if (meteor.opacity <= 0) {
                this.meteors[index] = new Meteor(this.canvas.width, this.canvas.height, meteor.isFlaming);
            }
        });
    }

    // Animation loop to update and draw the scene
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas
        this.drawBackground(); // draw the background
        this.drawStars(); // draw stars
        this.drawMeteors(); // draw meteors
        requestAnimationFrame(() => this.animate()); // request next frame
    }
}

// Create a new AuroraBackground instance and start the animation
new AuroraBackground('auroraCanvas');
