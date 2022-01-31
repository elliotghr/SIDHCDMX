const campos_busqueda=[
	"evidence_name",
	"indicator_definition_lit",
	"indicator_type",
	"indicator_name",
	"institution_code_evidencie",
	"institution_name_evidencie",
	"observation_unit_description",
	"observation_unit_name",
	"right_name",
	"right_name_short",
	"title",
	"paper_name",
	"complementary_attribute_description",
	"complementary_attribute_name",
	"indicator_justification",
	"responsible_institution",
	"indicator_calculation_element",
	"breakdown_group_name_lit",
	"institution_name_variable",
	"variable_source",
	"breakdown_description",
	"variable_name"
];

const derechos_busqueda=[1,2,3,4,5,6,7,8];

const mayusc = (s) => {
	  if (typeof s !== 'string') return ''
	  return s.charAt(0).toUpperCase() + s.slice(1)
	}

$( window ).on( "load", function() {
	let laurl=new URL(document.URL);
	let query=laurl.searchParams.get("q");
	
	if(query!=null){
		$("#campo_buscar")[0].value=query;
		let query_elements=query.split(" ");
		let elementos_busq=[];
		for(let k in query_elements){
			elementos_busq.push(query_elements[k].toLowerCase());
			elementos_busq.push(query_elements[k].toUpperCase());
			elementos_busq.push(mayusc(query_elements[k].toLowerCase()));
		}
		for(let j in derechos_busqueda){
			let url='https://datosabiertos.unam.mx/api/alice/search?institution_code=PUDH&right_id='+derechos_busqueda[j]+'&q=';
			for(let k in elementos_busq){
				for(let i in campos_busqueda){
					url+=campos_busqueda[i]+":*"+elementos_busq[k]+'*%20+%20';
				}
			}
			url=url.substr(0,url.length-7);
			url+="&fl=indicator_name,indicator_code,indicator_definition,indicator_sequence,guid,right_id,right_name&rows=100"
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
		
	}
});

function llenabusqueda(datos){
	$("#sin_resultados").hide()
	let id_derecho=datos[0].right_id;
	let div_nombre_derecho=d3.select("#resultados"+id_derecho).append("div").classed('divNombCateg CatAbierta dnctg'+id_derecho,true).style("background-color","#"+esquemasMonosaturadosPorId[id_derecho][1]).attr("name","div"+id_derecho).text(datos[0].right_name);
	let div_derecho=d3.select("#resultados"+id_derecho).append("div").classed('divContCateg dcctg'+id_derecho,true).style("background-color","#"+esquemasMonosaturadosPorId[id_derecho][7]);
	
	
	for(let i in datos){
		div_derecho.append("h3").append("a").attr("href", "indicador.html?codigo="+datos[i].guid).text(datos[i].indicator_code+" "+datos[i].indicator_name)
		div_derecho.append("p").text(datos[i].indicator_definition);
		
	}
	div_nombre_derecho.on('click',function(){abrecierra(this)});

}

function abrecierra(divCat){
	let id_derecho=divCat.getAttribute("name").substr(3,1);
	if(divCat.classList.contains("CatAbierta")){
		$('.dcctg'+id_derecho).hide();
		divCat.classList.remove("CatAbierta");
		divCat.classList.add("CatCerrada");
	}
	else{
		$('.dcctg'+id_derecho).show();
		divCat.classList.add("CatAbierta");
		divCat.classList.remove("CatCerrada");
	}
}