<?php
# This webservice is documented at expost.padm.us

include_once "markdowne.php";  # markdown with extras
include_once "smartypants.php"; # curly quotes and whatnot

$expost_num = array(); # map tag to its number
$expost_fnt = array(); # map tag to number of footnote occurrences for that tag
$erbchunks  = array(); # list of chunks of erb
$jschunks   = array(); # list of chunks of javascript

# Take the raw content and compute expost_num & expost_fnt hashes. 
# Also replace $REF[foo] and $FN[foo] with just $foo.
function preprocess($content)
{
  global $expost_num;
  global $expost_fnt;
  $i = 0; # tracks the numbers for tags defined with $REF
  $j = 0; # tracks the numbers for tags defined with $FN
  $ret = ''; # transformed content to return
  foreach(explode("\n", $content) as $x) {
    while(preg_match('/\$(REF|FN)\[([^\]]*)\]/', $x, $m)) {
      $f = $m[1];
      $tag = $m[2];
      if(!isset($expost_num[$tag])) { # a new tag we haven't seen; give it a num
        if($f==='REF') $expost_num[$tag] = (++$i);
        if($f==='FN')  $expost_num[$tag] = (++$j);
      }
      if($f==='FN') $expost_fnt[$tag]++;
      #$x = preg_replace("/([^\\])\\\$${f}\[$tag\]/e", "$1\$$tag", $x, 1);
      $x = preg_replace('/\$(REF|FN)\[[^\]]*\]/', "\$$tag", $x, 1);
    }
    $ret .= "$x\n";
  }
  # Re-count occurrences of footnote tags. Above only counts them if they were
  # given as $FN[foo], whereas only one of them has to be given that way and the
  # rest can be given as just $foo.
  foreach($expost_fnt as $k=>$v) 
    $expost_fnt[$k] = preg_match_all("/\\$$k\b/", $ret, $tmp);
  return $ret;
}

# Replace each occurrence of $foo with a number (or a bracketed, hyperlinked 
# number in the case of footnotes) based on the hashes computed by preprocess().
function transform($content)
{
  global $expost_num;
  global $expost_fnt;
  $ret = '';
  foreach(explode("\n", $content) as $x) {
    while(preg_match('/\$([a-zA-Z]\w*)/', $x, $m)) {
      $tag = $m[1];
      # if we encounter $foo where $expost_num['foo'] wasn't set then leave it
      # alone and in fact stop processing the rest of the line as well:
      if(!isset($expost_num[$tag])) break;
      if(isset($expost_fnt[$tag])) {
        $fc[$tag]++;
        if($fc[$tag]!==$expost_fnt[$tag]) 
          #$x = preg_replace("/\\$$tag\b/",
          $x = preg_replace('/\$[a-zA-Z]\w*/',
            "<a id=\"$tag$fc[$tag]\" ".
             "href=\"#$tag\">[$expost_num[$tag]]</a>", $x, 1);
        else # this is the last occurrence of this footnote tag
          #$x = preg_replace("/\\$$tag\b/",
          $x = preg_replace('/\$[a-zA-Z]\w*/',
             "<a id=\"$tag\" href=\"#${tag}1\">[$expost_num[$tag]]</a>", $x, 1);
      } else 
        $x = preg_replace('/\$[a-zA-Z]\w*/', $expost_num[$tag], $x, 1);
        #$x = preg_replace("/\\$$tag\b/", $expost_num[$tag], $x, 1);
    }
    $ret .= "$x\n";
  }
  return $ret;
}

# Replace chunks of erb (<%...%>) with MAGIC_ERB_PLACEHOLDER
function erbstash($content)
{
  global $erbchunks;
  $tmp = $content;
  $i = 0;
  $ret = '';
  while(preg_match('/^(.*?)\<\%(.*?)\%\>(.*)$/s', $tmp, $m)) {
    $ret .= $m[1] . 'MAGIC_ERB_PLACEHOLDER';
    $erbchunks[$i++] = '<%' . $m[2] . '%>';
    $tmp = $m[3];
  }
  return $ret . $tmp;
}

# Replace MAGIC_ERB_PLACEHOLDER with the stashed chunk of erb
function erbrestore($content)
{
  global $erbchunks;
  foreach($erbchunks as $e) {
    $content = preg_replace('/MAGIC_ERB_PLACEHOLDER/', $e, $content, 1);
  }
  return $content;
}

# Replace chunks of javascript (<script>...</script>) with MAGIC_JS_PLACEHOLDER
# (this wouldn't be necessary but for a markdown bug that barfs on the following
# because of the "<bar":
#   <script> var x = 1*2; if(foo<bar) print 2*2; </script>
function jsstash($content)
{
  global $jschunks;
  $tmp = $content;
  $i = 0;
  $ret = '';
  while(preg_match('/^(.*?)(\<script[^\>]*\>)(.*?)\<\/script\>(.*)$/s', 
                   $tmp, $m)) {
    $ret .= $m[1] . 'MAGIC_JS_PLACEHOLDER';
    $jschunks[$i++] = $m[2] . $m[3] . '</script>';
    $tmp = $m[4];
  }
  return $ret . $tmp;
}

# Replace MAGIC_JS_PLACEHOLDER with the stashed chunk of javascript
function jsrestore($content)
{
  global $jschunks;
  foreach($jschunks as $e) {
    $content = preg_replace('/MAGIC_JS_PLACEHOLDER/', $e, $content, 1);
  }
  return $content;
}

$htmlwrap = isset($_REQUEST['htmlwrap']) ? $_REQUEST['htmlwrap'] : true;
$htmltitle = isset($_REQUEST['htmltitle']) ? $_REQUEST['htmltitle'] : true;
$ep = $_REQUEST['pad'] or $ep = 'expost';

$epurl = "http://padm.us/$ep/export/txt";
$content = file_get_contents($epurl);

# strip out markers like BEGINWC[foo] and ENDWC[foo]
$content = preg_replace('/(?:BEGINWC|ENDWC)\[[^\[\]]*\]/', '', $content);
# fetch the title from the BEGIN_MAGIC[blah blah the title] line
preg_match('/^.*?BEGIN_MAGIC(?:\[([^\[\]]*)\])?/s', $content, $matches);
$title = trim($matches[1]);
# throw out everything before BEGIN_MAGIC
$content = preg_replace('/^.*?BEGIN_MAGIC(?:\[[^\[\]]*\])?/s', '', $content);
# throw out everything after END_MAGIC
$content = preg_replace('/END_MAGIC.*/s', '', $content);
# do references and footnotes and the actual markdown->html and fancy quotes
$content = 
  jsrestore(
    erbrestore(
      SmartyPants(Markdown(transform(preprocess(
    erbstash(
  jsstash($content))))))));
# http://stuff -> <a href="http://stuff">http://stuff</a>
$content = preg_replace(
  '/([^\"\'\<\>])(http\:\/\/[^\)\]\s\,\.\<]+(?:\.[^\)\]\s\,\.\<]+)+)/',
  "$1<a href=\"$2\">$2</a>", $content);

if($htmlwrap) {
  echo "<html> <head> ";
  echo '<meta charset="utf-8" />';
  echo "<title>";
  echo $title;
  echo "</title>\n";
  echo <<<EOS
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {
    inlineMath: [['\\\\(','\\\\)']],
    processEscapes: true
  }});
</script>
<script type="text/javascript"
  src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

EOS;
  echo '<link rel="stylesheet" href="expost.css" type="text/css"/>';
  echo "</head> <body>\n";
}
if($title!=="" && $htmltitle) echo "<h1>$title</h1>\n";
echo $content;
if($htmlwrap) echo "\n</body> </html>";

?>
