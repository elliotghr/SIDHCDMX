<?php
ini_set('memory_limit', '512M');
ini_set('max_execution_time', 300); 
ini_set('display_errors', true);

$derechos = array('Salud','Seguridad%20Social','Educaci%C3%B3n','Alimentaci%C3%B3n', 'Medio%20Ambiente','Culturales', 'Trabajo',  'Sindicales');

$idDerecho = array(1,2,3,4,5,6,7,8);

$bar100 = indicadores();
$bar200 = indicadores(100,100);
$bar300 = indicadores(100,200);
$bar400 = indicadores(100,300);
$bar500 = indicadores(100,400);
$bar600 = indicadores(100,500);
$bar700 = indicadores(100,600);
$bar800 = indicadores(100,700);

$recordsCount = $bar100['results']['recordsCount'];

$indicator_code = array();

for($i=0;$i<$recordsCount;$i++){
    if($i>=0 && $i<100){
        $indicator_code[] = $bar100['results']['records'][$i]['indicator_code'];
    }else if($i>=100 && $i<200){
        $indicator_code[] = $bar200['results']['records'][$i-100]['indicator_code'];
    }else if($i>=200 && $i<300){
        $indicator_code[] = $bar300['results']['records'][$i-200]['indicator_code'];
    }else if($i>=300 && $i<400){
        $indicator_code[] = $bar400['results']['records'][$i-300]['indicator_code'];
    }else if($i>=400 && $i<500){
        $indicator_code[] = $bar500['results']['records'][$i-400]['indicator_code'];
    }else if($i>=500 && $i<600){
        $indicator_code[] = $bar600['results']['records'][$i-500]['indicator_code'];
    }else if($i>=600 && $i<700){
        $indicator_code[] = $bar700['results']['records'][$i-600]['indicator_code'];
    }else if($i>=700 && $i<800){
        $indicator_code[] = $bar800['results']['records'][$i-700]['indicator_code'];
    }
}

echo 'Indicator code<br>';
var_dump($indicator_code);
echo '<br>';
echo ' Generar Json por c�digo de indicador <br>';
// ----------- Crea todos los JSON por código de indicador ---------//
for ($i=0; $i < count($indicator_code); $i++) {
	generaIndicador($indicator_code[$i]);
	var_dump($indicator_code[$i]);
}
echo ' Generar Json por nombre de derecho<br>';
//Genera JSON por nombre de Derecho
for ($j=0; $j < count($derechos);$j++){
	generaDerechos($derechos[$j]);
}
echo ' Generar Json por id de derecho<br>';
//Genera JSON de Derechos por ID
for ($jj=0; $jj < count($idDerecho);$jj++){
	generaId($idDerecho[$jj]);
}
echo ' Generar JSON de Derechos disponibles<br>';
// General JSON de Derechos disponibles
generaListaDer();
echo ' Generar Nuevo JSON<br>';
generaNuevoJson();



function datos($indicador){
  $ch = curl_init();

    // Setup cURL
    //$ch = curl_init('https://datosabiertos.unam.mx/api/alice/data/PUDH:INDI:CjR01');
    $ch = curl_init('https://datosabiertos.unam.mx/api/alice/data/PUDH:INDI:'.$indicador);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
        ),
        CURLOPT_USERAGENT => 'SNEDH'
    ));

    // Send the request
    $response = curl_exec($ch);

    // Check for errors
    if($response === FALSE){
        die(curl_error($ch));
    }

    // Decode the response
    $responseData = json_decode($response, TRUE);

    curl_close($ch);
    //var_dump($responseData);
    return $responseData;
}






function generaStatusDer($derecho){
    $baro = json_encode(derechosStatus($derecho),JSON_UNESCAPED_UNICODE);

    $fhh = fopen("../json/status".sinEspacios($derecho).".json", 'w+');
    fwrite($fhh, $baro);
    fclose($fhh);
}

function generaListaDer(){
    $baro = json_encode(derechos(),JSON_UNESCAPED_UNICODE);

    $fhh = fopen("../json/general.json", 'w+');
    fwrite($fhh, $baro);
    fclose($fhh);
}

function generaDerechos($derecho){
	$id_derecho=id_por_nombre($derecho);
	$indicadores=derechoId($id_derecho);
    $num_indicadores=$indicadores['results']['recordsCount'];
    if($num_indicadores>100){
    	$indicadores2=derechoId($id_derecho,100,100);
    	$temp1=$indicadores['results']['records'];
    	$temp2=$indicadores2['results']['records'];
    	//$indicadores['results']['records']=array_merge_recursive($temp1,$temp2);
    	foreach ($indicadores2['results']['records'] as &$value) {
    		array_push($indicadores['results']['records'], $value);
    	}
    	echo "longitud".count($indicadores['results']['records']).'<br>';
    }
    echo "Resultados ".$num_indicadores;
    echo '<br>';
    array_multisort(array_map(function($element) {
    	return $element['indicator_sequence'];
    }, $indicadores['results']['records']), SORT_ASC, $indicadores['results']['records']);
    
    //usort($indicadores['results']['records'], function($a, $b) {
    //	return comparasequence($a['indicator_sequence'],$b['indicator_sequence']);
    //});
    $baro = json_encode($indicadores,JSON_UNESCAPED_UNICODE);
    $fhh = fopen("../json/".sinEspacios($derecho).".json", 'w+');
    fwrite($fhh, $baro);
    fclose($fhh);
}

function generaId($derecho){
	$indicadores=derechoId($derecho);
	$num_indicadores=$indicadores['results']['recordsCount'];
	if($num_indicadores>100){
		$indicadores2=derechoId($derecho,100,100);
		foreach ($indicadores2['results']['records'] as &$value) {
			array_push($indicadores['results']['records'], $value); 
		}
		//$indicadores['results']['records']=array_merge_recursive($indicadores['results']['records'],$indicadores2['results']['records']);
	}
	echo "Resultados ".$num_indicadores;
	echo '<br>';
	array_multisort(array_map(function($element) {
		return $element['indicator_sequence'];
	}, $indicadores['results']['records']), SORT_ASC, $indicadores['results']['records']);
		
		//usort($indicadores['results']['records'], function($a, $b) {
		//	return comparasequence($a['indicator_sequence'],$b['indicator_sequence']);
		//});
	$baro = json_encode($indicadores,JSON_UNESCAPED_UNICODE);
	
    $fhh = fopen("../json/".$derecho.".json", 'w+');
    fwrite($fhh, $baro);
    fclose($fhh);
}

function generaNuevoJson(){
	$todoslosindicador=array();
	$idDerecho = array(1,2,3,4,5,6,7,8);
	for ($jj=0; $jj < count($idDerecho);$jj++){
		$derecho=$idDerecho[$jj];
		$indicadores=derechoId($derecho);
		$num_indicadores=$indicadores['results']['recordsCount'];
		if($num_indicadores>100){
			$indicadores2=derechoId($derecho,100,100);
			foreach ($indicadores2['results']['records'] as &$value) {
				array_push($indicadores['results']['records'], $value);
			}
			//$indicadores['results']['records']=array_merge_recursive($indicadores['results']['records'],$indicadores2['results']['records']);
		}
		foreach ($indicadores['results']['records'] as &$value) {
			array_push($todoslosindicador, $value);
		}
	}
	array_multisort(array_map(function($element) {
		return $element['indicator_sequence'];
	}, $todoslosindicador), SORT_ASC, $todoslosindicador);
	$temp=array();
	array_push($temp,$todoslosindicador);
	$baro = json_encode($temp,JSON_UNESCAPED_UNICODE);
	$fhh = fopen("../json/indicadores.json", 'w+');
	fwrite($fhh, $baro);
	fclose($fhh);
	
}

function generaIndicador($indicador){
    
    $arr_clientes = datos($indicador);

    $bar = json_encode($arr_clientes,JSON_UNESCAPED_UNICODE);

    $fh = fopen("../json/".$indicador.".json", 'w+');
    fwrite($fh, $bar);
    fclose($fh);
}

function sinEspacios($dato){
    $contenido=$dato;
    $contenido=str_replace(" ","",$contenido);
    $contenido=str_replace("á","a",$contenido);
    $contenido=str_replace("é","e",$contenido);
    $contenido=str_replace("í","i",$contenido);
    $contenido=str_replace("ó","o",$contenido);
    $contenido=str_replace("ú","u",$contenido);
    $contenido=str_replace("ñ","n",$contenido);
    return $contenido;
}


function indicadores($rows = 100, $offset = 0){
	$ch = curl_init();
	$ch = curl_init('https://datosabiertos.unam.mx/api/alice/search?q=right_id:*&rows='.$rows.'&offset='.$offset);
	curl_setopt_array($ch, array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
					'Content-Type: application/json'
			),
			CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.3 Safari/533.2'
	));
	
	// Send the request
	$response = curl_exec($ch);
	
	// Check for errors
	if($response === FALSE){
		die(curl_error($ch));
	}
	
	// Decode the response
	$responseData = json_decode($response, TRUE);
	
	curl_close($ch);
	//var_dump($responseData);
	return $responseData;
}


function derechoNombre($nombre, $rows = 100, $offset = 0){
	// create curl resource
	$ch = curl_init();
	
	// Setup cURL
	//$ch = curl_init('https://datosabiertos.unam.mx/api/alice/data/PUDH:INDI:CjR01');
	var_dump('https://datosabiertos.unam.mx/api/alice/search?q=right_name_short_lit:'.$nombre.'&rows='.$rows.'&offset='.$offset);
	$ch = curl_init('https://datosabiertos.unam.mx/api/alice/search?q=right_name_short_lit:'.$nombre.'&rows='.$rows.'&offset='.$offset);
	curl_setopt_array($ch, array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
					'Content-Type: application/json'
			),
			CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.3 Safari/533.2'
	));
	
	// Send the request
	$response = curl_exec($ch);
	
	// Check for errors
	if($response === FALSE){
		die(curl_error($ch));
	}
	
	// Decode the response
	$responseData = json_decode($response, TRUE);
	
	curl_close($ch);
	//var_dump($responseData);
	return $responseData;
}


function derechoId($id, $rows = 100, $offset = 0){
	// create curl resource
	$ch = curl_init();
	
	// Setup cURL
	//$ch = curl_init('https://datosabiertos.unam.mx/api/alice/data/PUDH:INDI:CjR01');
	echo 'https://datosabiertos.unam.mx/api/alice/search?q=right_id:'.$id.'&rows='.$rows.'&offset='.$offset.'<br>';
	$ch = curl_init('https://datosabiertos.unam.mx/api/alice/search?q=right_id:'.$id.'&rows='.$rows.'&offset='.$offset);
	curl_setopt_array($ch, array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
					'Content-Type: application/json'
			),
			CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.3 Safari/533.2'
	));
	
	// Send the request
	$response = curl_exec($ch);
	
	// Check for errors
	if($response === FALSE){
		die(curl_error($ch));
	}
	
	// Decode the response
	$responseData = json_decode($response, TRUE);
	
	curl_close($ch);
	//var_dump($responseData);
	return $responseData;
}

function derechosStatus($nombre, $rows = 100, $offset = 0){
	// create curl resource
	$ch = curl_init();
	//var_dump($nombre);
	// Setup cURL
	//$ch = curl_init('https://datosabiertos.unam.mx/api/alice/data/PUDH:INDI:CjR01');
	$ch = curl_init('https://datosabiertos.unam.mx/api/alice/search?q=right_name_short_lit:'.$nombre.'&rows=100&fac.json={array:{type:%22terms%22,field:%22is_cuantitative%22,limit:10,facet:{unique_indicators:%22unique(indicator_name_lit)%22,indicators_null:{type:%22query%22,q:%22-indicator_name:[*%20TO%20*]%22}}},nombres: {type:%22terms%22,field:%22right_name_short_lit%22,limit:20,facet:{unique_indicators: %22unique(indicator_name_lit)%22,indicators_null: {type: %22query%22,q: %22-indicator_name:[*%20TO%20*]%22}}}}');
	curl_setopt_array($ch, array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
					'Content-Type: application/json'
			),
			CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.3 Safari/533.2'
	));
	
	// Send the request
	$response = curl_exec($ch);
	var_dump($response);
	// Check for errors
	if($response === FALSE){
		die(curl_error($ch));
	}
	
	// Decode the response
	$responseData = json_decode($response, TRUE);
	
	curl_close($ch);
	var_dump($responseData);
	return $responseData;
}


function derechos($rows = 100, $offset = 0){
	// create curl resource
	$ch = curl_init();
	//var_dump($nombre);
	// Setup cURL
	//$ch = curl_init('https://datosabiertos.unam.mx/api/alice/data/PUDH:INDI:CjR01');
	$ch = curl_init('https://datosabiertos.unam.mx/api/alice/search?q=*:*&rows=0&fac.json={array:{type:%22terms%22,field:%22right_name_short_lit%22,limit:10,facet:{unique_indicators:%22unique(indicator_name_lit)%22,indicators_null:{type:%22query%22,q:%22-indicator_name:[*%20TO%20*]%22}}}}');
	curl_setopt_array($ch, array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_HTTPHEADER => array(
					'Content-Type: application/json'
			),
			CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.3 Safari/533.2'
	));
	
	// Send the request
	$response = curl_exec($ch);
	
	// Check for errors
	if($response === FALSE){
		die(curl_error($ch));
	}
	
	// Decode the response
	$responseData = json_decode($response, TRUE);
	
	curl_close($ch);
	//var_dump($responseData);
	return $responseData;
}

function id_por_nombre($i){
	$ret=1;
	switch ($i) {
		case 'Salud':
			$ret=2;
		break;
		case 'Seguridad%20Social':
			$ret=1;
		break;
		case 'Educaci%C3%B3n':
			$ret=3;
		break;
		case 'Alimentaci%C3%B3n':
			$ret=4;
		break;
		case 'Medio%20Ambiente':
			$ret=5;
			break;
		case 'Culturales':
			$ret=6;
		break;
		case 'Trabajo':
			$ret=7;
		break;
		case 'Sindicales':
			$ret=8;
		break;
			
	}
	return $ret;
}

function comparasequence($sequence1,$sequence2){
	$arreglo1 = str_split($sequence1);
	$arreglo2 = str_split($sequence2);
	$resultado=0;
	$i=0;
	for($i=0;$i<count($arreglo1)&&$i<count($arreglo2)&&$resultado==0;$i++){
		$resultado=strcmp($arreglo1[$i],$arreglo2[$i]);
	}
	if($resultado==0&&$i<count($arreglo1)){
		$resultado=1;
	}
	else $resultado=-1;
	
	return $resultado;
}

?>
