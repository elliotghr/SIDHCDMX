<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>
    Plataforma de información para el Sistema de Indicadores de Derechos
    Humanos de la Ciudad de México
  </title>

  <link href="/favicon.ico" rel="shortcut icon" />

  <link href="css/generales.css" rel="stylesheet" />
  <link href="css/theme.css" rel="stylesheet" />
  <link href="css/principal.css" rel="stylesheet" />
  <link rel="stylesheet" href="IndividialUpload/styles.css" />

  <script src="js/lib/jquery-3.3.1.min.js"></script>
  <script src="js/lib/vendor.js"></script>
  <script src="js/lib/framework.js"></script>
  <script>
    $(function() {
      $("#placeHeader").load("Header.html");
      $("#placeFooter").load("footer.html");
    });
  </script>
</head>

<body id="top">
  <div id="placeHeader"></div>
  <main>
    <div class="container">
      <div class="Accordion-elements">
        <div class="Accordion-heading" role="tab">
          <div class="Title">
            <h2>Carga Individual</h2>
          </div>
          <div class="Accordion-heading-action">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapseIndividual" aria-expanded="true" aria-controls="collapseOne" class="">
            </a>
          </div>
        </div>
        <div id="collapseIndividual" class="Accordion-body collapse in" role="tabpanel" aria-labelledby="headingOne" aria-expanded="true">
          <div class="Text">
            <div class="row">
              <div class="col-md-12 article">
                <form class="form" method="post" enctype="multipart/form-data">
                  <label for="clave">Clave</label>
                  <input type="text" name="clave" placeholder="" id="clave" required />
                  <br />
                  <label for="url">Url </label>
                  <input type="text" name="url" placeholder="" id="url" required />
                  <br />
                  <button type="submit" name="guardar">Enviar</button>
                </form>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-md-8">
                <article class="result">
                  <?php
                  include_once("../SIDHCDMX-master/IndividialUpload/conexion.php");
                  include_once("../SIDHCDMX-master/IndividialUpload/uploadFile.php");
                  ?>
                </article>
              </div>
              <div class="col-md-4">
                <p></p>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="Accordion-elements">
        <div class="Accordion-heading" role="tab">
          <div class="Title">
            <h2>Carga Multiple</h2>
          </div>
          <div class="Accordion-heading-action">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapseMultiple" aria-expanded="true" aria-controls="collapseOne" class="">
            </a>
          </div>
        </div>
        <div id="collapseMultiple" class="Accordion-body collapse in" role="tabpanel" aria-labelledby="headingOne" aria-expanded="true">
          <div class="Text">
            <div class="row">
              <div class="col-md-12 article article-multiple">
                <form method="post" enctype="multipart/form-data">
                  <input type="file" name="archivo" required="required" />
                  <br>
                  <input type="submit" value="Subir" />
                </form>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-md-8">
                <article class="result">
                  <article class="article article-status">
                    <?php if (isset($archivo)) : ?>
                      <?php if (!$extension_correcta) : ?>
                        <span style="color: #f00;"> La extensión es incorrecta, el archivo debe ser csv </span>
                      <?php elseif (!$archivo_ok) : ?>
                        <span style="color: #f00;"> Error al intentar subir el archivo. </span>
                      <?php else : ?>
                        <strong> El archivo ha sido subido correctamente. <?php echo $file_name; ?> </strong>
                        <br />
                      <?php endif ?>
                    <?php endif; ?>
                  </article>
                  <?php
                  include_once("../SIDHCDMX-master/MultipleUpload/conexion.php");
                  include_once("../SIDHCDMX-master/MultipleUpload/uploadFile.php");
                  ?>

                </article>
              </div>
              <div class="col-md-4">
                <p></p>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="BackTop" style="display: block" class="in">
      <a href="#" id="BackTop-action"></a>
    </div>
  </main>
  <div id="placeFooter"></div>
</body>

</html>