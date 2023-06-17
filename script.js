'use strict';

try{
    
    const btnReiniciar =document.getElementById("reiniciar");
    const anuncio = document.getElementById("anuncio");  
    const buttons = document.querySelectorAll('section>button');  

    //Objeto para valores y condiciones del juego
    const juego = {x:{value:0},o:{value:0},usuario:true,robot:false,primerMovimiento:false}
    
    //Funciones
    const iniciar = function(){
    juego.x.value = 0;
    juego.o.value = 0;
    juego.robot = false;
    juego.usuario = true;
    juego.terminado = false;
    juego.primerMovimiento = true;
    btnReiniciar.classList.remove("mostrar");
    anuncio.classList.remove("mostrar");
    buttons.forEach(button=>setTimeout(()=>{button.innerHTML="";
                button.classList.remove("ocultarTablero");
                button.style.backgroundColor = "#0000";
            },111));
    }

    const victorizar = function(ganador,lineaPorGanar){
                juego.terminado = true;
                if(lineaPorGanar) lineaPorGanar.forEach(pos=>document.getElementById(pos).style.backgroundColor='#ff06');
                buttons.forEach(button=>setTimeout(()=>{button.innerHTML="";
                button.classList.add("ocultarTablero");
            },1250));
            setTimeout(()=> {
                anuncio.textContent = ganador;
                anuncio.classList.add("mostrar");
                btnReiniciar.classList.add("mostrar");
            },1250);
            return true;
    }

    const eliminarElementosFalsos = en => en.filter(elemento=>elemento);

    const random = (...elementos) =>{
        const  elementosVerdaderos = eliminarElementosFalsos(elementos);
        return elementosVerdaderos[Math.floor(Math.random() * elementosVerdaderos.length)]
    };

    const checarPosiciones = (en,ocupadas,...posiciones) => posiciones.every(posicion=>en.toString(2).padStart(9,"0")[posicion]==ocupadas) ? 
                            posiciones : false;

    const elegirPosicion = (linea) => {
        const center = checarPosiciones(juego.o.value^juego.x.value ,false, linea[1]);
        const left = checarPosiciones(juego.o.value^juego.x.value,false, linea[0]);
        const right = checarPosiciones(juego.o.value^juego.x.value,false, linea[2]);
        return left && right && center ? random(left,right) :
        center ? center : 
        left && right ? random(left,right) : 
        left ? left : 
        right ? right :
        false;
    }

    const lineaConElementoEn = function(en,lineas){
        const convenientes =  lineas.filter(linea=>linea.some(posicion=>checarPosiciones(en,true,posicion)));
        return convenientes;
    }

    const buscarXOX = (linea,en) => linea.filter(element => checarPosiciones(en.toString(2).padStart(9,"0"),true,element));
    
    const buscarLineasPorGanar = (fn,en,checar) => {
        const lineasLibresDeRobot = fn(en).filter(linea=>buscarXOX(linea,checar).length==2) ;
        return lineasLibresDeRobot.length>0 ? lineasLibresDeRobot : false;
    }

    const buscarHorizontalesLibres = function(en){
        const a = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 0,1,2);
        const b = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 3,4,5);
        const c = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 6,7,8);
        return eliminarElementosFalsos([a,b,c]);
    }

    const buscarVerticalesLibres = function(en){
        const a = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 0,3,6);
        const b = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 1,4,7);
        const c = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 2,5,8);
        return eliminarElementosFalsos([a,b,c]);
    }

    const buscarDiagonalesLibres = function(en){
        const a = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 8,4,0);
        const b = checarPosiciones(  en.toString(2).padStart(9,"0"),false, 6,4,2);
        return eliminarElementosFalsos([a,b,]);
    }

    const valuar = function(element){
       return  element.value += Number(this.dataset.value);
    }

    const buscarLineas = (fn,en) =>{
        const lineas = fn(en);
        return lineas.length > 0 ? lineas : false;
    }

    const checarLineaElementoCentro = (linea,en) => {
        const lineaConElementoCentro = checarPosiciones(en,true,linea[1]);
        return lineaConElementoCentro.length>0 ? lineaConElementoCentro : false;
    }

    const asignarPosicion = (fn,en,checar) => {
        const lineas = (checar == 16 || checar == 272 || checar == 80 || checar == 20 || checar == 17 ) ? buscarLineas(buscarDiagonalesLibres,en) : buscarLineas(fn,en);
        const lineaElementoCentro = lineas ?  lineas.filter(linea=>checarLineaElementoCentro(linea,checar))[0] : false;
        const lineaConveniente = lineaElementoCentro ? lineaElementoCentro : lineas ? lineaConElementoEn(checar,[...lineas])[0] : false;
        return  lineaElementoCentro ? random(lineaElementoCentro[0],lineaElementoCentro[2]) : lineaConveniente ? elegirPosicion(lineaConveniente) : false;
    }

    const verificarVictoria = (en) => {
        const victoria = checarVictoria(en,[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6])[0];
        if(victoria) {
            juego.usuario = false;
            return victorizar(juego.robot ? "Ganador X" : "Ganador O",victoria);
        }
        }

    const checarVictoria =(en,...lineas) => lineas.filter(linea=>linea.every(pos=>checarPosiciones(en,true,pos)));
    
    const responder = function(posicion,terminado){
        const button = document.getElementById(posicion);
        if(juego.robot){
            valuar.call(button,juego.x);
            button.innerHTML = "<img src='./imgs/x.png' width='100%'>";
            verificarVictoria(juego.x.value);
        } else{
            button.innerHTML = "<img src='./imgs/o.png' width='100%'>";
            if(terminado) return victorizar("Empate OX");
            const victoria = verificarVictoria(juego.o.value);
            !victoria ? setTimeout(actuarRobot,400) : null;
        } 
        juego.robot = !juego.robot;
        juego.usuario = !juego.usuario;
    }

    const actuarRobot = function(){
        if(juego.terminado) return false;
        if(juego.primerMovimiento) {
            juego.primerMovimiento = false;
            if(checarPosiciones(juego.o.value,false,4))
            return responder(4);
        }
        let posicion;
        //tirar a ganar
        const lineasGanadoras = buscarLineasPorGanar(buscarHorizontalesLibres,juego.o.value,juego.x.value) || 
        buscarLineasPorGanar(buscarVerticalesLibres,juego.o.value,juego.x.value)  || 
        buscarLineasPorGanar(buscarDiagonalesLibres,juego.o.value,juego.x.value);
        let lineaPorGanar = lineasGanadoras[0];
        if(lineaPorGanar){
                posicion = lineaPorGanar.filter(posicion => checarPosiciones(juego.x.value,false,posicion));
                if(posicion) return responder(posicion);
        }
        //si no se puede ganar, tirar a No perder
            else{ 
                const lineasPerdedoras = buscarLineasPorGanar(buscarHorizontalesLibres,juego.x.value,juego.o.value) || 
                buscarLineasPorGanar(buscarVerticalesLibres,juego.x.value,juego.o.value) ||
                buscarLineasPorGanar(buscarDiagonalesLibres,juego.x.value,juego.o.value);
                let lineaPorPerder = lineasPerdedoras[0];    
                if(lineaPorPerder){
                    posicion = lineaPorPerder.filter(posicion => checarPosiciones(juego.o.value,false,posicion));
                    if(posicion) return responder(posicion);
                }
            }
            return responder(asignarPosicion(buscarHorizontalesLibres,juego.x.value,juego.o.value) || asignarPosicion(buscarVerticalesLibres,juego.x.value,juego.o.value));    
    }

    const actuarUsuario = function(){ 
        if(!juego.usuario || juego.terminado) return false;
        const posicionLibre = checarPosiciones(juego.o.value^juego.x.value,false,this.id);
        const actualizarValores = posicionLibre ? valuar.call(this,juego.o) : null;
        const terminado = checarPosiciones(juego.o.value^juego.x.value,true,0,1,2,3,4,5,6,7,8);
        if(actualizarValores) return responder(this.id,terminado);
    }

    //Manejadores de eventos
    buttons.forEach(button=>{button.addEventListener('click',actuarUsuario)});
    btnReiniciar.addEventListener('click',iniciar);

}catch(error){
    alert(error);
    console.log(error);
}


