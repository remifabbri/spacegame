var canvas, 
    ctx,
    shipPlayerCordX,
    shipPlayerCordY,
    shipPlayerH = 45,
    shipPlayerW = 40,
    backgroundBackY = 0, 
    backgroundBackY2 = -4096,
    timer,
    timerLaser,
    countLaser = 0 

var clearRect = function(){
    ctx.clearRect(0,0,400, 600); 
}

var backgroundGame = function(){
    ctx.drawImage(backgroundCanvasBack, -1000, backgroundBackY);
    ctx.drawImage(backgroundCanvasBack, -1000, backgroundBackY2);
     
    if(backgroundBackY > 4096){
        backgroundBackY = -4095.5; 
    }
    if(backgroundBackY2 > 4096){
        backgroundBackY2 = -4095.5; 
    }

    backgroundBackY += 0.5; 
    backgroundBackY2 += 0.5; 
}

// vaisseau du joueur -----------------------------------

var shipPlayer = function(){ //function qui dessine le vaisseau du joueur sur le canvas 
    ctx.drawImage(shipPlayerImg, shipPlayerCordX, shipPlayerCordY);
}

var arrayLaser = [];

var pushLaser = function(){
    arrayLaser.push(new Laser(shipPlayerCordX, shipPlayerCordY)); 
}

var Laser = function(cordX, cordY){
    this.cordXLaser = cordX + shipPlayerH/2; 
    this.cordYLaser = cordY;
    
    this.drawShot = function(){
        ctx.fillRect(this.cordXLaser, this.cordYLaser, 2, 10); 
        ctx.fillStyle = "rgb(0,255,0)";
        this.cordYLaser -=15; 
    }
}

var laserOnScreen = function(){
    for(i=0; i<arrayLaser.length; i++){
        arrayLaser[i].drawShot();

        if(arrayLaser[i].cordYLaser <= 100){
            arrayLaser.splice([i], 1); 
        }
    }
}
/********************************************************************/
/************ Vaisseaux Ennemis *************************************/


var ShipEnnemyChasseur = function(){ // function constructeur chasseur ennemi 
    this.imgEC = new Image();
    this.imgEC.src = './assets/files/PixelSpaceships/red_03T.png';
    this.life = 500;
    this.cordXEC = 10;
    this.cordYEC = 10;
    this.arrayLaserEC = [];
    
    this.drawEC = function(){ 
        ctx.drawImage(this.imgEC, this.cordXEC, this.cordYEC);
        this.cordXEC +=1;
        this.cordYEC +=1;
    };

    this.drawLaserEC = {
        cordXLaserEC : 0,
        cordYLaserEC : 0,
    
        drawShotEC : function(){
            ctx.fillRect(this.cordXLaserEC, this.cordYLaserEC, 2, 10),
            ctx.fillStyle = "rgb(0,0,255)",
            this.cordYLaserEC += 5
        }
    }
    
    this.pushLaserEC = function(){
        /**
        Object.create(prototypeDeObjetACreer, objetDeDefinitionDeProprietes)
        prototypeDeObjetACreer : est l'objet qui sera le prototype de l'objet créé
        objetDeDefinitionDeProprietes: objet telle que décrit dans la doc qui décrit la nature des propriétés propres de l'objet à créer
        **/
    
        // Ici on ajoute dans le tableau un objet qui à pour prototype this.drawLaserEC et qui a pour propriété propres cordXLaserEC avec la valeur indiquée et cordYLaserEC avec la valeur indiquée.
        this.arrayLaserEC.push(Object.create(this.drawLaserEC, {
          cordXLaserEC: {
            value: this.cordXEC + 20,
            configurable: true,
            enumerable: true,
            writable: true
          },
          cordYLaserEC: {
            value: this.cordYEC + 45,
            configurable: true,
            enumerable: true,
            writable: true
          }
        }));
    }

    this.laserOnScreenEC = function(){
        for(i=0; i<this.arrayLaserEC.length; i++){
            this.arrayLaserEC[i].drawShotEC(); 

            if(this.arrayLaserEC[i].cordYLaserEC >= 600){
                this.arrayLaserEC.splice([i], 1); 
            }
        }
    }
}

var arrayEnnemyEC = [];

var gestionEnnemyEc = function (){

    if(timer == undefined || (Date.now() - timer) >= 2000){
        
        if(arrayEnnemyEC.length<5){
            arrayEnnemyEC.push(new ShipEnnemyChasseur());
        }
        
        timer = Date.now(); 
    }
    for (var i=0; i < arrayEnnemyEC.length; i++){
        arrayEnnemyEC[i].drawEC();
    }
    
    for (var i=0; i < arrayEnnemyEC.length; i++){
       
        //console.log(arrayEnnemyEC[i].arrayLaserEC);

        if(arrayEnnemyEC[i].arrayLaserEC.length < 5){

            countLaser+=1; 
            if(countLaser == 30 ){
                arrayEnnemyEC[i].pushLaserEC();
                //countLaser+=1;
                console.log(" 1 ---------------- if"); 
            }
            if(countLaser > 30){
                countLaser = 0; 
            }

        }

        for (y=0; y<arrayEnnemyEC[i].arrayLaserEC.length; y++){
            arrayEnnemyEC[i].laserOnScreenEC(); 
            //console.log(arrayEnnemyEC[i]); 
        }
    }
}

/********************************************************************/

var init = function(){ // Initialisation du canvas
    canvas = document.querySelector('canvas'); 
    ctx = canvas.getContext('2d');
    backgroundCanvasBack = new Image(); 
    backgroundCanvasBack.src = './assets/files/Background/Nebula Aqua-Pink.png';
    shipPlayerImg = new Image();
    shipPlayerImg.src = './assets/files/PixelSpaceships/blue_05.png'; 
    console.log(shipPlayerImg); 
    pushLaser(); 
    moteurJeux(); // function récurcive 
}

var moteurJeux = function(){
    clearRect();
    backgroundGame();
    shipPlayer();
    pushLaser(); 
    laserOnScreen();
    gestionEnnemyEc(); 
    //console.log(arrayEnnemyEC); 
    //console.log(arrayEnnemyEC.arrayLaserEC);
    moteur = setTimeout(moteurJeux, 1000/30); 
}

init();


// Déplacement du vaiseaux Joueur ------------------------

canvas.addEventListener('mousemove', function(evt){ 
    shipPlayerCordX = evt.clientX - canvas.offsetLeft - shipPlayerH/2;  
    shipPlayerCordY = evt.clientY - canvas.offsetTop - shipPlayerW/2; 
    //console.log(shipPlayerCordY);  
})

