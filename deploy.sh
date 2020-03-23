#!/bin/sh
# Just copy the files to the DigitalOcean server!
# There should be a symlink there from expost.php to exengine.php

scp               \
  index.php       \
  exengine.php    \
  markdowne.php   \
  smartypants.php \
  expost.css      \
  pygments.css    \
  latex.css       \
  root@padm.us:/home/etherpad/expost




# We deploy this by copying the following files to /var/www/expost on padm.us:
# PS: now on the new digital ocean server and lives at /home/etherpad/expost
#   index.php
#   exengine.php
#   markdowne.php
#   smartypants.php
#   expost.css
# Also make a symlink there from expost.php to exengine.php


# Here's the nginx config for expost.padm.us:
# 
# server {
#   listen       80;
#   server_name  expost.padm.us;
# 
#   access_log  /var/log/yootles;
#   error_log   /var/log/yootles;
#   root   /var/www//expost;
# 
#   location / {
#     # if file exists return it right away
#     if (-f $request_filename) {
#       break;
#     }
#     rewrite ^/([^/\.]+)/?$ /expost.php?pad=$1 last;
#     rewrite ^/$ /expost.php last;
#   }
#   location ~ \.php$ {
#     fastcgi_pass   localhost:9000; # port where FastCGI processes were spawned
#     fastcgi_index  index.php;
#     fastcgi_param  SCRIPT_FILENAME    /var/www/expost$fastcgi_script_name;
# 
#     fastcgi_param  QUERY_STRING       $query_string;
#     fastcgi_param  REQUEST_METHOD     $request_method;
#     fastcgi_param  CONTENT_TYPE       $content_type;
#     fastcgi_param  CONTENT_LENGTH     $content_length;
# 
#     fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
#     fastcgi_param  REQUEST_URI        $request_uri;
#     fastcgi_param  DOCUMENT_URI       $document_uri;
#     fastcgi_param  DOCUMENT_ROOT      $document_root;
#     fastcgi_param  SERVER_PROTOCOL    $server_protocol;
#     
#     fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
#     fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;
# 
#     fastcgi_param  REMOTE_ADDR        $remote_addr;
#     fastcgi_param  REMOTE_PORT        $remote_port;
#     fastcgi_param  SERVER_ADDR        $server_addr;
#     fastcgi_param  SERVER_PORT        $server_port;
#     fastcgi_param  SERVER_NAME        $server_name;
# 
#     # required if PHP was built with --enable-force-cgi-redirect
#     fastcgi_param  REDIRECT_STATUS    200;
#   }
# }

