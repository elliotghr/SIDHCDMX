
function sinEspacios(dato){
    var contenido=dato;
    contenido=contenido.replace(/ /g,"");
    contenido=contenido.replace(/á/g,"a");
    contenido=contenido.replace(/é/g,"e");
    contenido=contenido.replace(/í/g,"i");
    contenido=contenido.replace(/ó/g,"o");
    contenido=contenido.replace(/ú/g,"u");
    contenido=contenido.replace(/ñ/g,"n");
    return contenido;
}


function rellenaMatriz(derecho){
	   $.ajax({
		  type: 'GET',
	      url: 'json/'+derecho+'.json',
		  data: {},
		  success: function( data, textStatus, jqxhr ) {
			  console.log("éxito")
			  var losindicadores=data['results']['records'];
			  for(var i=0; i < losindicadores.length; i++){
				  var divtemp=document.createElement('div');
				  var clave_cat=losindicadores[i].indicator_category_key;
				  var clave_tipo=losindicadores[i].indicator_type_code;
				  var atemp=document.createElement('a');
				  atemp.href="indicador.html?clave="+ losindicadores[i].indicator_code;
				  atemp.innerText=losindicadores[i].indicator_code+" - "+ losindicadores[i].indicator_name;
				  divtemp.appendChild(atemp);
				  var ptemp=document.createElement('p');
				  ptemp.innerText=losindicadores[i].indicator_definition;
				  divtemp.appendChild(ptemp);
				  //$("td[data-clave-categ='"+clave_cat+"'][data-clave-tipo='"+clave_tipo+"']")[0].appendChild(divtemp);
				  $("td[data-clave-categ='"+clave_cat+"'][data-clave-tipo='"+clave_tipo+"']")[0].children[0].appendChild(divtemp);
				  
			  }
			  
		  },
		  error:function( data, textStatus, jqxhr ) { console.error("error en búsqueda "+textStatus)},
		  async:true
		});
}

function generaListayMatriz(derecho){
	var ret;
	var divmatriz=document.createElement("div");
	divmatriz.className="divmatriz";
	for(var i=0;i<categoriasyclaves.length;i++){
		var divcateg=document.createElement("div");
		divcateg.className="divCateg dctg"+categoriasyclaves[i][1];
		
		var divNombCateg=document.createElement("div");
		if(i==0) divNombCateg.className="CatAbierta divNombCateg dnctg"+categoriasyclaves[i][1];
		else divNombCateg.className="CatCerrada divNombCateg dnctg"+categoriasyclaves[i][1];
		divNombCateg.innerHTML=categoriasyclaves[i][0];
		divNombCateg.addEventListener("click",abrecierra);
		divNombCateg.dataset.claveCateg=categoriasyclaves[i][1];
		
		var aNombCateg=document.createElement("a");
		//aNombCateg.href="#"+categoriasyclaves[i][1];
		//aNombCateg.onclick=abrecierra;
		aNombCateg.addEventListener("click",abrecierra);
		
		var divContCateg=document.createElement("div");
		divContCateg.className="divContCateg dcctg"+categoriasyclaves[i][1];
		divContCateg.innerHTML=categoriasyclaves[i][2];
		
		divNombCateg.style="background-color:#"+esquemasMonosaturadosPorId[derecho][1];
		if(i>0) divContCateg.style="display:none; background-color:#"+esquemasMonosaturadosPorId[derecho][7];
		else divContCateg.style="display:block; background-color:#"+esquemasMonosaturadosPorId[derecho][7];
		//divContCateg.style="background-color:#"+esquemasMonosaturadosPorId[derecho][7];
		aNombCateg.appendChild(divNombCateg);
		divcateg.appendChild(aNombCateg);
		divcateg.appendChild(divContCateg);
		divmatriz.appendChild(divcateg);
		//creamos la tabla con columna por tipo
		var tablatipos=document.createElement("table");
		tablatipos.className="tablatipos";
		tablatipos.createTHead();
		tablatipos.tHead.appendChild(document.createElement('tr'));
		var cabE=document.createElement('th');
		cabE.innerText="Indicadores estructurales";
		cabE.style="background-color:#"+esquemasMonosaturadosPorId[derecho][2]+"; border: 5px solid #"+esquemasMonosaturadosPorId[derecho][7];;
		var cabP=document.createElement('th');
		cabP.innerText="Indicadores de proceso";
		cabP.style="background-color:#"+esquemasMonosaturadosPorId[derecho][2]+"; border: 5px solid #"+esquemasMonosaturadosPorId[derecho][7];;
		var cabR=document.createElement('th');
		cabR.innerText="Indicadores de resultado";
		cabR.style="background-color:#"+esquemasMonosaturadosPorId[derecho][2]+"; border: 5px solid #"+esquemasMonosaturadosPorId[derecho][7];;
		tablatipos.tHead.rows[0].appendChild(cabE);
		tablatipos.tHead.rows[0].appendChild(cabP);
		tablatipos.tHead.rows[0].appendChild(cabR);
		tablatipos.createTBody();
		tablatipos.tBodies[0].insertRow();
		var celdaE=tablatipos.tBodies[0].rows[0].insertCell();
		celdaE.dataset.claveCateg=categoriasyclaves[i][1];
		celdaE.dataset.claveTipo="E";
		celdaE.style="background-color:#"+esquemasMonosaturadosPorId[derecho][8]+"; border: 5px solid #"+esquemasMonosaturadosPorId[derecho][7];;
		var divE=document.createElement('div');
		divE.className="escroleable";
		celdaE.appendChild(divE);
		var celdaP=tablatipos.tBodies[0].rows[0].insertCell();
		celdaP.dataset.claveCateg=categoriasyclaves[i][1];
		celdaP.dataset.claveTipo="P";
		celdaP.style="background-color:#"+esquemasMonosaturadosPorId[derecho][8]+"; border: 5px solid #"+esquemasMonosaturadosPorId[derecho][7];;
		var divP=document.createElement('div');
		divP.className="escroleable";
		celdaP.appendChild(divP);
		var celdaR=tablatipos.tBodies[0].rows[0].insertCell();
		celdaR.dataset.claveCateg=categoriasyclaves[i][1];
		celdaR.dataset.claveTipo="R";
		celdaR.style="background-color:#"+esquemasMonosaturadosPorId[derecho][8]+"; border: 5px solid #"+esquemasMonosaturadosPorId[derecho][7];;
		var divR=document.createElement('div');
		divR.className="escroleable";
		celdaR.appendChild(divR);
		// para seleccionar la celda $("td[data-clave-categ='a'][data-clave-tipo='E']")
		divContCateg.appendChild(tablatipos);
		
	}
	return divmatriz.outerHTML;
	
}

function abrecierra(divCat){
	var claveCateg=divCat.dataset.claveCateg;
	let laurl=new URL(document.location);
	let rid=laurl.searchParams.get("rid");
	if(divCat.classList.contains("CatAbierta")){
		window.history.pushState({ id: "100" },"",laurl.pathname+"?rid="+rid);
		$('.dcctg'+claveCateg).hide();
		divCat.classList.remove("CatAbierta");
		divCat.classList.add("CatCerrada");
	}
	else{
		window.history.pushState({ id: "100" },"",laurl.pathname+"?rid="+rid+"&cat="+claveCateg);
		$('.divContCateg').hide();
		$('.dcctg'+claveCateg).show();
		$('.divNombCateg').removeClass('CatAbierta');
		$('.divNombCateg').addClass('CatCerrada');
		divCat.classList.add("CatAbierta");
		divCat.classList.remove("CatCerrada");
		
	}
}

function creaHexDerechos(DatJDer){
	let lagrid=d3.select("#hex_derechos").append("ul").attr("id","hexGrid");
	for(let i in DatJDer){
		let id_derecho=idDerechoPorNombre[DatJDer[i]['val']];
		let elanch=lagrid.append("li").classed("hex",true).attr("data-id-derecho",id_derecho).append("div").classed("hexIn",true).append("a").classed("hexLink",true);//.attr("href","#");
		elanch.append("img").attr("src","../img/iconos/nuevos/b"+id_derecho+".svg");
		elanch.append("h1").attr("style","background-color:#"+esquemasColoresPorNombre[DatJDer[i]['val']][1][0]).html(infoPorID[id_derecho][0]);
		elanch.append("p").attr("style","background-color:#"+esquemasColoresPorNombre[DatJDer[i]['val']][1][0]).html(infoPorID[id_derecho][1]);
		
	}
	let anchviv=lagrid.append("li").classed("hex",true).attr("id","hex_li_8").append("div").classed("hexIn",true).append("a").classed("hexLink",true).attr("href","#");
	anchviv.append("img").attr("src","../img/iconos/nuevos/b9.svg");
	anchviv.append("h1").attr("style","background-color:#c72cc7ff").html("Derecho a una Vivienda Digna");
	anchviv.append("p").attr("style","background-color:#c72cc7ff").html("Art. 11 PIDESC");
	//d3.select("#hex_derechos").append("div").attr("id","espacio_tabla_indicadores")
	/**vivienda hardcodeado*/
	$(".hex").on('click',function(x){
		let id_derecho=this.getAttribute("data-id-derecho");
		window.history.pushState({ id: "100" },"holi",(new URL(document.location)).pathname+"?rid="+id_derecho);
		d3.select("#espacio_tabla_indicadores").html(generaListayMatriz(id_derecho));
		rellenaMatriz(id_derecho);
		$(".CatAbierta").on('click',function(){abrecierra(this)});
		$(".CatCerrada").on('click',function(){abrecierra(this)});
		
	});
	let laurl = new URL(window.location.href);
	let id_activado=laurl.searchParams.get("rid");
	$(".hex[data-id-derecho*='"+id_activado+"']").trigger("click");
    let cat_activada=laurl.searchParams.get("cat");
    if(cat_activada!=undefined&&cat_activada!="a"){
    	abrecierra($(".divNombCateg[data-clave-categ*='"+cat_activada+"']")[0])
    }
	
}

function creaTablaDerechos(DatJDer){
	var ancho_disponible=$('#tabla_derechos').width();
	var derechos_por_fila=Math.floor(ancho_disponible/300);
	var filas_botones=[];
	var filas_indicadores=[];
	for(var i = 0; i < DatJDer.length; i++){
		var num_fila=Math.floor(i/derechos_por_fila);
		if(filas_botones[num_fila]===undefined){
			filas_botones[num_fila]=document.createElement("div");
			filas_botones[num_fila].className="filaBotonDerecho fBotDer"+num_fila;
			filas_indicadores[num_fila]=document.createElement("div");
			filas_indicadores[num_fila].className="filaTablaIndicador ftblind"+num_fila;
		}
		var elanch=document.createElement("a");
		//elanch.href="?rid="+idDerechoPorNombre[DatJDer[i]['val']];
		var elcuadro=document.createElement("div");
		elcuadro.className="cuadro-derechos b"+idDerechoPorNombre[DatJDer[i]['val']];
		elcuadro.style="background: url('../img/iconos/b"+idDerechoPorNombre[DatJDer[i]['val']]+".svg');";
		elanch.appendChild(elcuadro);
		filas_botones[num_fila].appendChild(elanch);
	}
	var ret="";
	for(var i=0;i<filas_botones.length;i++){
		ret+=filas_botones[i].outerHTML+filas_indicadores[i].outerHTML;
	}
	$('#tabla_derechos').html(ret);
	$(".cuadro-derechos").on('click',function(){
		this.scrollIntoView();
		var id_derecho=this.classList[1].substring(1,2);
		window.history.pushState({ id: "100" },"holi",(new URL(document.location)).pathname+"?rid="+id_derecho);
		var num_fila=this.parentElement.parentElement.classList[1].substring(7,8);
		$('.filaTablaIndicador').html('');
		$(".ftblind"+num_fila).html(generaListayMatriz(id_derecho));
		rellenaMatriz(id_derecho);
		$(".CatAbierta").on('click',function(){abrecierra(this)});
		$(".CatCerrada").on('click',function(){abrecierra(this)});
		
	});
	let laurl = new URL(window.location.href);
	let id_activado=laurl.searchParams.get("rid");
    $(".b"+id_activado).trigger("click");
    let cat_activada=laurl.searchParams.get("cat");
    if(cat_activada!=undefined){
    	abrecierra($(".divNombCateg[data-clave-categ*='"+cat_activada+"']")[0])
    }
}

$(document).ready(function () {
        $.ajax({
            type:'GET',
            url: "json/general.json",
            data: {},
            success: function( data, textStatus, jqxhr ) {  
            	//creaTablaDerechos(data['fac.json']['array']['buckets']);
            	creaHexDerechos(data['fac.json']['array']['buckets']);
            },
            async:true
		});
});

