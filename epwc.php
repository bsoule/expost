<?php

$ep = 'somepad';
$epurl = "http://padm.us/$ep/export/txt";

while(1) {

$content = file_get_contents($epurl);

$content = preg_replace('/\<\!\-\-.*?\-\-\>/s', '', $content);

while(preg_match('/BEGINWC\[([^\[\]]*)\]/', $content, $m)) {
  $tag = trim($m[1]);
  preg_match("/BEGINWC\[${tag}\](.*)ENDWC\[${tag}\]/s", $content, $m);
  $stuff = $m[1];
  echo "$tag: ", count(preg_split('/\s+/', $stuff, -1, PREG_SPLIT_NO_EMPTY)), "\n";
  $content = preg_replace("/BEGINWC\[${tag}\]/", '', $content, 1);
}

$i = 9;
echo "---";
while($i >= 0) {
  sleep(1);
  echo "$i";
  $i--;
}
echo "\n";

}

?>
