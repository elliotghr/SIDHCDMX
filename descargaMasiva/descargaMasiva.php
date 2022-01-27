<?php

date_default_timezone_set('America/Mexico_City');
require('../lib/pclzip.lib.php');

$datos = $_POST;

$indicadores = $datos['indicadores'];
$tipoFormato = $datos['tipoFormato'];

$indicadores = explode(',',$indicadores);

for ($i=1; $i < count($indicadores); $i++) {
   $otra = $indicadores[$i];
   //$foo = explode('ind',$otra);
   $opo[] = $otra;
}

  $directorio = '../xlscsv';
    $ficheros1  = scandir($directorio);
    

if($tipoFormato == 'xls'){


    $codigos = '';
    for ($i=0; $i < count($opo); $i++) {
        for($j=0;$j<count($ficheros1);$j++){
            if (strpos($ficheros1[$j], $opo[$i]) !== false) {
                if (strpos($ficheros1[$j], '.xlsx') !== false || strpos($ficheros1[$j], '.xls') !== false) {
                    $codigos .= '../xlscsv/'.$ficheros1[$j].',';
                }
                
            }
        }
    }

  $resultado =  trim($codigos, ',');

  $fecha = date('Y-m-d-His');
  $nameFile = 'SNEDH_DescargaMasiva-'.$fecha.'.zip';
  $zip = new PclZip('../zip/'.$nameFile);
  //var_dump($codigos);
  $zip->create($resultado);
  echo '<a style="font-size:18px;" href="zip/'.$nameFile.'">'.$nameFile.'</a>';
}

if($tipoFormato == 'csv'){

  
    $codigos = '';
        for ($i=0; $i < count($opo); $i++) {
            for($j=0;$j<count($ficheros1);$j++){
                if (strpos($ficheros1[$j], $opo[$i]) !== false) {
                    if (strpos($ficheros1[$j], '.csv') !== false) {
                        $codigos .= '../xlscsv/'.$ficheros1[$j].',';
                    }

                }
            }
        }

  $resultado =  trim($codigos, ',');

  $fecha = date('Y-m-d-His');
  $nameFile = 'SNEDH_DescargaMasiva-'.$fecha.'.zip';
  $zip = new PclZip('../zip/'.$nameFile);
  //var_dump($codigos);
  $zip->create($resultado);
  echo '<a style="font-size:18px;" href="zip/'.$nameFile.'">'.$nameFile.'</a>';
}


function leer_contenido_completo($url){
   $fichero_url = fopen ($url, "r");
   $texto = "";
   while ($trozo = fgets($fichero_url, 1024)){
      $texto .= $trozo;
   }
   return $texto;
}

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

?>
