var canvas, 
    ctx,
    shipPlayerCordX,
    shipPlayerCordY,
    shipPlayerH = 45,
    shipPlayerW = 40,
    bulletPlayer,
    bulletEnnemy, 
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
    this.cordXLaser = cordX + shipPlayerH/2 - 1.5; 
    this.cordYLaser = cordY - shipPlayerW/3;
    
    this.drawShot = function(){
        ctx.drawImage(bulletPlayer, this.cordXLaser, this.cordYLaser);
        this.cordYLaser -=15; 
    }
}

var laserOnScreen = function(){
    for(i=0; i<arrayLaser.length; i++){
        arrayLaser[i].drawShot();

        if(arrayLaser[i].cordYLaser <= 0){
            arrayLaser.splice([i], 1); 
        }
    }
}
/********************************************************************
******* Vaisseaux Ennemis *******************************************
********************************************************************/

//Chasseur Ennemie 

var posShipX = -50,   // position par défaut
    posShipY = -50

var ShipEnnemyChasseur = function(posShipX, posShipY){ // function constructeur chasseur ennemi 
    this.imgEC = new Image();
    this.imgEC.src = './assets/files/PixelSpaceships/red_03T.png';
    this.life = 50;
    this.cordXEC = posShipX;
    this.cordYEC = posShipY;
    this.arrayLaserEC = [];
    
    this.drawEC = function(){ 
        ctx.drawImage(this.imgEC, this.cordXEC, this.cordYEC);
        if(this.life < 50){
            ctx.fillRect(this.cordXEC, this.cordYEC, this.life, 3 );
            ctx.fillStyle= "#ff0000"; 
        }
        this.cordXEC +=1;
        this.cordYEC +=1.5;
    };

    this.drawLaserEC = {
        cordXLaserEC : 0,
        cordYLaserEC : 0,
    
        drawShotEC : function(){
            ctx.drawImage(bulletEnnemy, this.cordXLaserEC, this.cordYLaserEC);
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


/*******************************GESTION DE JEU */

var arrayEnnemyEC = [],
    countProdEnnemyEC = 0

var gestionEnnemyEc = function (){

    if( arrayEnnemyEC.length < 5){
        console.log("posShipX ----"+posShipX+"  posShipY -------"+posShipY );
        arrayEnnemyEC.push(new ShipEnnemyChasseur(posShipX, posShipY));
        posShipX = Math.random()*posShipX - 80;
        posShipY = Math.random()*posShipY - 100;
        countProdEnnemyEC +=1; 
        //console.log(countProdEnnemyEC); 
        if(countProdEnnemyEC == 5){
            posShipX = -80;
            posShipY = -80;
            countProdEnnemyEC = 0;
            //console.log("posShipX ----"+posShipX+"  posShipY -------"+posShipY ); 
        }
    }
    
    for (var i=0; i < arrayEnnemyEC.length; i++){
        arrayEnnemyEC[i].drawEC();
    }
    
    for (var i=0; i < arrayEnnemyEC.length; i++){
       
        if(arrayEnnemyEC[i].cordYEC >= 600){
            arrayEnnemyEC.splice([i], 1); 
        }
        //console.log(arrayEnnemyEC[i]);

        if(arrayEnnemyEC[i].arrayLaserEC.length < 5){

            countLaser+=1; 
            if(countLaser == 30 ){
                arrayEnnemyEC[i].pushLaserEC();
                //countLaser+=1;
                
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

var colision = function(){
    // Gestion des colision des laser du joueur avec les chasseursEnnemy
    for(var f=0; f<arrayLaser.length-2; f++){ // Parcour la table des lasers du joueur (-2 sur le length permet d'eviter le bug (cordXLaser is not defined))
        for(var g=0; g < arrayEnnemyEC.length; g++){ //Parcour la table des chasseursEnnemy 
            //console.log(arrayLaser[f].cordXLaser); 

            if(arrayLaser[f].cordXLaser > arrayEnnemyEC[g].cordXEC && arrayLaser[f].cordXLaser < arrayEnnemyEC[g].cordXEC + 43  && arrayLaser[f].cordYLaser > arrayEnnemyEC[g].cordYEC  && arrayLaser[f].cordYLaser < arrayEnnemyEC[g].cordYEC + 50){
                arrayEnnemyEC[g].life -= 5; 
                if(arrayEnnemyEC[g].life <= 0){
                    arrayEnnemyEC.splice([g], 1);
                }
                
                arrayLaser.splice([f], 1); 
                console.log('touché !!!!'); 
            }
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
    bulletPlayer = new Image(); 
    bulletPlayer.src = './assets/files/Blue/bullet2.png';
    bulletEnnemy = new Image(); 
    bulletEnnemy.src = './assets/files/Red/bullet_red2.png';  
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
    colision();
    
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

