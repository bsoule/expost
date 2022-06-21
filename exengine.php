<?php
# This webservice is documented at expost.padm.us

include_once "markdowne.php";  # markdown with extras
include_once "smartypants.php"; # curly quotes and whatnot

$expost_num = array(); # map tag to its number
$expost_fnt = array(); # map tag to number of footnote occurrences for that tag
$erbchunks  = array(); # list of chunks of erb
$jschunks   = array(); # list of chunks of javascript

################################################################################
################################## FUNCTIONS ###################################
################################################################################

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

################################################################################
##################################### MAIN #####################################
################################################################################

$htmlwrap  = isset($_REQUEST['htmlwrap'])  ? $_REQUEST['htmlwrap']  : true;
$htmltitle = isset($_REQUEST['htmltitle']) ? $_REQUEST['htmltitle'] : true;
$ep = $_REQUEST['pad'] or $ep = 'expost';

$epurl = "https://padm.us/$ep/export/txt";

set_error_handler(
  function ($severity, $message, $file, $line) {
    throw new ErrorException($message, $severity, $severity, $file, $line);
  }
);
try {
  # Something spontaneously broke on 2022-06-21 and this patches it
  $epurltmp = preg_replace('/https:/', 'http:', $epurl, 1);
  $content = file_get_contents($epurltmp);
}
catch (Exception $e) {
  # Don't show show the padm.us URL in the error message
  $maskedurl = preg_replace('/padm\.us/', 'EPURL', $epurl, 1);
  $content = "<pre>ERROR: failed to fetch $maskedurl\n\n{$e->getMessage()}</pre>";
}
restore_error_handler();


################################################################################
############################### TRANSFORMATIONS ################################
################################################################################

# strip out markers like BEGINWC[foo] and ENDWC[foo]
$content = preg_replace('/(?:BEGINWC|ENDWC)\[[^\[\]]*\]/', '', $content);

# fetch the title from the BEGIN_MAGIC[blah blah the title] line
preg_match('/^.*?BEGIN_MAGIC(?:\[([^\[\]]*)\])?/s', $content, $matches);
$title = trim($matches[1]);

# throw out everything before BEGIN_MAGIC
$content = preg_replace('/^.*?BEGIN_MAGIC(?:\[[^\[\]]*\])?/s', '', $content);

# throw out everything after END_MAGIC
$content = preg_replace('/END_MAGIC.*/s', '', $content);

# turn ```LANGUAGENAME into ~~~ cuz that's how our markdown engine does codeblox
$content = preg_replace('/\n```\w*\n/', "\n~~~\n", $content);

# do references and footnotes and the actual markdown->html and fancy quotes
$content = 
  jsrestore(
    erbrestore(
      SmartyPants(Markdown(transform(preprocess(
    erbstash(
  jsstash($content))))))));

# http://stuff -> <a href="http://stuff">http://stuff</a>
$content = preg_replace(
  '/([^\"\'\<\>])(https?\:\/\/[^\)\]\s\,\.\<]+(?:\.[^\)\]\s\,\.\<]+)+)/',
  "$1<a href=\"$2\">$2</a>", $content);

# turn " -- " into "&thinsp;&mdash;&thinsp;"
# (oops, caused problems, eg, the following broke:
#   blah blah -- "thing in quotes" -- blah blah
# )
# might be ok if done after markdown/smartpants/etc? trying that now...
#$content = preg_replace('/ \-\- /', '&thinsp;&mdash;&thinsp;', $content);
$content = preg_replace('/ \&\#8212\; /', '&thinsp;&mdash;&thinsp;', $content);

################################################################################
################################ GENERATE HTML #################################
################################################################################

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
