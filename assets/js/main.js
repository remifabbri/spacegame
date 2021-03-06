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
    score = 0,
    bestScore = 0, 
    totalScore = 0,
    life = 3, 
    alive = true, 
    start = false

var audioShootPlayer, 
    audioBackground

if (window.innerWidth > 992){
    widthCanvas = window.innerWidth/2;
}else{
    widthCanvas = window.innerWidth;
}

var timerSprite = 0; 

var changeSprite = function(){ // gestion des sprites Joueur / Ennemies / Asteroids
    if (timerSprite >= 0 && timerSprite <= 10){
        shipPlayerImg.src = './assets/files/PixelSpaceships/PlayerShip1.png';
        for (var s= 0; s<arrayEnnemyEC.length; s++){
            arrayEnnemyEC[s].imgEC.src = './assets/files/PixelSpaceships/red_03T1.png';
        }
        timerSprite ++; 
    }
    if (timerSprite > 10 && timerSprite <= 20){
        shipPlayerImg.src = './assets/files/PixelSpaceships/PlayerShip2.png';
        for (var s= 0; s<arrayEnnemyEC.length; s++){
            arrayEnnemyEC[s].imgEC.src = './assets/files/PixelSpaceships/red_03T2.png';
        }
        timerSprite ++; 
    }
    if (timerSprite > 20 && timerSprite <= 30){
        shipPlayerImg.src = './assets/files/PixelSpaceships/PlayerShip3.png';
        for (var s= 0; s<arrayEnnemyEC.length; s++){
            arrayEnnemyEC[s].imgEC.src = './assets/files/PixelSpaceships/red_03T3.png';
        }
        timerSprite ++;
        if(timerSprite >= 30){
            timerSprite = 0; 
        }
    }
}

var timerSpritedead = 0; 
var spritePlayerDead = function(){
    //console.log(timerSpritedead); 
    if (timerSpritedead >= 0 && timerSpritedead <= 10 && !alive){
        shipPlayerImg.src = './assets/files/PixelSpaceships/explosion1.png';
        timerSpritedead ++; 
    }
    if (timerSpritedead > 10 && timerSpritedead <= 20  && !alive){
        shipPlayerImg.src = './assets/files/PixelSpaceships/explosion2.png';
        timerSpritedead ++; 
    }
    if (timerSpritedead > 20 && timerSpritedead <= 30  && !alive){
        shipPlayerImg.src = './assets/files/PixelSpaceships/explosion3.png';
        timerSpritedead ++;
    }
    
}
// element de controle du lancement du jeu et des blocks CV
var btnStart = document.querySelector('.btnStart');
var btnPlay = document.querySelectorAll('.play');
var elTotalScore = document.querySelector('.ScoreTotal span');
var elBestScore = document.querySelector('.BestScore span');
var elBtnRecruteru = document.querySelector('.btnRecruteur');  

var recruteur = false;

elBtnRecruteru.addEventListener('click', function(){
    totalScore = 1000; 
    recruteur = true;
    countLife();  
})

var countLife = function (){
    life -=1;
    if(life === 0 || recruteur){
        alive = false;
        if(!recruteur){
            blockPortfolio.style = "width:"+widthCanvas+"px;";
            blockPortfolio.classList.remove("upBlockMain");
            setTimeout(function(){
                show();
                blockPortfolio.classList.add("downBlockMain"); 
                btnStart.style = "display:block";
                btnStart.style = "left:"+pxLeft+"px; width:"+widthCanvas+"px; ";
            },500);  
        }; 
        audioBackground.pause(); 
        totalScore = totalScore + score;
        elTotalScore.textContent = totalScore; 
        if (score > bestScore){
            bestScore = score;
            elBestScore.textContent = bestScore;  
        }
        if (totalScore > 0){
            var DefautlScore0 = document.querySelectorAll('[name="Defaultscore0"]');
            var Score0 = document.querySelectorAll('[name="score0"]'); 

            for(var b=0; b<DefautlScore0.length; b++){     
                DefautlScore0[b].classList.remove('defaultScore');
                DefautlScore0[b].classList.add('disableScore');
            }
            for(var b=0; b<Score0.length; b++){
                Score0[b].classList.remove('disableScore'); 
                Score0[b].classList.add('enableScore'); 
            }
        }
        if (totalScore > 200){
            var DefautlScore500 = document.querySelectorAll('[name="Defaultscore500"]');
            var Score500 = document.querySelectorAll('[name="score500"]'); 

            for(var b=0; b<DefautlScore500.length; b++){     
                DefautlScore500[b].classList.remove('defaultScore');
                DefautlScore500[b].classList.add('disableScore');
            }
            for(var b=0; b<Score500.length; b++){
                Score500[b].classList.remove('disableScore'); 
                Score500[b].classList.add('enableScore'); 
            }
        }
        if (totalScore > 400){
            var DefautlScore1000 = document.querySelectorAll('[name="Defaultscore1000"]');
            var Score1000 = document.querySelectorAll('[name="score1000"]');

            for(var b=0; b<DefautlScore1000.length; b++){     
                DefautlScore1000[b].classList.remove('defaultScore');
                DefautlScore1000[b].classList.add('disableScore');
            }
            for(var b=0; b<Score1000.length; b++){
                Score1000[b].classList.remove('disableScore'); 
                Score1000[b].classList.add('enableScore'); 
            }
        }
        if (totalScore > 800){
            var DefautlScore1500 = document.querySelectorAll('[name="Defaultscore1500"]');
            var Score1500 = document.querySelectorAll('[name="score1500"]');

            for(var b=0; b<DefautlScore1500.length; b++){     
                DefautlScore1500[b].classList.remove('defaultScore');
                DefautlScore1500[b].classList.add('disableScore');
            }
            for(var b=0; b<Score1500.length; b++){
                Score1500[b].classList.remove('disableScore'); 
                Score1500[b].classList.add('enableScore'); 
            }
        }
        recruteur=false; 
    }
}

var startPlay = function(){ // Lancement du Jeu et Réinitialisation des valeur
    start = true;
    btnStart.style = "display: none;";
    life = 3; 
    alive = true;
    score = 0;
    timerSpritedead = 0; 
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

var affichageHUD = function(){ // Affichage Score et Vie
    ctx.font = "20px Arial";
    ctx.fillStyle="red"
    ctx.fillText('vie:', 20, 25); 
    ctx.fillText(life, 60, 25);
    ctx.fillText('score:',widthCanvas-150, 25);
    ctx.fillText(score,widthCanvas-90, 25);
}


// vaisseau du joueur -----------------------------------

// variable Global joueur
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
        arrayLaser.push(new Laser(shipPlayerCordX-10, shipPlayerCordY+10));
        arrayLaser.push(new Laser(shipPlayerCordX+10, shipPlayerCordY+10));
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

var Asteroid = function (){
    
}


/*******************************GESTION DE JEU */


var countProdEnnemyEC = 0,
    countLaserEC = 0

var gestionEnnemyEc = function (){

    if( arrayEnnemyEC.length < 5){
        arrayEnnemyEC.push(new ShipEnnemyChasseur( Math.random()*posShipX, posShipY));
        
        countProdEnnemyEC +=1; 
        if(countProdEnnemyEC == 5){
            countProdEnnemyEC = 0;
        } 
    }
    
    for (var i=0; i < arrayEnnemyEC.length; i++){
        arrayEnnemyEC[i].drawEC();
    }
    
    for (var i=0; i < arrayEnnemyEC.length; i++){
       
        if(arrayEnnemyEC[i].cordYEC >= heightCanvas){
            arrayEnnemyEC.splice([i], 1); 
        }

        if(arrayEnnemyEC[i].arrayLaserEC.length < 5){

            countLaserEC+=1; 
            if(countLaserEC == 30 ){
                arrayEnnemyEC[i].pushLaserEC();
            }
            if(countLaserEC > 30){
                countLaserEC = 0; 
            }

        }

        for (y=0; y<arrayEnnemyEC[i].arrayLaserEC.length; y++){
            arrayEnnemyEC[i].laserOnScreenEC(); 
        }
    }
}

var countProdEnnemyTank = 0,
    countLaserTank = 0

var gestionEnnemyTank = function (){
    if( arrayEnnemyT.length <= 0){
        arrayEnnemyT.push(new ShipEnnemyTank(posTankX, posTankY)); // création du vaiseau  
    }
    
    for (var i=0; i < arrayEnnemyT.length; i++){
        arrayEnnemyT[i].drawEC(); // annimer tout les ennemis du tableau

        if(arrayEnnemyT[i].cordY >= heightCanvas){ // détection de sorti en Y du canvas
            arrayEnnemyT.splice([i], 1); // suppression du tableau
        }

        if (arrayEnnemyT <= 0){
            gestionEnnemyTank(); 
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
    }
    
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

            if(arrayLaser[f].cordXLaser > arrayEnnemyEC[g].cordXEC && arrayLaser[f].cordXLaser < arrayEnnemyEC[g].cordXEC + 43  && arrayLaser[f].cordYLaser > arrayEnnemyEC[g].cordYEC  && arrayLaser[f].cordYLaser < arrayEnnemyEC[g].cordYEC + 50){
                arrayEnnemyEC[g].life -= 5; 
                if(arrayEnnemyEC[g].life <= 0){
                    arrayEnnemyEC.splice([g], 1);
                    score = score + 10;
                }
                
                arrayLaser.splice([f], 1);  
            }
        }
    }
    
    for(var f=0; f<arrayLaser.length-2; f++){ // Parcour la table des lasers du joueur (-2 sur le length permet d'eviter le bug (cordXLaser is not defined))
        for(var g=0; g < arrayEnnemyT.length; g++){ //Parcour la table des chasseursEnnemy  

            if(arrayLaser[f].cordXLaser > arrayEnnemyT[g].cordX && arrayLaser[f].cordXLaser < arrayEnnemyT[g].cordX + 43  && arrayLaser[f].cordYLaser > arrayEnnemyT[g].cordY  && arrayLaser[f].cordYLaser < arrayEnnemyT[g].cordY + 50){
                arrayEnnemyT[g].life -= 1; 
                if(arrayEnnemyT[g].life <= 0){
                    arrayEnnemyT.splice([g], 1);
                    score = score + 10;
                }

                arrayLaser.splice([f], 1); 
            }
        }
    }

    // colision Ennemy chasseur 
    var shipPlayerCordXW = shipPlayerCordX + 43,
        shipPlayerCordYH = shipPlayerCordY + 40;
    for(var f=0; f<arrayEnnemyEC.length; f++){
        if (shipPlayerCordX > arrayEnnemyEC[f].cordXEC && shipPlayerCordX < arrayEnnemyEC[f].cordXEC + 43 && shipPlayerCordY > arrayEnnemyEC[f].cordYEC && shipPlayerCordY < arrayEnnemyEC[f].cordYEC + 40) {
            arrayEnnemyEC.splice([f], 1); 
            return countLife();
        }
        if (shipPlayerCordXW < arrayEnnemyEC[f].cordXEC + 43 && shipPlayerCordXW > arrayEnnemyEC[f].cordXEC && shipPlayerCordY > arrayEnnemyEC[f].cordYEC && shipPlayerCordY < arrayEnnemyEC[f].cordYEC + 40) {
            arrayEnnemyEC.splice([f], 1);            
            return countLife(); 
        }
        if (shipPlayerCordYH > arrayEnnemyEC[f].cordYEC && shipPlayerCordYH < arrayEnnemyEC[f].cordYEC + 40 && shipPlayerCordX > arrayEnnemyEC[f].cordXEC && shipPlayerCordX < arrayEnnemyEC[f].cordXEC + 43) {
            arrayEnnemyEC.splice([f], 1);            
            return countLife(); 
        }
        if (shipPlayerCordYH > arrayEnnemyEC[f].cordYEC && shipPlayerCordYH < arrayEnnemyEC[f].cordYEC + 40 && shipPlayerCordXW < arrayEnnemyEC[f].cordXEC + 43 && shipPlayerCordXW > arrayEnnemyEC[f].cordXEC) {
            arrayEnnemyEC.splice([f], 1);            
            return countLife(); 
        } 
    }

    for( var Ec =0; Ec < arrayEnnemyEC.length; Ec++ ){
        for( var c = 0; c < arrayEnnemyEC[Ec].arrayLaserEC.length; c++){
            
            if(arrayEnnemyEC[Ec].arrayLaserEC[c].cordXLaserEC < shipPlayerCordX+25
                && arrayEnnemyEC[Ec].arrayLaserEC[c].cordXLaserEC + 8 > shipPlayerCordX +25
                && arrayEnnemyEC[Ec].arrayLaserEC[c].cordYLaserEC < shipPlayerCordY+15 
                && arrayEnnemyEC[Ec].arrayLaserEC[c].cordYLaserEC+13 > shipPlayerCordY  ){
                
                countLife();
                arrayEnnemyEC[Ec].arrayLaserEC.splice([c], 1); 

            }
        }
    }

    // colision Ennemy Tank
    for(var f=0; f<arrayEnnemyT.length; f++){
        if(arrayEnnemyT[f].cordX < shipPlayerCordX+40
            && arrayEnnemyT[f].cordX + 40 > shipPlayerCordX
            && arrayEnnemyT[f].cordY < shipPlayerCordY+ 45
            && arrayEnnemyT[f].cordY + 40 > shipPlayerCordY  ){
            
            countLife();
            arrayEnnemyT.splice([f], 1); 

        }
    }
    for( var Ec =0; Ec < arrayEnnemyT.length; Ec++ ){
        for( var c = 0; c < arrayEnnemyT[Ec].arrayLaserEC.length; c++){
            
            if(arrayEnnemyT[Ec].arrayLaserEC[c].cordXLaserEC < shipPlayerCordX+25
                && arrayEnnemyT[Ec].arrayLaserEC[c].cordXLaserEC + 8 > shipPlayerCordX +25
                && arrayEnnemyT[Ec].arrayLaserEC[c].cordYLaserEC < shipPlayerCordY+15 
                && arrayEnnemyT[Ec].arrayLaserEC[c].cordYLaserEC+13 > shipPlayerCordY  ){
                
                countLife();
                arrayEnnemyT[Ec].arrayLaserEC.splice([c], 1); 

            }
        }
    }   
}

/********************************************************************/

var init = function(){ // Initialisation du canvas
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width= widthCanvas-2;
    ctx.canvas.height =heightCanvas;
    audioShootPlayer = new Audio('./assets/files/sound/laser1.mp3');
    audioBackground = new Audio('./assets/files/sound/backgroundSoundLight.mp3');
    backgroundCanvasBack = new Image(); 
    backgroundCanvasBack.src = './assets/files/Background/Nebula Aqua-Pink.jpg';
    shipPlayerImg = new Image();
    shipPlayerImg.src = './assets/files/PixelSpaceships/PlayerShip1.png'; 
    bulletPlayer = new Image(); 
    bulletPlayer.src = './assets/files/bullet2.png';
    bulletEnnemy = new Image(); 
    bulletEnnemy.src = './assets/files/bullet_red2.png';  
    moteurJeux();
}

var moteurJeux = function(){
    clearRect();
    backgroundGame();
    if(alive && start && life > 0){
        audioBackground.play(); 
        affichageHUD(); 
        gestionEnnemyEc();
        gestionEnnemyTank(); 
        pushLaser(); 
        laserOnScreen();
        colision();
        changeSprite();
    }
    shipPlayer();
    spritePlayerDead();
    requestAnimationFrame(moteurJeux, 1000/30); 
    //moteur = setTimeout(moteurJeux, 1000/30); 
}

init();


// Déplacement du vaiseaux Joueur ------------------------

canvas.addEventListener('mousemove', function(evt){ 
    shipPlayerCordX = evt.clientX - canvas.offsetLeft - shipPlayerH/2;  
    shipPlayerCordY = evt.clientY - canvas.offsetTop - shipPlayerW/2; 
})

canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY -25
    });
    canvas.dispatchEvent(mouseEvent);
}, false);


function hide(){
    blockPortfolio.classList.remove('show');
    blockPortfolio.classList.add('hide');  
}

function show(){
    blockPortfolio.classList.remove('hide'); 
    blockPortfolio.classList.add('show');  
}

for( var p = 0; p < btnPlay.length; p++){ // gestion des bouttons jouer
    btnPlay[p].addEventListener('click', function(){
        startPlay();
        blockPortfolio.classList.remove('initTop');
        blockPortfolio.classList.remove('downBlockMain');
        blockPortfolio.classList.add('upBlockMain'); 
        setTimeout(hide, 700);  
    })
}

var blockPortfolio = document.querySelector('.blockPortfolio');
blockPortfolio.style = "width:"+widthCanvas+"px;";
var pxLeft=canvas.offsetLeft; 
btnStart.style = "left:"+pxLeft+"px; width:"+widthCanvas+"px; ";
  
  

