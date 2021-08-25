

window.onload = function () {



	//localiza en pantalla el reloj y se ronombra visor para trabajar con ello
	visor = document.getElementById("reloj");
	historial = document.getElementById("historial");
	reproductor = document.getElementById("reproductor");
	reproductor_source = document.getElementById("reproductor_source");
	fmtssa = document.getElementById("fmtssa");
	//asociar eventos a botones: al pulsar el botón se activa su función.
	document.cron.empieza.onclick = empezar;
	document.cron.para.onclick = parar;
	document.cron.continua.onclick = continuar;
	document.cron.reinicia.onclick = reiniciar;
	document.cron.anotacio.onclick = anotacio;
	document.cron.resetH.onclick = resetHistorial;

	document.form2.botoFSSA.onclick = formatSSA;
	// reproductor_source.setAttribute("src", canso.url)
	// reproductor_source.contentWindow.location.reload(true);
	// reproductor_source.load;

}

//variables de inicio:
var marcha = 0; //control del temporizador
var cro = 0; //estado inicial del cronómetro.
//cronometro en marcha. Empezar en 0:
var strCrono = "0:00:00.00"  // format del temps transcorregut per poder mostrar a la pantalla

// var cr = null
// var cr2 = null // backup del temps transcorregut (utilitzat despres per tornar a reproduir el cronometre en una linia determinada de la lletra)
var arrObjLletra = canso.lletra.map ( function(linia) {
	return {
		frase: linia,
		tempsInicial: null,
		strTempsInicial: null,
		tempsFinal: null,
		strTempsFinal: null,
		tempsTranscorregut: null   // en segons (es per al reproductor, per situar-lo a una posició determinada)
	}
})

var actual = 0
var anterior = null
var comptador = 0
var tempsIniciCanso = null
var tempsTranscorregut = null


function empezar() {
	if (marcha == 0) { //solo si el cronómetro esta parado
		emp = new Date() //fecha actual
		tempsIniciCanso = emp
		elcrono = setInterval(tiempo, 10); //función del temporizador.
		marcha = 1 //indicamos que se ha puesto en marcha.
		reproductor.play()
	}
}

function tiempo() { //función del temporizador
//  console.log( "emp: " + emp )
	if ( anterior != null ){
		actual = anterior
		anterior = null
	} else {
		actual = new Date() //fecha en el instante
	}

	cro = actual - emp //tiempo transcurrido en milisegundos
	cr = new Date() //fecha donde guardamos el tiempo transcurrido
	cr.setTime(cro) //nos da la fecha en milisegundos
	
	tempsTranscorregut = cro/1000
	// console.log(tempsTranscorregut)

	cs = cr.getMilliseconds() //milisegundos del cronómetro
	cs = cs / 10; //paso a centésimas de segundo.
	cs = Math.round(cs) //despreciamos los decimales
	sg = cr.getSeconds(); //segundos del cronómetro
	mn = cr.getMinutes(); //minutos del cronómetro
	ho = cr.getHours() - 1; //horas del cronómetro
	if (cs < 10) { cs = "0" + cs; }  //se ponen siempre 2 cifras en los números
	if (sg < 10) { sg = "0" + sg; }
	if (mn < 10) { mn = "0" + mn; }
	strCrono = ho + ":" + mn + ":" + sg + "." + cs;
	visor.innerHTML = strCrono; //pasar a pantalla.

	
}

//parar el cronómetro
function parar() {
	if (marcha == 1) { //sólo si está en funcionamiento
		clearInterval(elcrono); //parar el crono
		marcha = 0; //indicar que está parado.
		reproductor.pause();
	}
}

//Continuar una cuenta empezada y parada.
function continuar() {
	if (marcha == 0) { //sólo si el crono está parado
		if ( anterior != null){
			emp2 = anterior
			anterior = null;
		} else {
			emp2 = new Date(); //fecha actual
		}

		emp2 = emp2.getTime(); //pasar a tiempo Unix
		emp3 = emp2 - cro; //restar tiempo anterior
		emp = new Date(); //nueva fecha inicial para pasar al temporizador
		emp.setTime(emp3); //datos para nueva fecha inicial.
		elcrono = setInterval(tiempo, 10); //activar temporizador
		marcha = 1; //indicamos que se ha puesto en marcha.

		reproductor.play();
	}
}

//Volver al estado inicial
function reiniciar() {
	if (marcha == 1) { //si el cronómetro está en marcha:
		clearInterval(elcrono); //parar el crono
		marcha = 0;   //indicar que está parado
	}
	cro = 0; //tiempo transcurrido a cero
	visor.innerHTML = "0:00:00.00"; //se escribe en el visor todo a 0

	reproductor.load();
	historial.innerHTML = ""
	strCrono = "0:00:00.00"
}


function anotacio (){
	var node = document.createElement("DIV");
	var textnode = document.createTextNode(strCrono);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <DIV>
	historial.appendChild(node)
}



function resetHistorial (){
	
	historial.innerHTML = ""
	
	arrObjLletra.forEach( function(obj, index, array) {
				
		// DIV DE REGISTRE
		var nodeR = document.createElement("DIV");
		nodeR.setAttribute("class", "row m-3 px-3 card-footer");
		
		
		// DIV AMB BOTO DE COMENÇAR EN AQUEST PUNT
		var nodeDivBoto = document.createElement("DIV");
		var nodeBoto = document.createElement("BUTTON");
		nodeBoto.innerHTML = "Aquí";
		nodeBoto.addEventListener("click", function(){

			actual = obj.tempsInicial

			// extret de la funcio "TIEMPO"
			cro = actual - tempsIniciCanso //tiempo transcurrido en milisegundos
			cr = new Date() //fecha donde guardamos el tiempo transcurrido
			cr.setTime(cro) //nos da la fecha en milisegundos

			cs = cr.getMilliseconds() //milisegundos del cronómetro
			cs = cs / 10; //paso a centésimas de segundo.
			cs = Math.round(cs) //despreciamos los decimales
			sg = cr.getSeconds(); //segundos del cronómetro
			mn = cr.getMinutes(); //minutos del cronómetro
			ho = cr.getHours() - 1; //horas del cronómetro
			if (cs < 10) { cs = "0" + cs; }  //se ponen siempre 2 cifras en los números
			if (sg < 10) { sg = "0" + sg; }
			if (mn < 10) { mn = "0" + mn; }
			strCrono = ho + ":" + mn + ":" + sg + "." + cs;
			visor.innerHTML = strCrono; //pasar a pantalla.


			reproductor.currentTime = obj.tempsTranscorregut
			marcha = 1; 
			continuar()

		});
		nodeDivBoto.appendChild(nodeBoto)
		nodeDivBoto.setAttribute("class", "col-1 btn btn-green text-center");
		nodeR.appendChild(nodeDivBoto)

		
		
		// DIV AMB EL TEMPS INICIAL
		var nodeTI = document.createElement("DIV");
		var textnodeTI = document.createTextNode("inici");
		nodeTI.appendChild(textnodeTI);
		nodeTI.addEventListener("click", function(){
			nodeTI.innerHTML = strCrono
			obj.tempsInicial = actual
			obj.strTempsInicial = strCrono
			obj.tempsTranscorregut = tempsTranscorregut

			console.log(obj.tempsTranscorregut)

			// si el temps final de l'anterior registre es null, posar el mateix temps que l'inical d'aquest
			if ( index != 0 ){ 
				if (array[index - 1].tempsFinal == null){
					array[index - 1].tempsFinal = actual
					array[index - 1].strTempsFinal = strCrono
					nodeTI.parentNode.previousSibling.lastChild.innerHTML = strCrono
				}
			}
				
		});
		nodeTI.setAttribute("class", "col-2 btn btn-warning text-center");
		nodeR.appendChild(nodeTI)       
	

	
		// DIV AMB LA LLETRA
		var nodeLl = document.createElement("DIV");
		var textnode = document.createTextNode(obj.frase);         // Create a text node
		nodeLl.appendChild(textnode);     // Append the text to <DIV>
		nodeLl.setAttribute("class", "col");
		nodeR.appendChild(nodeLl)


		// DIV AMB EL TEMPS FINAL
		var nodeTF = document.createElement("DIV");
		var textnodeTF = document.createTextNode("final");
		nodeTF.appendChild(textnodeTF);
		nodeTF.addEventListener("click", function(){
			nodeTF.innerHTML = strCrono
			obj.tempsFinal = actual
			obj.strTempsFinal = strCrono

			// console.log("obj.tempsFinal: " + obj.tempsFinal)
			// textnodeTF = document.createTextNode(strCrono);
			// node.appendChild(textnode);
		});
		nodeTF.setAttribute("class", "col-2 btn btn-warning text-center");
		nodeR.appendChild(nodeTF) 
		
		

		historial.appendChild(nodeR)
	})



}


function formatSSA () {
	let str = `
[Script Info]

Title: Sequence 1
Original Script: ANA
ScriptType: v4.00
Collisions: Normal
PlayResY: 1080
PlayResX: 1920
PlayDepth: 0
Timer: 100.0000

[V4 Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding
`





	arrObjLletra.forEach( function(obj) {
		// var node4 = document.createElement("DIV")
		str += "Style: Style15,Arial,75,16777215,0,0,0,0,0,-1,0,0,2,5,5,5,0,0 \n"
		// var textnode4 = document.createTextNode(str)
		// node4.appendChild(textnode4)
		// fmtssa.appendChild(node4)
	})
	
	str += `
[Events]
Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`


	arrObjLletra.forEach ( function(obj, index, array) {
		
		// per a tots els objectes menys l'ultim
		// var node3 = document.createElement("DIV")
		
		var str2 = "Dialogue: Marked=0," // text inicial de la "frase"
		str2 += obj.strTempsInicial   // temps inici subtitol
		str2 += ","
		str2 += obj.strTempsFinal  // temps del final sera el temps d'inici del seguent objecte
		str2 += ",Style1,,0000,0000,0000,!Effect,"
		str2 += obj.frase + "\n"

		str += str2
		// var textnode3 = document.createTextNode(str);
		// node3.appendChild(textnode3);
		// fmtssa.appendChild(node3)
		
	})

	fmtssa.innerHTML = str

}


