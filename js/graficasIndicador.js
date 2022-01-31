var brew_mapa;
var arreglo_estados;
var geojsonMapa;
var esta_locked = false;
var mymap;
var cuadros_info;
var cuadro_titulo;
var chart;

function construyeGrafica(tipo){
	$("#mapid").hide();
	$("#div_grafica_bb").show();
	let nombre_grupo_desglose=datosDGRU.breakdown_group[sbdg].breakdown_group_name;
	if(tipo==undefined||tipo==""){
		tipo=$("#div_botones_graficas button.active")[0].id.replace("boton_grafica_","");
	}
	else{
		$("#div_botones_graficas button").removeClass("active");
		$("#div_botones_graficas #boton_grafica_"+tipo).addClass("active");
	}
	let bdgv=datosDGRU.breakdown_group[sbdg].breakdown_group_variable[$("#select_variables").selected()[0].value];
	let columna_periodo=parseAttYears(datosDGRU.breakdown_group[sbdg].breakdown_attribute_years);
	
	let desgloses = revisaDeciles(datosDGRU.breakdown_group[sbdg].breakdown_resource_name);
	let columna_desglose = minusculas(parseAPI(datosDGRU.breakdown_group[sbdg].breakdown_attribute));
	let nombre_variable=bdgv.variable[0].variable_name;
	let columna_variable=bdgv.nombre_columna;
	let resource_id=datosDGRU.breakdown_group[sbdg].resource_id;
	let unidad_de_medida=bdgv.variable[0].variable_unit_measure;
	
	let mismo_nivel=true;
	if(datosDGRU.breakdown_group[sbdg].breakdown_group_variable.length>1){
		let nivel=datosDGRU.breakdown_group[sbdg].breakdown_group_variable[0].variable[0].variable_level;
		for(let i=1;i<datosDGRU.breakdown_group[sbdg].breakdown_group_variable.length;i++){
			mismo_nivel&=nivel==datosDGRU.breakdown_group[sbdg].breakdown_group_variable[i].variable[0].variable_level
		}
	}
	
	$("#div_periodo_gra").hide();
	if(tipo=="Col"&&nombre_grupo_desglose.includes("Entidad federativa")){
		$("#div_periodo_gra").show();
		let lafuncion= (arreglo_datos)=>{
			creaBarrasEntidad(arreglo_datos, 
					nombre_variable, 
					columna_variable,
					bdgv.variable[0].variable_unit_measure,
					columna_desglose, spg)
		}
		jalaDatosAsynch(resource_id,columna_desglose,desgloses, columna_periodo,spg,lafuncion);
		
	}
	else if(tipo=="Pay"&&mismo_nivel&&datosDGRU.breakdown_group[sbdg].breakdown_group_variable.length>1){
		$("#div_periodo_gra").hide();
		let eldesglose=[desgloses[sbd]]
		let titulo=datosDGRU.indicator_name;
		if(desgloses.length>1){
			titulo +=" ("+desgloses[sbd]+")";
		}
		let lafuncion=(arreglo_datos)=>{
			creaPayVariables(arreglo_datos,datosDGRU.breakdown_group[sbdg].breakdown_group_variable,titulo);
		}
		jalaDatosAsynch(resource_id, columna_desglose,eldesglose, columna_periodo,spg,lafuncion);
		
		
	}
	else{
		let lafuncion=(arreglo_datos)=>{
			creaGrafica(tipo,arreglo_datos, 
					columna_desglose,
					desgloses,
					nombre_variable, 
					columna_variable,
					unidad_de_medida,
					columna_periodo);
		}
		jalaDatosAsynch(resource_id, columna_desglose,desgloses, columna_periodo,null,lafuncion);
		
		
	}
}

function creaGrafica(tipo, datos, columna_desgloses, desgloses, nombre_variable, columna_variable, unidad_de_medida, columna_periodo){
	let num_desgloses=desgloses.length;
	let arreglo_datos=[];
	let arreglo_vacio=[];
	let arreglo_periodo=["periodo"];
	for(let i in datos){
		if(!arreglo_periodo.includes(datos[i][columna_periodo])) arreglo_periodo.push(datos[i][columna_periodo]);
	}
	arreglo_datos.push(arreglo_periodo);
	arreglo_vacio.push(arreglo_periodo)
	for(let i in desgloses){
		arreglo_datos.push([desgloses[i]]);
		arreglo_vacio.push([desgloses[i]]);
	}
	if(columna_desgloses==null){		
		arreglo_datos[1][0]="Total";
		arreglo_vacio[1][0]="Total";
		desgloses[0]="Total";
		for(let i in datos){
			arreglo_datos[1].push(datos[i][columna_variable])
			arreglo_vacio[1].push(0);
		}
	}
	else{
		for(let i in datos){
			for(let j in arreglo_datos){
				if(arreglo_datos[j][0]==datos[i][columna_desgloses]){
					arreglo_datos[j].push(datos[i][columna_variable])
					arreglo_vacio[j].push(0);
				}
			}
		}
	}
	
	let colors={};
	if(num_desgloses<esquemasColoresPorClave[datosDGRU.right_key].length){
		for(let i in desgloses){
			colors[desgloses[i]]="#"+esquemasColoresPorClave[datosDGRU.right_key][num_desgloses][i]
		}
	}
	else{
		let gama=gamaDinamica(esquemasColoresPorClave[datosDGRU.right_key][1][0],num_desgloses);
		for(let i in desgloses){
			colors[desgloses[i]]=gama[i];
		}
	}
	switch(tipo){
		case "Col":
		case "ColAg":
			creaColumnasAgrupadas(nombre_variable,arreglo_datos, arreglo_vacio,colors,unidad_de_medida);
		break;
		case "Bre":
			creaBrechas(nombre_variable,arreglo_datos, arreglo_vacio,colors,unidad_de_medida);
		break;
		case "Mapa":
			creaMapa(arreglo_datos, arreglo_vacio,colors,nombre_variable, unidad_de_medida);
		break;
		case "ColAp":
			creaColumnasApiladas(nombre_variable,arreglo_datos, arreglo_vacio,colors,unidad_de_medida);
		break;
		case "Pay":
			creaPie(nombre_variable,arreglo_datos, arreglo_vacio,colors,unidad_de_medida);
		break;
	}
}

function creaPayVariables(datos, variables,titulo){
	let arreglo_datos=[];
	let arreglo_vacio=[];
	let colors={};
	
	for(let i in variables){
		arreglo_datos.push([variables[i].variable[0].variable_name,datos[0][minusculas(variables[i].variable_breakdown_group_name)]]);
		arreglo_vacio.push([variables[i].variable[0].variable_name,0]);
		colors[variables[i].variable[0].variable_name]="#"+esquemasColoresPorClave[datosDGRU.right_key][variables.length][i];
	}
	
	var chart = bb.generate({
		title: {
		    text: titulo
		  },
		  data: {
		    columns: arreglo_vacio,
		    type: "pie",
		    colors,
		    color: function(color, d) {
			// d will be "id" when called for legends
			return (d.id && d.id === "data3") ?
				d3.rgb(color).darker(d.value / 150).toString() : color;
		   }
		  },
		  bindto: "#div_grafica_bb"
		});
	setTimeout(function() {
		chart.load({columns:arreglo_datos});
	}, 100);
	
}

function creaBarrasEntidad(datos, nombre_variable, columna_variable, unidad_de_medida, columna_desglose, periodo){
	let arreglo_entidad=["entidad"];
	for(let i in datos) arreglo_entidad.push(datos[i][columna_desglose]);
	let arreglo_datos=[nombre_variable];
	let arreglo_vacio=[nombre_variable];
	for(let i in datos){
		arreglo_datos.push(datos[i][columna_variable]);
		arreglo_vacio.push(0);
	}
	let colors={};
	
	colors[nombre_variable]="#"+esquemasColoresPorClave[datosDGRU.right_key][1][0];
	
	var chart = bb.generate({
		title: {
		    text: nombre_variable +" ("+periodo+")"
		  },
		  data: {
			x:"entidad",
		    columns: [arreglo_entidad,arreglo_datos],
		    type: "bar",
		    colors,
		    color: function(color, d) {
			// d will be "id" when called for legends
			return (d.id && d.id === "data3") ?
				d3.rgb(color).darker(d.value / 150).toString() : color;
		   }
		  },axis:{
			  x:{
				  type:"category",
				  tick: {
				        fit: true,
				        multiline: false,
				        autorotate: true,
				        rotate: 15,
				        culling: false
				      }
			  },
			  y:{
				  label:unidad_de_medida,
				  tick: {
				        format: (x)=>formatData(""+x,unidad_de_medida)//function(x) { return d3.format("$,")(x); }
				      }
			  }
		  },
		  bar: {
			    width: {
			      ratio: 0.9
			    }
			  },
			  legend: {
			    show: false
			  },
		bindto: "#div_grafica_bb"
		});
	setTimeout(function() {
		chart.load({columns:[arreglo_entidad,arreglo_datos]});
	}, 100);
}



function creaBrechas(nombre_variable, arreglo_datos, arreglo_vacio,colors,unidad_de_medida){
	let config={
			title: {
			    text: nombre_variable
			  },
			  data: {
				  x:"periodo",
			    columns: arreglo_vacio,
			    type: "line",
			    colors,
			    color: function(color, d) {
				// d will be "id" when called for legends
				return (d.id && d.id === "data3") ?
					d3.rgb(color).darker(d.value / 150).toString() : color;
			   }
			  }, point: {
				    pattern: [
				        "<g><circle  cx='10' cy='10' r='10' ></circle></g>"
				      ]
				    }
				,axis:{
				  y:{
					  label:unidad_de_medida,
					  tick: {
					        format: (x)=>formatData(""+x,unidad_de_medida)
					      }
				  }
			  },
			  line: {
				    classes: [
				      "line-class-brecha",
				      "line-class-brecha"
				    ]
				  },
			  bindto: "#div_grafica_bb"
			};
	
	if(arreglo_datos[0][1].match(/[^$,.\d]/)!=null) config.axis.x={type:"category"};//para cuando el eje x no sea numérico, p ej ciclo escolar
	var chart = bb.generate(config);
	setTimeout(function() {
		chart.load({columns:arreglo_datos});
	}, 100);
}

function creaColumnasAgrupadas(nombre_variable, arreglo_datos, arreglo_vacio,colors,unidad_de_medida){
	let config={
			title: {
			    text: nombre_variable
			  },
			  data: {
				  x:"periodo",
			    columns: arreglo_vacio,
			    type: "bar",
			    colors,
			    color: function(color, d) {
				// d will be "id" when called for legends
				return (d.id && d.id === "data3") ?
					d3.rgb(color).darker(d.value / 150).toString() : color;
			   }
			  },axis:{
				  y:{
					  label:unidad_de_medida,
					  tick: {
					        format: (x)=>formatData(""+x,unidad_de_medida)
					      }
				  }
			  },
			  bar: {
				    width: {
				      ratio: 0.9
				    }
				  
				  },
			  bindto: "#div_grafica_bb"
			};
	
	if(arreglo_datos[0][1].match(/[^$,.\d]/)!=null) config.axis.x={type:"category"};//para cuando el eje x no sea numérico, p ej ciclo escolar
	chart = bb.generate(config);
	setTimeout(function() {
		chart.load({columns:arreglo_datos});
	}, 100);
	
}

function creaColumnasApiladas(nombre_variable, arreglo_datos, arreglo_vacio,colors,unidad_de_medida){
	let config={
			title: {
			    text: nombre_variable
			  },
			  data: {
				  x:"periodo",
			    columns: arreglo_vacio,
			    type: "bar",
			    colors,
			    color: function(color, d) {
				// d will be "id" when called for legends
				return (d.id && d.id === "data3") ?
					d3.rgb(color).darker(d.value / 150).toString() : color;
			   }
			  },axis:{
				  y:{
					  label:unidad_de_medida,
					  tick: {
					        format: (x)=>formatData(""+x,unidad_de_medida)
					      }
				  }
			  },
			  bar: {
				    width: {
				      ratio: 0.9
				    },
				    padding: 3
				  },
			  bindto: "#div_grafica_bb"
			};
	if(arreglo_datos[0][1].match(/[^$,.\d]/)!=null) config.axis.x={type:"category"};
	var chart = bb.generate(conig);
	setTimeout(function() {
		chart.load({columns:arreglo_datos});
	}, 100);
	let grupos=[[]];
	for(let i=1;i<arreglo_datos.length;i++){
		grupos[0].push(arreglo_datos[i][0]);
	}
	setTimeout(function() {
		chart.groups(grupos)
	}, 300);
}

function creaPie(nombre_variable, arreglo_datos, arreglo_vacio,colors,unidad_de_medida){
	var chart = bb.generate({
		title: {
		    text: nombre_variable
		  },
		  data: {
			  x:"periodo",
		    columns: arreglo_vacio,
		    type: "pie",
		    colors,
		    color: function(color, d) {
			// d will be "id" when called for legends
			return (d.id && d.id === "data3") ?
				d3.rgb(color).darker(d.value / 150).toString() : color;
		   }
		  },
		  bindto: "#div_grafica_bb"
		});
	setTimeout(function() {
		chart.load({columns:arreglo_datos});
	}, 100);
}

function creaMapa(arreglo_datos, arreglo_vacio,colors,nombre_variable, unidad_de_medida){
	$("#mapid").show();
	$("#div_grafica_bb").hide();
	arreglo_estados=arreglo_datos;

	if(mymap==undefined){
		mymap = L.map('mapid',{zoomControl: false}).setView([24, -102], 5);
		mymap.scrollWheelZoom.disable();
		mymap.doubleClickZoom.disable(); 
		
		let tipo_capa="DARK";
		
		if(tipo_capa=="SAT"){
			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
			    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			    id: 'mapbox/satellite-v9',
			    tileSize: 512,
			    zoomOffset:-1,
			    accessToken: 'pk.eyJ1IjoibnVsbHJhbmQiLCJhIjoiY2thbzYwbmh6MGp6MTJxcXRkNnlyc3loZiJ9.5KMJ0q6CPvquXyri3v19qg'
			}).addTo(mymap);
		}
		else if(tipo_capa=="DARK"){
			 L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
					subdomains: 'abcd',
					maxZoom: 19
				}).addTo(mymap);
		}
		else if(tipo_capa="NAT_GEO"){
			 L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
					maxZoom: 16
				}).addTo(mymap);
		}
		
	}

	let titulodiv=d3.select(".overlay_titulo");
	if(titulodiv.node()==undefined)
		titulodiv=d3.select("#mapid").append("div").classed("overlay_titulo",true).text(nombre_variable);
	else titulodiv.text(nombre_variable);
	
	let actualiza=true;
	if(cuadros_info==undefined){
		cuadros_info = L.control();
		actualiza=false;
	}
	cuadros_info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'overlay_entidad hide');
		this.update();
		return this._div;
	};
	
	
	cuadros_info.update = (d,udm,nv)=> 
	{      
		$('.overlay_entidad').removeClass('hide');
		if (d != undefined) {
			let eldivtemp=d3.select(".overlay_entidad").select("#div_cuadro_entidad");
			if(eldivtemp.empty()){
				eldivtemp=d3.select(".overlay_entidad").append("div");
				eldivtemp.attr("id","div_cuadro_entidad");
				eldivtemp.append("h4").text(d.nom_ent)
				eldivtemp.append("hr").attr("style","margin:1px;border-color:#"+esquemasColoresPorClave[datosDGRU.right_key][1][0]);
				eldivtemp.append("b").attr("id","valor_cuadro_entidad").attr("style","font-size: 20px;").text(valorPorNombreEstado(d.nom_ent,0).toFixed(2));
				eldivtemp.append("br");
				eldivtemp.append("b").attr("id","fecha_cuadro_entidad").attr("style","padding-left:8px;color:#999999;").text(arreglo_datos[0][arreglo_datos[0].length-1]);
				eldivtemp.append("div").attr("class","info");
			}
			else{
				eldivtemp.select("h4").text(d.nom_ent)
				eldivtemp.select("#valor_cuadro_entidad").text(valorPorNombreEstado(d.nom_ent,0).toFixed(2));
				eldivtemp.select("#fecha_cuadro_entidad").text(arreglo_datos[0][arreglo_datos[0].length-1]);
			}
			minigrafica(arreglo_datos[indiceEstado(d.nom_ent)],arreglo_datos[0],udm);
		}
	};
	
	cuadros_info.hide=(d)=>{
		if (!esta_locked) $('.overlay_entidad').addClass('hide');
	}

	if(!actualiza){
		cuadros_info.addTo(mymap);
	}
	
	let values = [];
	for (let i in statesData.features) {
		if (statesData.features[i].properties.nom_ent == null) continue;
		let tempest=valorPorNombreEstado(statesData.features[i].properties.nom_ent, arreglo_datos,0);
		if(tempest==undefined){
			values.push(0);
		} 
		else values.push(tempest);
	}

	brew_mapa = new classyBrew();
	brew_mapa.setSeries(values);
	brew_mapa.setNumClasses(9);
	brew_mapa.setColorCode(colorCodesPorClave[datosDGRU.right_key]);
	brew_mapa.classify("jenks");


	geojsonMapa = L.geoJson(statesData, {
		style: (feature)=>{
			return{
				weight: 0.5,
				color: '#000',
				fillOpacity: 0.8,
				fillColor: brew_mapa.getColorInRange(valorPorNombreEstado(feature.properties.nom_ent,0))
			}
		},
		onEachFeature: (a,b)=>{porFeature(a,b,unidad_de_medida,nombre_variable)}
	}).addTo(mymap);
}

function indiceEstado(nombreEstado) {
	for (let i in arreglo_estados) {
		if (es_mismo_estado(nombreEstado,arreglo_estados[i][0])) {
			return i;
		}
	}
	console.warn("Estado "+nombreEstado+" no encontrado");
}

function valorPorNombreEstado(nombreEstado, indice){
	for (let i in arreglo_estados){
		if (es_mismo_estado(nombreEstado,arreglo_estados[i][0])){
			return parseFloat(arreglo_estados[i][arreglo_estados[i].length-1]);
		}
	}
	console.warn("Estado "+nombreEstado+" no encontrado");
}


function resaltaFeature(e,udm,nv) {
	if (!esta_locked) {
		let layer = e.target;
		layer.setStyle({
			fillOpacity: 1
		});
		cuadros_info.update(layer.feature.properties,udm,nv);
	}
}


function porFeature(feature, layer, udm,nv) {
	layer.on({
		mouseover: (d)=>resaltaFeature(d,udm,nv),
		mouseout: (e)=>{geojsonMapa.resetStyle(e.target);cuadros_info.hide();},
		mousedown: (e)=> {
			if (esta_locked) $(".overlay_entidad").css("background-color", "rgba(255, 255, 255, 0.8)");
			else $(".overlay_entidad").css("background-color", "rgba(255, 255, 255, 1)");
			esta_locked = !esta_locked;			
		},
	});
}




function minigrafica(datos_estado, arreglo_periodo,udm){
	 bb.generate({
			bindto: '.info',
			padding: {
				top: 10,
				left: 30,
				right: 10
			},
			data: {
				  x:"periodo",
				    columns: [arreglo_periodo,datos_estado],
				    type: "bar",
				    labels: true,
				    labels: {
					      colors: "black"
					    }
			},axis:{
				  y:{
					  label:udm,
					  tick: {
					        format: (x)=>formatData(""+x,udm)
					      }
				  }
			  },
			color: {
				pattern: ['#'+esquemasColoresPorClave[datosDGRU.right_key][1][0], '#'+esquemasColoresPorClave[datosDGRU.right_key][1][0]]
			},
			size: {
				width: 270,
				height: 200
			},tooltip: {
			    show: false
			  },
			legend: {
				show: false
			}
			,bar: {
			    width: {
				      ratio: 0.8
				    }
				  }

		}	);
}



function gamaDinamica(basehex,tamaño){
	let gama=[];
	let paso=60/tamaño;
	let hue=dameHue(basehex);
	for(let i=0;i<tamaño;i++){
		gama.push("hsl("+hue+",100%,"+(30+(i*paso))+"%)");
	}
	return gama;
}

function dameHue(H){
	let r = 0, g = 0, b = 0;
	r = "0x" + H[0] + H[1];
    g = "0x" + H[2] + H[3];
    b = "0x" + H[4] + H[5];
	  r /= 255;
	  g /= 255;
	  b /= 255;
	  let cmin = Math.min(r,g,b),
	      cmax = Math.max(r,g,b),
	      delta = cmax - cmin,
	      h = 0,
	      s = 0,
	      l = 0;

	  if (delta == 0)
	    h = 0;
	  else if (cmax == r)
	    h = ((g - b) / delta) % 6;
	  else if (cmax == g)
	    h = (b - r) / delta + 2;
	  else
	    h = (r - g) / delta + 4;

	  h = Math.round(h * 60);

	  if (h < 0)
	    h += 360;
	  return h;
	
}
