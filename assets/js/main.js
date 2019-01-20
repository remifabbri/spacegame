console.log('v0.1.1'); 

// Variable Global du jeu 
var canvas,
    ctx,
    heightCanvas = window.innerHeight -2, 
    widthCanvas,
    backgroundBackY = 0, 
    backgroundBackY2 = -4096,
    bulletEnnemy, 
    timer,
    timerLaser,
    countLaserTank= 0, 
    score = 0

    if (window.innerWidth > 992){
        widthCanvas = window.innerWidth/2;
    }else{
        widthCanvas = window.innerWidth;
    }

var clearRect = function(){
    ctx.clearRect(0,0,widthCanvas, heightCanvas); 
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

// varaible Global joueur
var shipPlayerCordX,
    shipPlayerCordY,
    shipPlayerH = 45,
    shipPlayerW = 40,
    bulletPlayer, 
    arrayLaser = [],
    countLaserPlayer = 0

var shipPlayer = function(){ //function qui dessine le vaisseau du joueur sur le canvas 
    ctx.drawImage(shipPlayerImg, shipPlayerCordX, shipPlayerCordY);
}

var pushLaser = function(){
    countLaserPlayer += 1;
    if(countLaserPlayer >= 2){
        arrayLaser.push(new Laser(shipPlayerCordX, shipPlayerCordY));
        countLaserPlayer = 0; 
    }
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


var arrayEnnemyEC = [], // array de tout les ennemis
    posShipX = widthCanvas,   // position par défaut
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

            if(this.arrayLaserEC[i].cordYLaserEC >= heightCanvas){
                this.arrayLaserEC.splice([i], 1); 
            }
        }
    }
}

var arrayEnnemyT = [], // array de tout les tanker
    posTankX = widthCanvas/2,
    posTankY = -75

var ShipEnnemyTank = function(posTankX, posTankY){ // function constructeur chasseur ennemi 
    this.imgT = new Image();
    this.imgT.src = './assets/files/PixelSpaceships/tankbase_02.png';
    this.life = 50;
    this.cordX = Math.random()*posTankX+posTankX/4;
    this.cordY = posTankY;
    this.arrayLaserEC = [];
    
    this.drawEC = function(){ 
        ctx.drawImage(this.imgT, this.cordX, this.cordY);
        if(this.life < 50){
            ctx.fillRect(this.cordX, this.cordY, this.life, 3 );
            ctx.fillStyle= "#ff0000"; 
        } 
        this.cordX +=0;
        this.cordY +=1;
    };

    this.drawLaserEC = {
        cordXLaserEC : 0,
        cordYLaserEC : 0,
    
        drawShotEC : function(){
            ctx.drawImage(bulletEnnemy, this.cordXLaserEC, this.cordYLaserEC);
            this.cordYLaserEC += 10
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
            value: this.cordX + 20,
            configurable: true,
            enumerable: true,
            writable: true
          },
          cordYLaserEC: {
            value: this.cordY + 45,
            configurable: true,
            enumerable: true,
            writable: true
          }
        }));
    }

    this.laserOnScreenEC = function(){
        for(i=0; i<this.arrayLaserEC.length; i++){
            this.arrayLaserEC[i].drawShotEC(); 

            if(this.arrayLaserEC[i].cordYLaserEC >= heightCanvas){
                this.arrayLaserEC.splice([i], 1); 
            }
        }
    }
}


/*******************************GESTION DE JEU */


var tableEnnemyCommune = [],
    tableShotEnnemyCommue,
    countProdEnnemyEC = 0,
    countLaserEC = 0

var gestionEnnemy = function (){

    // création des ennemy 
    if( arrayEnnemyEC.length < 5){
        arrayEnnemyEC.push(new ShipEnnemyChasseur( Math.random()*posShipX, posShipY));
        countProdEnnemyEC +=1; 

        if(countProdEnnemyEC == 5){
            countProdEnnemyEC = 0;
        }
    }
    if( arrayEnnemyT.length <= 0){
        arrayEnnemyT.push(new ShipEnnemyTank(posTankX, posTankY)); // création du vaiseau  
    }

    // communtativité des tableau pour un traitement generale

    tableEnnemyCommune = arrayEnnemyEC.concat(arrayEnnemyT); 
    
    for (var i=0; i < tableEnnemyCommune.length; i++){
        tableEnnemyCommune[i].drawEC();
    }
    
    // création des trire ennemy 
     
    for (var i=0; i < arrayEnnemyEC.length; i++){ // création shot EC
       
        if(arrayEnnemyEC[i].arrayLaserEC.length < 5){

            countLaserEC+=1; 
            if(countLaserEC == 30 ){
                arrayEnnemyEC[i].pushLaserEC();
            }
            if(countLaserEC > 30){
                countLaserEC = 0; 
            }
        }
        tableShotEnnemyCommue = (arrayEnnemyEC[i].arrayLaserEC).concat(arrayEnnemyEC[i].arrayLaserEC);
    }

    for (var i=0; i < arrayEnnemyT.length; i++){ // création shot Tank

        if (arrayEnnemyT <= 0){
            gestionEnnemy(); // peut-etre mettre un retrun ici !!!!
        }

        countLaserTank+=1; 
        if(countLaserTank == 50 ){
            arrayEnnemyT[i].pushLaserEC();
            arrayEnnemyT[i].pushLaserEC(); 
            arrayEnnemyT[i].pushLaserEC(); 
            arrayEnnemyT[i].pushLaserEC();
            arrayEnnemyT[i].pushLaserEC();  
        }
        if(countLaserTank > 50){
            countLaserTank = 0; 
        }
        tableShotEnnemyCommue = tableShotEnnemyCommue.concat( arrayEnnemyT[i].arrayLaserEC); 

    }
    console.log(tableShotEnnemyCommue); 
    for (y=0; y<tableShotEnnemyCommue.length; y++){
        tableShotEnnemyCommue[i].drawShotEC(); 
    }
/*
        if(arrayEnnemyEC[i].cordYEC >= heightCanvas){
            arrayEnnemyEC.splice([i], 1); 
        }
        if(arrayEnnemyT[i].cordY >= heightCanvas){ // détection de sorti en Y du canvas
            arrayEnnemyT.splice([i], 1); // suppression du tableau
        }*/

        
    
}

var countProdEnnemyTank = 0,
    countLaserTank = 0

var gestionEnnemyTank = function (){
    
    
    
    
    for (var i=0; i < arrayEnnemyT.length; i++){
       
        for (y=0; y<arrayEnnemyT[i].arrayLaserEC.length; y++){
            arrayEnnemyT[i].laserOnScreenEC(); 
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
                    score = score + 10;
                }
                
                arrayLaser.splice([f], 1); 
                //console.log('touché !!!!'); 
            }
        }
    }
}



/********************************************************************/

var init = function(){ // Initialisation du canvas
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    
    ctx.canvas.width= widthCanvas;
    ctx.canvas.height =heightCanvas;

    backgroundCanvasBack = new Image(); 
    backgroundCanvasBack.src = './assets/files/Background/Nebula Aqua-Pink.png';
    shipPlayerImg = new Image();
    shipPlayerImg.src = './assets/files/PixelSpaceships/blue_05.png'; 
    bulletPlayer = new Image(); 
    bulletPlayer.src = './assets/files/Blue/bullet2.png';
    bulletEnnemy = new Image(); 
    bulletEnnemy.src = './assets/files/Red/bullet_red2.png';  
    //console.log(shipPlayerImg);  
    moteurJeux(); // function récurcive 
}

var moteurJeux = function(){
    clearRect();
    backgroundGame();
    shipPlayer();
    gestionEnnemy();  
    pushLaser(); 
    laserOnScreen();
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


canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY -25
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);

