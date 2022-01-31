
const derechos_busqueda=[1,2,3,4,5,6,7,8];
var cant_ind_sel;
var arreglo_archivos;
var elzip;
var recursos_por_indicador={};

const mayusc = (s) => {
	  if (typeof s !== 'string') return ''
	  return s.charAt(0).toUpperCase() + s.slice(1)
	}

$( window ).on( "load", function() {
	d3.select("#dbdesc1").append("button").text("Descargar").on("click",descarga)
	d3.select("#dbdesc2").append("button").text("Descargar").on("click",descarga)

		for(let j in derechos_busqueda){
		    let url= 'json/'+derechos_busqueda[j]+'.json';
	        $.ajax({
	          type: 'GET',
	          url: url,
	          success: function( data, textStatus, jqxhr ) {
	             if(data.results.records!=null&&data.results.records.length>0){
	            	 data.results.records.sort(function(a, b){
	            		 let textA = a.indicator_sequence.toUpperCase();
	            		 let textB = b.indicator_sequence.toUpperCase();
	            		 return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	     			});
	            	 llenabusqueda(data.results.records);
	            	 
	             }
	            		
	
	          },
	          async:true
	        });
		}

});

function llenabusqueda(datos){
	$("#sin_resultados").hide()
	let id_derecho=datos[0].right_id;
	let div_nombre_derecho=d3.select("#resultados"+id_derecho).append("div").classed('divNombCateg CatNoAbrible dnctg'+id_derecho,true).style("background-color","#"+esquemasMonosaturadosPorId[id_derecho][1]).attr("name","div"+id_derecho).text(datos[0].right_name);
	let div_derecho=d3.select("#resultados"+id_derecho).append("div").classed('divContCateg dcctg'+id_derecho,true).style("background-color","#"+esquemasMonosaturadosPorId[id_derecho][7]);
	
	for(let i in datos){
		let clave=datos[i].indicator_code
		div_derecho.append("input")
			.attr("type","checkbox")
			.attr("id","cb"+clave)
			.attr("name","cb"+clave)
			.attr("value",clave)
			.classed("cbDerecho"+id_derecho,true);
		div_derecho.append("label")
			.attr("for","cb"+clave)
			.text(clave+" "+datos[i].indicator_name)
			.classed("labelDescarga",true)
			
		div_derecho.append("br");
		
	}
	div_nombre_derecho.on('click',function(){selectderecho(this)});

}

function fichacuali(data){
	let arreglo_ficha=[];
	
	arreglo_ficha.push(["Clave",data.indicator_code]);
	arreglo_ficha.push(["Derecho",data.right_name_short]);
	if(data.indicator_category_key=="d"||data.indicator_category_key=="i"||data.indicator_category_key=="j"){
		arreglo_ficha.push(["Principio Transversal",data.indicator_category_name]);
	}else{
		arreglo_ficha.push(["Categoría",data.indicator_category_name]);
	}
	arreglo_ficha.push(["Tipo",data.indicator_type_short]);
	arreglo_ficha.push(["Descripción",data.indicator_definition]);
	
	for(var i = 0; i< data.evidence.length; i++){
		arreglo_ficha.push(["",""]);
		arreglo_ficha.push(["Evidencia",data.evidence[i].evidence_name]);
		arreglo_ficha.push(["Entidad que valida",data.evidence[i].institution_name_evidencie])
		arreglo_ficha.push(["URL",data.evidence[i].evidence_url])
		arreglo_ficha.push(["Unidad de Observación",data.evidence[i].observation_unit_name])
		if(typeof data.evidence[i].objective !== 'undefined'){
			for(var k = 0; k< data.evidence[i].objective.length; k++){
				arreglo_ficha.push(["Objetivo "+data.evidence[i].objective[k].objective_sequence,data.evidence[i].objective[k].objective_name])
				if(data.evidence[i].objective[k].strategy_sequence != null){
					arreglo_ficha.push(["Estrategia "+data.evidence[i].objective[k].strategy_sequence, data.evidence[i].objective[k].strategy_name]);
				}
				if(data.evidence[i].objective[k].action_line_sequence != null){
					arreglo_ficha.push(["Línea de acción "+data.evidence[i].objective[k].action_line_sequence, data.evidence[i].objective[k].action_line_name]);
				}
			}
		}
		if(typeof data.evidence[i].complementary_attribute !== 'undefined'){
			for(var k = 0; k< data.evidence[i].complementary_attribute.length; k++){
				arreglo_ficha.push([data.evidence[i].complementary_attribute[k].complementary_attribute_name,data.evidence[i].complementary_attribute[k].complementary_attribute_description]);
			}
		}
		if(typeof data.evidence[i].paper !== 'undefined'){
			for(var k = 0; k< data.evidence[i].paper.length; k++){
				arreglo_ficha.push(["Artículo "+data.evidence[i].paper[k].paper_sequence,data.evidence[i].paper[k].paper_name]);
			}
		}
		if((typeof data.evidence[i].validity_year_start !== 'undefined')&&data.evidence[i].validity_year_start!=null&&data.evidence[i].validity_year_start>0){
			arreglo_ficha.push(["Vigencia",data.evidence[i].validity_year_start + '-' + data.evidence[i].validity_end_start]);
		}
		if((typeof data.evidence[i].update_date !== 'undefined')&&data.evidence[i].update_date!=null){
			arreglo_ficha.push(["Fecha de Consulta",data.evidence[i].update_date]);
		}
	}
	
	let nombre=data.indicator_name;
	
	let wb = XLSX.utils.book_new();
    wb.Props = {
            Title: nombre,
            Subject: "Indicador",
            Author: "PUDH UNAM",
            CreatedDate: new Date(2017,12,19)
    };
        
    wb.SheetNames.push("Ficha");
    let ws_metadatos = XLSX.utils.aoa_to_sheet(arreglo_ficha);
    wb.Sheets["Ficha"] = ws_metadatos;

    
    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) {

            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
            
    }
    elzip.file(data.indicator_code+'.xlsx', new Blob([s2ab(wbout)],{type:"application/octet-stream"}));
    cant_ind_sel--;
    if(cant_ind_sel==0){
    	elzip.generateAsync({type:"blob"})
    	.then(function(content) {
    		$.LoadingOverlay("hide");
    	    saveAs(content, "descarga.zip");
    	});
    }

}

function creaficha(clave){
	$.ajax({
		type: 'GET',
		url: "json/"+clave+".json",
		data: {},
		success: function( data, textStatus, jqxhr ) {      
			
			
			if(data.is_cuantitative == false){
				fichacuali(data);
			}else{
				fichacuanti(data);
			}
		},
	      error: function (xhr, ajaxOptions, thrownError) {
	          
	    	  console.log("error, otra vez "+thrownError);
	          creaficha(clave);
	        },
		async:true
	});
}

function fichacuanti(data){
	let arreglo_ficha=[];

	arreglo_ficha.push(["Clave",data.indicator_code]);
	arreglo_ficha.push(["Derecho",data.right_name_short]);
	if(data.indicator_category_key=="d"||data.indicator_category_key=="i"||data.indicator_category_key=="j"){
		arreglo_ficha.push(["Principio Transversal",data.indicator_category_name]);
	}else{
		arreglo_ficha.push(["Categoría",data.indicator_category_name]);
	}
	arreglo_ficha.push(["Tipo",data.indicator_type_short]);
	arreglo_ficha.push(["Definición",data.indicator_definition]);
	arreglo_ficha.push(["Entidad que reporta el indicador",data.responsible_institution]);
	arreglo_ficha.push(["Fórmula",data.indicator_formule_code]);
	if(data.indicator_calculation_element!=null) arreglo_ficha.push(["Elementos del cálculo",data.indicator_calculation_element]);
	if(data.indicator_calculation_element!=null) arreglo_ficha.push(["Fuente de la fórmula",data.indicator_source_formule]);
	arreglo_ficha.push(["Unidad de medida",data.indicator_measure_unit]);
	if(data.indicator_reference!=null) arreglo_ficha.push(["Referencia",data.indicator_reference]);
	if(data.indicator_observation!=null) arreglo_ficha.push(["Observación",data.indicator_observation]);
	arreglo_ficha.push(["Fecha de actualización",data.lastmodified]);
	
	if(data.breakdown_group.length>0){
		if(data.breakdown_group[0].breakdown_group_variable.length>0){
			var bgv=data.breakdown_group[0].breakdown_group_variable;
			
			bgv.sort(function(a, b){
				let var_a=a.variable[0];
				let var_b=b.variable[0];
				let ret=0;
				if(var_b.variable_level=="0"&&var_b.variable_level=="0"){
					if(var_b.variable_unit_measure.toLowerCase()=="porcentaje") ret=-5;
					else if(var_a.variable_unit_measure.toLowerCase()=="porcentaje") ret=5;

				}
				else ret=parseInt(var_b.variable_level)-parseInt(var_a.variable_level);
				return ret;
			});

			
			for(a in data.breakdown_group[0].breakdown_group_variable){
				var la_var=data.breakdown_group[0].breakdown_group_variable[a].variable[0];
				arreglo_ficha.push(["",""]);
				arreglo_ficha.push(["Variable",la_var["variable_name"]]);

				arreglo_ficha.push(["Fuente",la_var["variable_source"]]);
				if(la_var["variable_source_url"]!=null)arreglo_ficha.push(["URL",la_var["variable_source_url"]]);
				arreglo_ficha.push(["Unidad de medida",la_var["variable_unit_measure"]]);
				arreglo_ficha.push(["Periodicidad",la_var["periodicity_name"]]);
			} 
		}
	}
	
	let nombre=data.indicator_name;
	
	let wb = XLSX.utils.book_new();
    wb.Props = {
            Title: nombre,
            Subject: "Indicador",
            Author: "PUDH UNAM",
            CreatedDate: new Date(2017,12,19)
    };
        
    wb.SheetNames.push("Ficha");
    let ws_metadatos = XLSX.utils.aoa_to_sheet(arreglo_ficha);
    wb.Sheets["Ficha"] = ws_metadatos;
    
    descargaDatosCuanti(data,wb);

}

function descargaDatosCuanti(data,wb){
	let recursos=new Array();
	let cols_periodo=new Array();
	for(let i in data.breakdown_group){
		if(recursos.indexOf(data.breakdown_group[i].resource_id)==-1){
			recursos.push(data.breakdown_group[i].resource_id);
			cols_periodo.push(minusculas(data.breakdown_group[i].breakdown_attribute_years))
		}
	}
	recursos_por_indicador[data.indicator_code]=recursos.length;
	for(let i in recursos){
		jalaDatosAsynch(recursos[i],null,null,cols_periodo[i],null,(d)=>creaHojaCuanti(d,data,wb,i));
	}
	
}

function creaHojaCuanti(datos,data,wb,iterador){
	let columnas=Object.keys(datos[0]);
	columnas.shift();
	let tabla_resource=[];
	tabla_resource.push(columnas);
	for(let i in datos){
		let fila_temp=[];
		for(let j in columnas){
			fila_temp.push(datos[i][columnas[j]]);
		}
		tabla_resource.push(fila_temp);
		
	}
	wb.SheetNames.push("Datos "+iterador);
    let ws_temp = XLSX.utils.aoa_to_sheet(tabla_resource);
    wb.Sheets["Datos "+iterador] = ws_temp;
    recursos_por_indicador[data.indicator_code]--;
    if(recursos_por_indicador[data.indicator_code]==0){
    	console.log(".");
        let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s) {

                let buf = new ArrayBuffer(s.length);
                let view = new Uint8Array(buf);
                for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
                
        }
        elzip.file(data.indicator_code+'.xlsx', new Blob([s2ab(wbout)],{type:"application/octet-stream"}));
        cant_ind_sel--;
        if(cant_ind_sel==0){
        	elzip.generateAsync({type:"blob"})
        	.then(function(content) {
        		$.LoadingOverlay("hide");
        	    saveAs(content, "descarga.zip");
        	});
        }
    }
    
}

function descarga(){
	$.LoadingOverlay("show");
	let lista_claves=[];
	arreglo_archivos=[];
	cant_ind_sel=$("input:checked").length;
	elzip=new JSZip();
	 $( "input:checked" ).each(function(){ creaficha(this.value)});
	 
}

function selectderecho(divCat){
	let id_derecho=divCat.getAttribute("name").substr(3,1);
	
	for(let i in derechos_busqueda){
		if(id_derecho==derechos_busqueda[i]){
			$(".cbDerecho"+derechos_busqueda[i]).prop("checked",true)
		}
		else{
			$(".cbDerecho"+derechos_busqueda[i]).prop("checked",false)		
		}
	}
}