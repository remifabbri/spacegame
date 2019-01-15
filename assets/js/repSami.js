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
      this.cordYLaserEC += 15
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






/************************  Autre Méthode   ***************************************************** */

this.drawLaserEC = {
    cordXLaserEC : 0,
    cordYLaserEC : 0,

    drawShotEC : function(){
        ctx.fillRect(this.cordXLaserEC, this.cordYLaserEC, 2, 10),
        ctx.fillStyle = "rgb(0,0,255)",
        this.cordYLaserEC += 15
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
        value: this.cordXEC+this.cordXEC/2,
        configurable: true,
        enumerable: true,
        writable: true
      },
      cordYLaserEC: {
        value: this.cordYEC,
        configurable: true,
        enumerable: true,
        writable: true
      }
    }));

}