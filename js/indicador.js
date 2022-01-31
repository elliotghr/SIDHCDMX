// var rutaDGMX = "https://api.datos.gob.mx/v2/SNEDH-";
var rutaDGMX = "http://localhost:3000/SNEDH-";
var datosDGRU = null;
var datosDGM = null;
var sbdg = 0; //breakdowngroup seleccionado
var sbd = 0; //breakdown seleccionado
var speriodo = 0; //periodo seleccionado
var spg = 0;
var comparando_periodos = true;
var recursos_a_descargar = 0;
var hojas_a_descargar;

String.prototype.replaceAll = function (s, r) {
  return this.replace(new RegExp(s, "g"), r);
};

function revisaDeciles(desgloses) {
  var ret = [desgloses.length];
  for (var i = 0; i < desgloses.length; i++) {
    if (desgloses[i] == "I" || desgloses[i] == "II")
      ret[i] = desgloses[i] + " ";
    else ret[i] = desgloses[i];
  }
  return ret;
}

function roman_to_Int(str1) {
  let valores_caracteres = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  if (str1 == null) return -1;
  var num = valores_caracteres[str1.charAt(0)];
  var pre, curr;

  for (var i = 1; i < str1.length; i++) {
    curr = valores_caracteres[str1.charAt(i)];
    pre = valores_caracteres[str1.charAt(i - 1)];
    if (curr <= pre) {
      num += curr;
    } else {
      num = num - pre * 2 + curr;
    }
  }

  return num;
}

function parseAttYears(attyears) {
  let ret;
  if (attyears === "Año" || attyears === "anio") {
    ret = "fecha";
  } else if (attyears === "Año_de_referencia") {
    ret = "ano-de-referencia";
  } else {
    ret = minusculas(attyears);
  }
  return ret;
}

function remplaza_espacios(string) {
  return string == null ? null : string.replace(/ /g, "%20");
}

function parseAPI(string) {
  return string == null ? null : string.replace(/_/g, "-");
}

function sinEspacios(dato) {
  var contenido = dato;
  contenido = contenido.replace(/ /g, "");
  contenido = contenido.replace(/á/g, "a");
  contenido = contenido.replace(/é/g, "e");
  contenido = contenido.replace(/í/g, "i");
  contenido = contenido.replace(/ó/g, "o");
  contenido = contenido.replace(/ú/g, "u");
  contenido = contenido.replace(/ñ/g, "n");
  return contenido;
}

function minusculas(dato) {
  var contenido = dato;
  if (contenido === null || contenido === "") {
    contenido = contenido;
  } else {
    contenido = contenido.toLowerCase();
    contenido = contenido.replace(/ - /g, "-");
    contenido = contenido.replace(/[ .,"_()/¡¢]/g, "-");
    contenido = contenido.replace(/[;:%]/g, "");
    contenido = contenido.replace(/á/g, "a");
    contenido = contenido.replace(/é/g, "e");
    contenido = contenido.replace(/í/g, "i");
    contenido = contenido.replace(/ó/g, "o");
    contenido = contenido.replace(/ú/g, "u");
    contenido = contenido.replace(/ñ/g, "n");
    contenido = contenido.replace(/--/g, "-");
    contenido = contenido.replace(/--/g, "-");
    if (contenido.endsWith("-")) contenido = contenido.slice(0, -1);
  }

  return contenido;
}

function fixFormatSpelling(contenido) {
  if (contenido != null) {
    contenido = contenido.replace(/_/g, " ");
    contenido = contenido.replace("poblacion", "población");
    contenido = contenido.replace("indigena", "indígena");
    contenido = contenido.replace("anios", "años");
    contenido = contenido.replace(" mas", " más");
    contenido = contenido.replace("si ", "sí ");

    contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1);
  }
  return contenido;
}

function formatData(data, unit, tienedecimales) {
  let ret = "";
  if (tienedecimales) data = parseFloat(data).toFixed(2);
  if (minusculas(unit) == "porcentaje" && !data.includes("%") && data != "") {
    ret = data + "%";
  } else if (parseInt(data, 10) > 1000) {
    ret = data.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    ret = data;
  }
  return ret;
}

const alias_entidades = {
  Aguascalientes: ["entidad01"],
  "Baja California": ["entidad02"],
  "Baja California Sur": ["entidad03"],
  Campeche: ["entidad04"],
  "Coahuila de Zaragoza": ["entidad05", "coahulia", "coahuila"],
  Colima: ["entidad06"],
  Chiapas: ["entidad07"],
  Chihuahua: ["entidad08"],
  "Ciudad de México": ["entidad09", "distrito-federal"],
  Durango: ["entidad10"],
  Guanajuato: ["entidad11"],
  Guerrero: ["entidad12"],
  Hidalgo: ["entidad13"],
  Jalisco: ["entidad14"],
  México: ["entidad15", "estado-de-mexico"],
  "Michoacán de Ocampo": ["entidad16", "michoacan"],
  Morelos: ["entidad17"],
  Nayarit: ["entidad18"],
  "Nuevo León": ["entidad19"],
  Oaxaca: ["entidad20"],
  Puebla: ["entidad21"],
  Querétaro: ["entidad22"],
  "Quintana Roo": ["entidad23"],
  "San Luis Potosí": ["entidad24"],
  Sinaloa: ["entidad25"],
  Sonora: ["entidad26"],
  Tabasco: ["entidad27"],
  Tamaulipas: ["entidad28"],
  Tlaxcala: ["entidad29"],
  "Veracruz de Ignacio de la Llave": ["entidad30", "veracruz"],
  Yucatán: ["entidad31"],
  Zacatecas: ["entidad32"],
};

function es_mismo_estado(original, nuevo) {
  nuevo = nuevo.replaceAll(String.fromCharCode(144), ""); //caracter raro que luego sale en SS
  if (minusculas(original) == minusculas(nuevo)) return true;
  if (alias_entidades[original].indexOf(minusculas(nuevo)) > -1) return true;
  return false;
}

function linkify(inputText) {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>'
  );

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>'
  );

  return replacedText;
}

function agregaFilaMetadatos(cuerpo, tipo, dato) {
  dato = dato.replaceAll("\n", "\n<br>");
  var fila = cuerpo.insertRow();
  var celda1 = fila.insertCell();
  celda1.innerText = tipo;
  var celda2 = fila.insertCell();
  celda2.innerHTML = linkify(dato);
  return fila;
}

function tablacuali(data) {
  $("#pestañitas").hide();
  $("#AccordionGraficas").hide();
  var esquemaColores = esquemasColoresPorClave[data.right_key];
  $("#AccordionInd")[0].children[0].children[0].children[0].innerText =
    data.indicator_name;
  var tabla = document.createElement("table");
  tabla.classList.add("tablaMetadatos");
  var cuerpo = tabla.createTBody();
  agregaFilaMetadatos(cuerpo, "Clave", data.indicator_code);
  agregaFilaMetadatos(cuerpo, "Derecho", data.right_name_short);
  if (
    data.indicator_category_key == "d" ||
    data.indicator_category_key == "i" ||
    data.indicator_category_key == "j"
  ) {
    agregaFilaMetadatos(
      cuerpo,
      "Principio Transversal",
      data.indicator_category_name
    );
  } else {
    agregaFilaMetadatos(cuerpo, "Categoría", data.indicator_category_name);
  }
  agregaFilaMetadatos(cuerpo, "Tipo", data.indicator_type_short);
  agregaFilaMetadatos(cuerpo, "Descripción", data.indicator_definition);

  $("#indicador_contenido").append(tabla);

  if (
    data.evidence.length == 0 ||
    data.evidence[0].evidence_name == "Evidencia vacía"
  ) {
    $("#AccordionEvidencias").hide();
  } else {
    for (var i = 0; i < data.evidence.length; i++) {
      var barrita = document.createElement("hr");
      barrita.style.borderTop = "2px solid #" + esquemaColores[1][0];
      $("#evidencia_contenido").append(barrita);
      titulito = document.createElement("h3");
      titulito.classList.add("evidencia");
      titulito.innerText = data.evidence[i].evidence_name;
      $("#evidencia_contenido").append(titulito);
      var tabla_ev = document.createElement("table");
      tabla_ev.classList.add("tablaMetadatos");
      var cuerpo_ev = tabla_ev.createTBody();

      cuerpo_ev.insertRow();
      var fila_esc = cuerpo_ev.insertRow();
      fila_esc.insertCell().innerText = "Evidencia";
      fila_esc.insertCell().innerText = data.evidence[i].evidence_name;
      fila_esc.style.display = "none";

      agregaFilaMetadatos(
        cuerpo_ev,
        "Entidad que valida",
        data.evidence[i].institution_name_evidencie
      );
      agregaFilaMetadatos(cuerpo_ev, "URL", data.evidence[i].evidence_url);
      agregaFilaMetadatos(
        cuerpo_ev,
        "Unidad de Observación",
        data.evidence[i].observation_unit_name
      );
      if (typeof data.evidence[i].objective !== "undefined") {
        for (var k = 0; k < data.evidence[i].objective.length; k++) {
          agregaFilaMetadatos(
            cuerpo_ev,
            "Objetivo " + data.evidence[i].objective[k].objective_sequence,
            data.evidence[i].objective[k].objective_name
          );
          if (data.evidence[i].objective[k].strategy_sequence != null) {
            var fila_estrategia = agregaFilaMetadatos(
              cuerpo_ev,
              "Estrategia " + data.evidence[i].objective[k].strategy_sequence,
              data.evidence[i].objective[k].strategy_name
            );
            fila_estrategia.children[0].style.paddingLeft = "30px";
          }
          if (data.evidence[i].objective[k].action_line_sequence != null) {
            var fila_estrategia = agregaFilaMetadatos(
              cuerpo_ev,
              "Línea de acción " +
                data.evidence[i].objective[k].action_line_sequence,
              data.evidence[i].objective[k].action_line_name
            );
            fila_estrategia.children[0].style.paddingLeft = "50px";
          }
        }
      }
      if (typeof data.evidence[i].complementary_attribute !== "undefined") {
        for (
          var k = 0;
          k < data.evidence[i].complementary_attribute.length;
          k++
        ) {
          agregaFilaMetadatos(
            cuerpo_ev,
            data.evidence[i].complementary_attribute[k]
              .complementary_attribute_name,
            data.evidence[i].complementary_attribute[k]
              .complementary_attribute_description
          );
        }
      }
      if (typeof data.evidence[i].paper !== "undefined") {
        for (var k = 0; k < data.evidence[i].paper.length; k++) {
          agregaFilaMetadatos(
            cuerpo_ev,
            "Artículo " + data.evidence[i].paper[k].paper_sequence,
            data.evidence[i].paper[k].paper_name
          );
        }
      }
      if (
        typeof data.evidence[i].validity_year_start !== "undefined" &&
        data.evidence[i].validity_year_start != null &&
        data.evidence[i].validity_year_start > 0
      ) {
        agregaFilaMetadatos(
          cuerpo_ev,
          "Vigencia",
          data.evidence[i].validity_year_start +
            "-" +
            data.evidence[i].validity_end_start
        );
      }
      if (
        typeof data.evidence[i].update_date !== "undefined" &&
        data.evidence[i].update_date != null
      ) {
        agregaFilaMetadatos(
          cuerpo_ev,
          "Fecha de Consulta",
          data.evidence[i].update_date
        );
      }
      $("#evidencia_contenido").append(tabla_ev);
    }
  }
}

function indicadorCuantitativo(data) {
  $("#AccordionEvidencias").hide();
  var esquemaColores = esquemasColoresPorClave[data.right_key];
  $("#AccordionInd")[0].children[0].children[0].children[0].innerText =
    data.indicator_name;
  var tabla = document.createElement("table");
  tabla.classList.add("tablaMetadatos");
  var cuerpo = tabla.createTBody();
  agregaFilaMetadatos(cuerpo, "Clave", data.indicator_code);
  agregaFilaMetadatos(cuerpo, "Derecho", data.right_name_short);
  if (
    data.indicator_category_key == "d" ||
    data.indicator_category_key == "i" ||
    data.indicator_category_key == "j"
  ) {
    agregaFilaMetadatos(
      cuerpo,
      "Principio Transversal",
      data.indicator_category_name
    );
  } else {
    agregaFilaMetadatos(cuerpo, "Categoría", data.indicator_category_name);
  }
  agregaFilaMetadatos(cuerpo, "Tipo", data.indicator_type_short);
  agregaFilaMetadatos(cuerpo, "Definición", data.indicator_definition);
  agregaFilaMetadatos(
    cuerpo,
    "Entidad que reporta el indicador",
    data.responsible_institution
  );
  agregaFilaMetadatos(cuerpo, "Fórmula", data.indicator_formule_code);
  if (data.indicator_calculation_element != null)
    agregaFilaMetadatos(
      cuerpo,
      "Elementos del cálculo",
      data.indicator_calculation_element
        .replace(/\"/g, "")
        .replace(/\*\$/g, "$*")
    );
  if (data.indicator_calculation_element != null)
    agregaFilaMetadatos(
      cuerpo,
      "Fuente de la fórmula",
      data.indicator_source_formule
    );
  agregaFilaMetadatos(cuerpo, "Unidad de medida", data.indicator_measure_unit);
  if (data.indicator_reference != null)
    agregaFilaMetadatos(cuerpo, "Referencia", data.indicator_reference);
  if (data.indicator_observation != null)
    agregaFilaMetadatos(cuerpo, "Observación", data.indicator_observation);
  agregaFilaMetadatos(cuerpo, "Fecha de actualización", data.lastmodified); //moment(data.lastmodified).format('DD-MM-YYYY')
  agregaFilaMetadatos(cuerpo, "Descargar ficha", "<pendiente>");

  $("#tab-metadatos").append(tabla);

  if (data.breakdown_group.length > 0) {
    if (data.breakdown_group[0].breakdown_group_variable.length > 0) {
      var brealine = document.createElement("br");
      $("#tab-metadatos").append(brealine);
      var subt_vars = document.createElement("h2");
      subt_vars.innerText = "Variables";
      $("#tab-metadatos").append(subt_vars);

      var bgv = data.breakdown_group[0].breakdown_group_variable;

      bgv.sort(function (a, b) {
        let var_a = a.variable[0];
        let var_b = b.variable[0];
        let ret = 0;
        if (var_b.variable_level == "0" && var_b.variable_level == "0") {
          if (minusculas(var_b.variable_unit_measure) == "porcentaje") ret = -5;
          else if (minusculas(var_a.variable_unit_measure) == "porcentaje")
            ret = 5;
        } else ret = parseInt(var_b.variable_level) - parseInt(var_a.variable_level);
        return ret;
      });

      for (a in data.breakdown_group[0].breakdown_group_variable) {
        var barrita2 = document.createElement("hr");
        barrita2.style.borderTop = "2px solid #" + esquemaColores[1][0];
        $("#tab-metadatos").append(barrita2);
        var la_var =
          data.breakdown_group[0].breakdown_group_variable[a].variable[0];
        var subt_nom_var = document.createElement("h3");
        subt_nom_var.innerText = la_var["variable_name"];
        $("#tab-metadatos").append(subt_nom_var);

        var tabla_var = document.createElement("table");
        tabla_var.classList.add("tablaMetadatos");
        var cuerpo_var = tabla_var.createTBody();
        //agregamos una fila escondida para que a la hora de hacer el excel se integre el nombre de la variable
        cuerpo_var.insertRow();
        var fila_esc = cuerpo_var.insertRow();
        fila_esc.insertCell().innerText = "Variable";
        fila_esc.insertCell().innerText = la_var["variable_name"];
        fila_esc.style.display = "none";

        //--
        agregaFilaMetadatos(cuerpo_var, "Fuente", la_var["variable_source"]);
        if (la_var["variable_source_url"] != null)
          agregaFilaMetadatos(cuerpo_var, "URL", la_var["variable_source_url"]);
        agregaFilaMetadatos(
          cuerpo_var,
          "Unidad de medida",
          la_var["variable_unit_measure"]
        );
        agregaFilaMetadatos(
          cuerpo_var,
          "Periodicidad",
          la_var["periodicity_name"]
        );
        $("#tab-metadatos").append(tabla_var);
      }
    }
  }

  var tieneBreakdown = data.breakdown_group != null;
  if (tieneBreakdown) {
    var div_desgloses = document.createElement("div");
    div_desgloses.id = "divDesgloses";
    div_desgloses.classList.add("row");

    var div_select = document.createElement("div");
    div_select.classList.add("col-md-9");
    div_select.id = "divSelect";

    var div_bdg = document.createElement("div");
    div_bdg.id = "divBDG";

    var bdg_select = document.createElement("select");
    bdg_select.name = "bdgSelect";
    bdg_select.id = "bdgSelect";
    if (data.breakdown_group.length > 1) {
      var bdg_sel_span = document.createElement("span");
      bdg_sel_span.innerText = "Tipo de desglose:";
      div_bdg.appendChild(bdg_sel_span);
    } else {
      bdg_select.style = "display:none";
    }
    sbdg = 0;
    for (i in data.breakdown_group) {
      var option = document.createElement("option");
      option.text = data.breakdown_group[i].breakdown_group_name;
      option.value = i;
      bdg_select.add(option);
      if (option.text == "Total") {
        option.defaultSelected = true;
        sbdg = i;
      }
      /*if(option.text=="Entidad federativa"){
				option.defaultSelected=true;
				sbdg=i;
			}*/
    }
    div_bdg.appendChild(bdg_select);
    div_select.appendChild(div_bdg);

    var div_bd = document.createElement("div");
    div_bd.id = "divBD";
    var bd_select = document.createElement("select");
    bd_select.name = "bdSelect";
    bd_select.id = "bdSelect";
    var bd_sel_span = document.createElement("span");
    bd_sel_span.innerText = "Desglose específico:";
    div_bd.appendChild(bd_sel_span);

    if (data.breakdown_group[sbdg].breakdown_resource_name.length <= 1) {
      div_bd.style = "display:none";
    }

    sbd = 0;
    for (i in data.breakdown_group[sbdg].breakdown_resource_name) {
      var option = document.createElement("option");
      option.text = fixFormatSpelling(
        data.breakdown_group[sbdg].breakdown_resource_name[i]
      );
      option.value = i;
      bd_select.add(option);
    }
    div_bd.appendChild(bd_select);

    div_select.appendChild(div_bd);

    var div_periodo = document.createElement("div");
    div_periodo.id = "divPeriodo";

    var periodos =
      typeof data.breakdown_group[sbdg].breakdown_group_year !== "undefined"
        ? data.breakdown_group[sbdg].breakdown_group_year
        : "";

    if (periodos.length !== 0) {
      var periodo_select = document.createElement("select");
      periodo_select.name = "periodoSelect";
      periodo_select.id = "periodoSelect";
      if (data.breakdown_group[sbdg].breakdown_group_year.length > 1) {
        var periodo_select_span = document.createElement("span");
        periodo_select_span.innerText = "Periodo:";
        div_periodo.appendChild(periodo_select_span);
      } else {
        periodo_select.style = "display:none";
      }

      for (i in data.breakdown_group[sbdg].breakdown_group_year) {
        var option = document.createElement("option");
        option.text = data.breakdown_group[sbdg].breakdown_group_year[i];
        option.value = data.breakdown_group[sbdg].breakdown_group_year[i];
        periodo_select.add(option);
      }
      div_periodo.appendChild(periodo_select);
      div_select.appendChild(div_periodo);
    }
    div_desgloses.appendChild(div_select);

    var div_botones = document.createElement("div");
    div_botones.classList.add("col-md-3");
    div_botones.id = "divBotones";

    var boton_comparar_desgloses = document.createElement("button");
    boton_comparar_desgloses.id = "botonCompararDesgloses";
    boton_comparar_desgloses.innerText = "Comparar Desgloses";
    boton_comparar_desgloses.classList.add("btn");
    boton_comparar_desgloses.classList.add("btn-success");
    div_botones.appendChild(boton_comparar_desgloses);

    var boton_comparar_periodos = document.createElement("button");
    boton_comparar_periodos.id = "botonCompararPeriodos";
    boton_comparar_periodos.innerText = "Comparar Periodos";
    boton_comparar_periodos.classList.add("btn");
    boton_comparar_periodos.classList.add("btn-success");
    div_botones.appendChild(boton_comparar_periodos);
    div_desgloses.append(div_botones);

    $("#tab-indicador").append(div_desgloses);
    if (datosDGRU.breakdown_group.length <= 1) $("#divDesgloses").hide();
    var div_tabla_datos = document.createElement("div");
    div_tabla_datos.id = "divTablaDatos";
    $("#tab-indicador").append(div_tabla_datos);

    let tab_boton_tabla = d3
      .select("#tab-indicador")
      .insert("div")
      .attr("id", "tab-boton-tabla")
      .style("text-align", "right");
    tab_boton_tabla
      .insert("button")
      .attr("id", "b_desc_tabla")
      .classed("btn btn-default", true)
      .text("Descargar Tabla")
      .on("click", descargaTabla);
    tab_boton_tabla
      .insert("button")
      .attr("id", "b_desc_tabla")
      .classed("btn btn-default", true)
      .text("Descargar Fuente Datos Abiertos")
      .on("click", descargaFuente);

    $("#botonVerTabla").hide();
    $("#botonCompararPeriodos").hide();
    comparando_periodos = true;
    $("#divPeriodo").hide();

    $("#bdSelect").on("change", function () {
      sbd = $("#bdSelect option:selected")[0].value;
      speriodo = $("#periodoSelect option:selected")[0].value;
      construyeTablaDatos(datosDGRU, comparando_periodos, sbdg, sbd, speriodo);
    });

    $("#periodoSelect").on("change", function () {
      sbd = $("#bdSelect option:selected")[0].value;
      speriodo = $("#periodoSelect option:selected")[0].value;
      construyeTablaDatos(datosDGRU, comparando_periodos, sbdg, sbd, speriodo);
    });

    $("#bdgSelect").on("change", function () {
      sbdg = $("#bdgSelect option:selected")[0].value;

      if (
        datosDGRU.breakdown_group[sbdg].breakdown_resource_name.length <= 1 ||
        !comparando_periodos
      ) {
        $("#divBD").hide();
      } else {
        $("#divBD").show();
      }

      sbd = 0;
      $("#bdSelect").empty();
      for (i in datosDGRU.breakdown_group[sbdg].breakdown_resource_name) {
        var option = document.createElement("option");
        option.text = fixFormatSpelling(
          datosDGRU.breakdown_group[sbdg].breakdown_resource_name[i]
        );
        option.value = i;
        $("#bdSelect").append(option);
      }
      sbd =
        $("#bdSelect option").length > 0
          ? $("#bdSelect option:selected")[0].value
          : 0;
      speriodo = $("#periodoSelect option:selected")[0].value;
      construyeTablaDatos(datosDGRU, comparando_periodos, sbdg, sbd, speriodo);

      $("#div_botones_graficas").empty();
      for (let i in datosDGRU.breakdown_group[sbdg].graphic) {
        d3.select("#div_botones_graficas")
          .append("button")
          .attr(
            "id",
            "boton_grafica_" +
              datosDGRU.breakdown_group[sbdg].graphic[i].graphic_key
          )
          .attr("class", "btn btn-default btn-sm")
          .text(datosDGRU.breakdown_group[sbdg].graphic[i].graphic_name)
          .on("click", () =>
            construyeGrafica(
              datosDGRU.breakdown_group[sbdg].graphic[i].graphic_key
            )
          );
      }
      $("#div_botones_graficas button:first").click();
      //$("#boton_grafica_Mapa").click();
    });

    $("#botonCompararDesgloses").on("click", function () {
      $("#botonCompararDesgloses").hide();
      $("#botonCompararPeriodos").show();
      $("#divBD").hide();
      $("#divPeriodo").show();
      comparando_periodos = false;
      sbd = $("#bdSelect option:selected")[0].value;
      speriodo = $("#periodoSelect option:selected")[0].value;
      construyeTablaDatos(datosDGRU, comparando_periodos, sbdg, sbd, speriodo);
    });

    $("#botonCompararPeriodos").on("click", function () {
      $("#botonCompararDesgloses").show();
      $("#botonCompararPeriodos").hide();
      $("#divBD").show();
      $("#divPeriodo").hide();
      comparando_periodos = true;
      sbd = $("#bdSelect option:selected")[0].value;
      speriodo = $("#periodoSelect option:selected")[0].value;
      construyeTablaDatos(datosDGRU, comparando_periodos, sbdg, sbd, speriodo);
    });

    construyeTablaDatos(datosDGRU, comparando_periodos, sbdg, sbd, speriodo);

    for (let i in datosDGRU.breakdown_group[sbdg].graphic) {
      d3.select("#div_botones_graficas")
        .append("button")
        .attr(
          "id",
          "boton_grafica_" +
            datosDGRU.breakdown_group[sbdg].graphic[i].graphic_key
        )
        .attr("class", "btn btn-default btn-sm")
        .text(datosDGRU.breakdown_group[sbdg].graphic[i].graphic_name)
        .on("click", () => {
          construyeGrafica(
            datosDGRU.breakdown_group[sbdg].graphic[i].graphic_key
          );
        });
    }

    d3.select("#div_variable").append("span").text("Variable:");
    let select_variables = d3
      .select("#div_variable")
      .append("select")
      .attr("name", "select_variables")
      .attr("id", "select_variables")
      .style("width", "90%");
    let opciones_variables = select_variables
      .selectAll("option")
      .data(data.breakdown_group[sbdg].breakdown_group_variable)
      .enter()
      .append("option")
      .text((d) => d.variable[0].variable_name)
      .attr("value", (d, i) => i);
    select_variables.on("change", () => {
      construyeGrafica("");
    });
    $("#select_variables option:last").selected();

    d3.select("#div_periodo_gra").append("span").text("Periodo:");
    let select_periodos_gra = d3
      .select("#div_periodo_gra")
      .append("select")
      .attr("name", "select_periodo_gra")
      .attr("id", "select_periodo_gra");
    let opciones_periodos = select_periodos_gra
      .selectAll("option")
      .data(datosDGRU.breakdown_group[sbdg].breakdown_group_year)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d, i) => d);
    select_periodos_gra.on("change", () => {
      spg = $("#select_periodo_gra option:selected")[0].value;
      construyeGrafica("");
    });
    $("#select_periodo_gra option:last").selected();
    spg = $("#select_periodo_gra option:selected")[0].value;

    d3.select("#div_desc_graf")
      .insert("button")
      .text("Descargar")
      .classed("btn btn-default", true)
      .on("click", () => {
        var esmapa = $("#mapid")[0].style.display != "none";
        if (esmapa) {
          domtoimage
            .toBlob(document.getElementById("mapid"))
            .then(function (blob) {
              recortaImagen(blob);
              //saveAs(blob, 'my-node.png');
            });
        } else {
          let canvas = $("#div_grafica_bb")[0].children[0];
          canvas.style.backgroundColor = "white";

          chart.export("image/png", (dataUrl) => {
            const link = document.createElement("a");
            link.download = "Grafica" + datosDGRU.indicator_code + ".png";
            link.href = dataUrl;
            link.innerHTML = "Download chart as image";
            $("#div_oculto")[0].appendChild(link);
            link.click();
          });
        }
        /* este no sirve porque no toma en cuenta el css
				saveSvgAsPng(canvas,"Grafica"+datosDGRU.indicator_code+".png")*/
      });

    $("#bdgSelect").change();
  }
}

function recortaImagen(blob) {
  const inputImage = new Image();

  // we want to wait for our image to load
  inputImage.onload = () => {
    // create a canvas that will present the output image
    const outputImage = document.createElement("canvas");

    // set it to the same size as the image
    outputImage.width = $("#mapid")[0].offsetWidth; //inputImage.naturalWidth;
    outputImage.height = $("#mapid")[0].offsetHeight; //inputImage.naturalHeight;

    // draw our image at position 0, 0 on the canvas
    const ctx = outputImage.getContext("2d");
    ctx.drawImage(inputImage, 0, 0);

    saveAs(outputImage.toDataURL(), "hola.png");

    // show both the image and the canvas
    //document.body.appendChild(inputImage);
    //document.body.appendChild(outputImage);
  };

  // start loading our image
  inputImage.src = URL.createObjectURL(blob); //imageURL;
}

function descargaFuente() {
  let recursos = new Array();
  let cols_periodo = new Array();
  for (let i in datosDGRU.breakdown_group) {
    if (recursos.indexOf(datosDGRU.breakdown_group[i].resource_id) == -1) {
      recursos.push(datosDGRU.breakdown_group[i].resource_id);
      cols_periodo.push(
        minusculas(datosDGRU.breakdown_group[i].breakdown_attribute_years)
      );
    }
  }
  recursos_a_descargar = recursos.length;
  hojas_a_descargar = [];
  for (let i in recursos) {
    jalaDatosAsynch(
      recursos[i],
      null,
      null,
      cols_periodo[i],
      null,
      generaExcelFuente
    );
  }
}

function generaExcelFuente(datos) {
  let columnas = Object.keys(datos[0]);
  columnas.shift();
  let tabla_resource = [];
  tabla_resource.push(columnas);
  for (let i in datos) {
    let fila_temp = [];
    for (let j in columnas) {
      fila_temp.push(datos[i][columnas[j]]);
    }
    tabla_resource.push(fila_temp);
  }
  hojas_a_descargar.push(tabla_resource);
  recursos_a_descargar--;
  if (recursos_a_descargar == 0) {
    let nombre = datosDGRU.indicator_name;
    let wb = XLSX.utils.book_new();
    wb.Props = {
      Title: nombre,
      Subject: "Test",
      Author: "PUDH UNAM",
      CreatedDate: new Date(2017, 12, 19),
    };
    for (let i in hojas_a_descargar) {
      wb.SheetNames.push("Datos " + i);
      let ws_temp = XLSX.utils.aoa_to_sheet(hojas_a_descargar[i]);
      wb.Sheets["Datos " + i] = ws_temp;
    }
    let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      nombre + ".xlsx"
    );
  }
}

function descargaFicha() {
  let nombre = datosDGRU.indicator_name;

  let ArregloMetadatos = new Array();
  $(".tablaMetadatos tr").each(function (row, tr) {
    let arreglofila = new Array();
    $(tr)
      .children()
      .each(function (num_celda, celda) {
        arreglofila[num_celda] = celda.innerText;
      });

    ArregloMetadatos[row] = arreglofila;
  });

  let wb = XLSX.utils.book_new();
  wb.Props = {
    Title: nombre,
    Subject: "Indicador",
    Author: "PUDH UNAM",
    CreatedDate: new Date(2017, 12, 19),
  };

  wb.SheetNames.push("Metadatos");
  let ws_metadatos = XLSX.utils.aoa_to_sheet(ArregloMetadatos);
  wb.Sheets["Metadatos"] = ws_metadatos;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    nombre + ".xlsx"
  );
}

function descargaTabla(a, b, c) {
  let ArregloMetadatos = new Array();
  $(".tablaMetadatos tr").each(function (row, tr) {
    let arreglofila = new Array();
    $(tr)
      .children()
      .each(function (num_celda, celda) {
        arreglofila[num_celda] = celda.innerText;
      });

    ArregloMetadatos[row] = arreglofila;
  });

  let DatosTabla = new Array();
  $(".tablaDatos tr").each(function (row, tr) {
    let arreglofila = new Array();
    $(tr)
      .children()
      .each(function (num_celda, celda) {
        arreglofila[num_celda] = celda.innerText;
      });

    DatosTabla[row] = arreglofila;
  });
  let arreglopie = new Array();

  $(".tablaDatos tfoot")
    .children()
    .each(function (num_celda, celda) {
      arreglopie[num_celda] = celda.innerText;
    });
  DatosTabla.push(arreglopie);

  let nombre = datosDGRU.indicator_name;
  let desglose = datosDGRU.breakdown_group[sbdg].breakdown_group_name;

  let wb = XLSX.utils.book_new();
  wb.Props = {
    Title: nombre + " - " + desglose,
    Subject: "Test",
    Author: "PUDH UNAM",
    CreatedDate: new Date(2017, 12, 19),
  };

  wb.SheetNames.push("Datos");
  let ws_temp = XLSX.utils.aoa_to_sheet(DatosTabla);
  wb.Sheets["Datos"] = ws_temp;

  wb.SheetNames.push("Metadatos");
  let ws_metadatos = XLSX.utils.aoa_to_sheet(ArregloMetadatos);
  wb.Sheets["Metadatos"] = ws_metadatos;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    nombre + ".xlsx"
  );
}

function construyeTablaDatos(data, pordesglose, nbdg, nbd, periodo) {
  let desgloses = revisaDeciles(
    data.breakdown_group[nbdg].breakdown_resource_name
  );
  let variable_resultado = minusculas(
    parseAPI(data.breakdown_group[nbdg].breakdown_attribute_result)
  );
  let columna_desglose = minusculas(
    parseAPI(data.breakdown_group[nbdg].breakdown_attribute)
  );
  let columna_periodo = parseAttYears(
    data.breakdown_group[nbdg].breakdown_attribute_years
  );
  let nombre_grupo_desglose = data.breakdown_group[nbdg].breakdown_group_name;
  let variables = data.breakdown_group[nbdg].breakdown_group_variable;

  variables.sort(function (a, b) {
    var var_a = a.variable[0];
    var var_b = b.variable[0];
    return parseInt(var_a.variable_level) - parseInt(var_b.variable_level);
  });

  for (var i in variables) {
    if (variables[i].variable_breakdown_group_name != null) {
      variables[i].nombre_columna = minusculas(
        parseAPI(variables[i].variable_breakdown_group_name)
      );
    }
  }

  let arreglo_datos = [];
  let temp_periodo = periodo;
  let temp_desglose = [];

  if (pordesglose) {
    temp_periodo = null;
    temp_desglose.push(desgloses[nbd]);
  } else {
    temp_desglose = desgloses;
  }

  var tabla = document.createElement("table");
  let pie = tabla.createTFoot();
  tabla.classList.add("tablaDatos");
  tabla.classList.add(data.right_key);
  var cabeza = tabla.createTHead();
  var encabezado = cabeza.insertRow();
  var th = document.createElement("th");

  if (pordesglose) {
    if (columna_periodo.includes("ciclo")) th.style.width = "80px";
    th.innerText = "Periodo";
  } else {
    th.innerText = nombre_grupo_desglose;
  }
  encabezado.appendChild(th);
  pie.appendChild(document.createElement("td"));
  for (let i in variables) {
    th = document.createElement("th");
    let tdunidad = document.createElement("td");
    th.innerText = variables[i].variable[0].variable_name;
    tdunidad.innerText = variables[i].variable[0].variable_unit_measure;
    encabezado.appendChild(th);
    pie.appendChild(tdunidad);
  }

  let lafuncion = (d) => {
    rellenaTabla(
      d,
      tabla,
      columna_periodo,
      columna_desglose,
      variables,
      pordesglose
    );
    $("table.tablaDatos th").css(
      "background-color",
      "#" + esquemasMonosaturadosPorId[datosDGRU.right_id][1]
    );
    $("table.tablaDatos tr").hover(
      function () {
        $(this).css(
          "background-color",
          "#" + esquemasMonosaturadosPorId[datosDGRU.right_id][7]
        );
      },
      function () {
        $(this).css("background-color", "white");
      }
    );
  };

  jalaDatosAsynch(
    data.breakdown_group[nbdg].resource_id,
    columna_desglose,
    temp_desglose,
    columna_periodo,
    temp_periodo,
    lafuncion
  );
}

function rellenaTabla(
  arreglo_datos,
  tabla,
  columna_periodo,
  columna_desglose,
  variables,
  pordesglose
) {
  let cuerpo = tabla.createTBody();
  //primero checamos por variables si tiene decimales
  let tienedecimales = [];
  for (let j in variables) {
    tienedecimales[j] = false;
    for (let i in arreglo_datos)
      tienedecimales[j] |=
        arreglo_datos[i][variables[j].nombre_columna] % 1 != 0;
  }
  for (let i in arreglo_datos) {
    let fila = cuerpo.insertRow();
    let celda = fila.insertCell();
    if (pordesglose) celda.innerText = arreglo_datos[i][columna_periodo];
    else
      celda.innerText = fixFormatSpelling(arreglo_datos[i][columna_desglose]);
    for (let j in variables) {
      celda = fila.insertCell();
      celda.innerText = formatData(
        arreglo_datos[i][variables[j].nombre_columna],
        variables[j].variable[0].variable_unit_measure,
        tienedecimales[j]
      );
    }
  }
  datosDGM = arreglo_datos;

  $("#divTablaDatos").empty();
  $("#divTablaDatos").append(tabla);
}
// ************************************************* AJAX *************************************************

function jalaDatosAsynch(
  resource,
  columna_desglose,
  desgloses,
  columna_periodo,
  periodo,
  lafuncion
) {
  var ret = [];
  if (columna_desglose === null || desgloses === null) {
    $.ajax({
      type: "GET",
      // url: rutaDGMX + resource + "?pageSize=20000",
      url: rutaDGMX + resource,
      data: {},
      success: function (data, textStatus, jqxhr) {
        // console.log(jqxhr.getResponseHeader("content-type"))
        // ret = data["results"];
        ret = data;
        console.log(data);
        for (var i in ret) {
          if (ret[i][columna_periodo] === "") ret.pop();
        }
        lafuncion(ret);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log("error, otra vez" + thrownError);
      },
      async: true,
    });
  } else {
    var req_uri = "?";
    for (var i in desgloses) {
      if (i == 0) {
        req_uri += columna_desglose + "=in.(" + desgloses[i] + ")";
      }
      if (i >= 1) {
        req_uri = req_uri.slice(0, -1);
        req_uri += "," + desgloses[i] + ")";
      }
      // req_uri +=
      //   encodeURI(columna_desglose) + "=" + remplaza_espacios(desgloses[i]);
      console.log(i, req_uri);
    }
    if (periodo != null) {
      // req_uri += "&" + columna_periodo + "=/" + periodo + "/";
      req_uri += "&" + columna_periodo + "=eq." + periodo;
    }
    // req_uri += "&pageSize=20000";
    console.log(i, req_uri);

    $.ajax({
      type: "GET",
      url: rutaDGMX + resource + req_uri,
      data: {},
      success: function (data, textStatus, jqxhr) {
        // ret = data["results"];
        ret = data;
        console.log(ret);
        if (ret[0] != undefined) {
          for (var i in ret) {
            for (var prop in ret[0]) {
              if (
                isNaN(ret[i][prop]) &&
                !isNaN(ret[i][prop].replaceAll(",", ""))
              ) {
                ret[i][prop] = ret[i][prop].replaceAll(",", "");
              }
            }
          }

          var primer_periodo = ret[0][columna_periodo];
          var primer_desglose = ret[0][columna_desglose];
          var periodo_repetido = false;
          for (i = 1; i < ret.length; i++) {
            if (
              ret[i][columna_periodo] == primer_periodo &&
              ret[i][columna_desglose] == primer_desglose
            ) {
              periodo_repetido = true;
              break;
            }
          }
          if (periodo_repetido) {
            if (
              columna_desglose != "entidad-federativa" &&
              ret[0]["entidad-federativa"] != undefined
            ) {
              //   console.log("Sobran entidades");
              var nuevo_ret = [];
              for (i = 0; i < ret.length; i++) {
                if (
                  ret[i]["entidad-federativa"] == "Estados Unidos Mexicanos"
                ) {
                  nuevo_ret.push(ret[i]);
                }
              }
              ret = nuevo_ret;
            } else if (
              columna_desglose != "grupo" &&
              ret[0]["grupo"] != undefined
            ) {
              //console.log("Sobran grupos");
              var nuevo_ret = [];
              for (i = 0; i < ret.length; i++) {
                if (ret[i]["grupo"] == "Total") {
                  nuevo_ret.push(ret[i]);
                }
              }
              ret = nuevo_ret;
            } else if (
              columna_desglose != "tipo-de-localidad" &&
              ret[0]["tipo-de-localidad"] != undefined
            ) {
              //console.log("Sobran tipo de localidad");
              var nuevo_ret = [];
              for (i = 0; i < ret.length; i++) {
                if (ret[i]["tipo-de-localidad"] == "Total") {
                  nuevo_ret.push(ret[i]);
                }
              }
              ret = nuevo_ret;
            }
          }
        } else {
          console.warn("Desglose " + desgloses + " no encontrado");
        }
        for (var i in ret) {
          if (ret[i][columna_periodo] === "") ret.pop();
        }
        lafuncion(ret);
      },
      async: true,
    });
  }
}

function getPeriodos(datoInd, attribute_years) {
  var periodos = [];

  for (var jj = 0; jj < datoInd[0].length; jj++) {
    if (attribute_years === "Año" || attribute_years === "anio") {
      periodos.push(datoInd[0][jj].fecha);
    } else if (attribute_years === "Legislatura") {
      periodos.push(datoInd[0][jj].legislatura);
    } else if (attribute_years === "Año_de_referencia") {
      periodos.push(datoInd[0][jj]["ano-de-referencia"]);
    } else if (attribute_years === "t") {
      periodos.push(datoInd[0][jj].t);
    } else if (minusculas(attribute_years).includes("ciclo")) {
      periodos.push(datoInd[0][jj][minusculas(attribute_years)]);
    } else if (attribute_years === "Unidad") {
      periodos.push(datoInd[0][jj].unidad);
    } else if (attribute_years === "Periodo/Año") {
      periodos.push(datoInd[0][jj]["periodo-ano"]);
    } else {
      periodos.push(datoInd[0][jj][minusculas(attribute_years)]);
    }
  }
  return periodos;
}
$(document).ready(function () {
  let url = new URL(window.location.href);
  if (url.searchParams.get("clave") != null) {
    $.ajax({
      type: "GET",
      url: "json/" + url.searchParams.get("clave") + ".json", //.split(':')[2]+".json",
      data: {},
      success: function (data, textStatus, jqxhr) {
        datosDGRU = data;
        datosDer = data;
        datosGlobal = data;

        if (data.is_cuantitative == false) {
          tablacuali(datosDGRU);
        } else {
          indicadorCuantitativo(datosDGRU);
        }
        //actualizar breadcrumbs

        $("#claveInd").html(data.indicator_code);
        $("#derechoInd").html(
          '<a href="derechos.html?rid=' +
            data.right_id +
            '">' +
            data.right_name_short +
            "</a>"
        );
        $("#categoriaInd").html(
          '<a href="derechos.html?rid=' +
            data.right_id +
            "&cat=" +
            data.indicator_category_key +
            '">' +
            data.indicator_category_name +
            "</a>"
        );
        $(document).prop("title", data.indicator_name);
      },
      async: true,
    });
  }
});
