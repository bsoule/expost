<?php
# This is a a webservice that takes a source document and outputs html that 
# concatenates the contents of all the URLs mentioned in the source document.
# So far it's just a stub with some code pasted from exengine.php.

$htmlwrap  = isset($_REQUEST['htmlwrap'])  ? $_REQUEST['htmlwrap']  : true;
$htmltitle = isset($_REQUEST['htmltitle']) ? $_REQUEST['htmltitle'] : true;
$ep = $_REQUEST['pad'] or $ep = 'expost';

$epurl = "https://padm.us/$ep/export/txt";
$content = file_get_contents($epurl);

$content = preg_replace(
  '/([^\"\'\<\>])(https?\:\/\/[^\)\]\s\,\.\<]+(?:\.[^\)\]\s\,\.\<]+)+)/',
  "$1<a href=\"$2\">$2</a>", $content);
$descrip = substr(strip_tags($content), 0, 160) . "...";

if($htmlwrap) {
  $htmlhead = <<<MAGIC_EOS
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>$title</title>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {
    inlineMath: [['\\\\(','\\\\)']],
    processEscapes: true
  }});
</script>
<script type="text/javascript"
  src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

<meta name="description" content="$descrip">
<link id="favicon" rel="icon" 
      href="https://doc.beeminder.com/favicon.ico" type="image/x-icon">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap-responsive.min.css"/>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<!-- <link rel="stylesheet" href="pygments.css"> -->
<!-- <link rel="stylesheet" href="latex.css"> -->
<link rel="stylesheet" href="expost.css">
</head>
<body>

MAGIC_EOS;
  echo sprintf($htmlhead, $title, $descrip);
}
if($title!=="" && $htmltitle) echo "<h1>$title</h1>\n";
echo $content;
if($htmlwrap) echo "\n</body> </html>";

?>
