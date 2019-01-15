var canvas, 
    ctx,
    shipPlayerCordX,
    shipPlayerCordY,
    shipPlayerH = 45,
    shipPlayerW = 40,
    backgroundBackY = 0, 
    backgroundBackY2 = -4096,
    timer,
    timerLaser

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
    this.cordXEC = 50;
    this.cordYEC = 50;
    this.arrayLaserEC = [];
    
    this.drawEC = function(){ 
        ctx.drawImage(this.imgEC, this.cordXEC, this.cordYEC);
        this.cordXEC +=1;
        this.cordYEC +=1;
    };

    // Design pattern : Fonction usine
    this.drawLaserECFactory = (function(){ //IFE

        // Fonction constructeur
        var DrawLaserEC = function(cordXLaserEC, cordYLaserEC){
            this.cordXLaserEC = cordXLaserEC;
            this.cordYLaserEC = cordYLaserEC;
        }

        // Methode dans le prototype de la Fonction constructeur
        DrawLaserEC.prototype.drawShotEC = function(){
            ctx.fillRect(this.cordXLaserEC, this.cordYLaserEC, 2, 10),
            ctx.fillStyle = "rgb(0,0,255)",
            this.cordYLaserEC += 1
        }

        // Valeur de retour de l'IFE
        return function(cordXLaserEC, cordYLaserEC){
            // Fonction usine (retourne une nouvelle instance de DrawLaserEC)
            return new DrawLaserEC(cordXLaserEC, cordYLaserEC);
        }

    }()); // Fin de l'IFE

    /**
    this.drawLaserECFactory contient au final :
    function(cordXLaserEC, cordYLaserEC){
    return new DrawLaserEC(cordXLaserEC, cordYLaserEC);
    }
    **/

    // Fonction qui execute la fonction usine en lui fournissant les valeurs attendues
    this.drawLaserEC = function(){
        var cordXLaserEC = this.cordXEC+this.cordXEC/2;
        var cordYLaserEC = this.cordYEC;

        return this.drawLaserECFactory(cordXLaserEC, cordYLaserEC);
    };

    this.pushLaserEC = function(){
        // Ajoute dans le tableau un nouvel objet
        this.arrayLaserEC.push(this.drawLaserEC());
        /** Lorsqu'on exécute this.drawLaserEC, on calcule cordXLaserEC et cordYLaserEC, puis on exécute this.drawLaserECFactory qui va créer une nouvelle instance de DrawLaserEC et retourner à this.drawLaserEC qui la retourne au niveau supérieur et .push l'ajoute dans le tableau.**/
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

    
    //console.log("timer -------------" + timer);
    if(timer == undefined || (Date.now() - timer) >= 2000){
        
        if(arrayEnnemyEC.length<5){
            arrayEnnemyEC.push(new ShipEnnemyChasseur());
        }
        
        //console.log(Date.now() - timer); 
        timer = Date.now(); 
    }
    //var timer = Date.now(); 
    //console.log(timer); 
    
    
    for (var i=0; i < arrayEnnemyEC.length; i++){
        arrayEnnemyEC[i].drawEC();
        //console.log(arrayEnnemyEC);
        //arrayEnnemyEC[i].pushLaserEC();
        console.log(arrayEnnemyEC[i].arrayLaserEC);
        if(arrayEnnemyEC[i].arrayLaserEC.length < 5){
            //if(timerLaser == undefined || (Date.now() - timerLaser) >= 2000){
                arrayEnnemyEC[i].pushLaserEC();
                timerLaser = Date.now(); 
            //}
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






