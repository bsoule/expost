<?php
/*
Plugin Name: ExPost 
Plugin URI: http://blog.beeminder.com
Description: Create a post for your blog on an etherpad and publish to wordpress without ever touching the crappy wp editor. 
Version: 1.0.1
Author: Dreeves & bsoule 
Author URI: http://bethaknee.com
*/


$expost_current_version = '1.0.1';
register_activation_hook( __FILE__, 'expost_update_self' );
function expost_update_self() {
  $version = get_option( 'expost_installed_version' );

  if ($version && $version == $expost_current_version) 
    return;

  update_option( 'expost_installed_version', $expost_current_version );

  global $wpdb;
  $query = "SELECT p.ID, m.meta_key, m.meta_value 
            FROM $wpdb->posts p, $wpdb->postmeta m 
            WHERE p.ID = m.post_id 
            AND m.meta_key = 'expost_slug'"; 
  if (! ($results = $wpdb->get_results( $query )) )
    return; 

  foreach ($results as $p) {
    add_post_meta($p->ID, 'expost_source_url', "http://padm.us/beemblog-{$p->meta_value}", true);
    //delete_post_meta($p->ID, 'expost_slug');
  }
}

register_deactivation_hook( __FILE__, 'expost_delete_self' );
function expost_delete_self() {
  $val = delete_option( 'expost_installed_version' );
}

// TODO: currently not using but using the expost service at yootles.com/expost
// but maybe for general release we do want to markup ourselves..
// include_once 'expost-markdown.php';

/* *************************************************
 * first some behavior modification for wordpress: 
 * ************************************************* 
 */

// we don't want to turn single newlines into breaks. 
// though perhaps this shouldn't really be our call and go in a plugin?  
remove_filter('the_content','wpautop');
add_filter('the_content','expost_autop',10,1);
function expost_autop($content) {
  return wpautop($content,false);
}

// and, we don't want revisions or autosaves since ep does all that for us.
remove_action( 'pre_post_update', 'wp_save_post_revision' );
function expost_disable_autosave() {
  wp_deregister_script('autosave');
}
add_action( 'wp_print_scripts', 'expost_disable_autosave' );

// now then, the rest of this is wp-admin based, so if we're not in the
// admin, then let's skedaddle.
if (!is_admin())
  return;

/* link our scripts and stylesheets etc */
add_action('admin_print_scripts', 'expost_fetch_post_javascript');
add_action('admin_print_styles','expost_load_styles');
function expost_fetch_post_javascript() {
  wp_enqueue_script('jquery');
  $base_path = trailingslashit(WP_PLUGIN_URL) . basename(dirname(__FILE__));
  wp_enqueue_script('expost-ajax', $base_path . "/expost.js");
}
function expost_load_styles () {
  ?>
  <link type="text/css" rel="stylesheet" href="<?php echo
    trailingslashit( WP_PLUGIN_URL ) . basename(dirname(__FILE__)) ?>/expost.css" />
  <?php
}

/* add our form to the admin new-post page */
add_action('admin_menu', 'expost_meta_init');
function expost_meta_init() {
  if (function_exists('add_meta_box')) {
    add_meta_box( 'expost_div', "ExPost", 'expost_meta_box', 'post', 'normal', 'high' );
  }
}
/* actually print out the html for the form */
function expost_meta_box() {
  global $post_ID, $post;
  $slug = get_post_meta($post_ID, 'expost_slug', true);
  $source = get_post_meta($post_ID, 'expost_source_url', true);
  ?>
  <div>
    <label for="expost_source">Etherpad source url:</label>
    <input type="text" name="expost_source" id="expost_source" value="<?php echo $source ?>" />
  </div>
  <div id='expost_buttons'>
    <span class='expost-button'>
      <a class="expost-submit my-button" id="ep_preview">Live Preview</a> 
    </span>
    <span class='expost-button'>
      <a class="expost-submit my-button" id="ep_source">Source</a> 
    </span>
  </div>
  <div id="expost_content"></div>
  <div class="clearing"></div>
  <?php
}

// TODO: now that i've solved the empty contents post rejected thing
// with the wp_insert_post, maybe I should move the work of fetching the post
// content to here?? And then hook the same to the update post as well

// handles what to do with the content of the form when someone 
// saves the page
add_action('save_post', 'expost_meta_handler');
function expost_meta_handler() {
  global $post_ID, $post;

  if (isset($_POST['expost_source']) && $_POST['expost_source'] !== '') {
    update_post_meta($post_ID, 'expost_source_url', $_POST['expost_source']);
  } else {
    delete_post_meta($post_ID, 'expost_source_url');
  }
}


/* ******************************** */
/* in-form ajax and data processing */
/* ******************************** */

// TODO: currently this ajax stuff is moot. we only fetch the contents
// when the post is inserted (wp_insert_post), but perhaps we would
// want to use this for the preview function, to be able to preview
// the current etherpad contents, not last saved contents. 

// register this function to handle an ajax request for 
// action: 'expost_fetch_post'
add_action('wp_ajax_expost_fetch_post', 'expost_ajax_handler');
function expost_ajax_handler() {
  global $post_ID, $post;
  $source = $_POST['source'];
  $slug = basename($source);

  $data = array( "post_preview" => expost_fetch_post_contents($slug) );
 
  echo json_encode($data);
  die();
  // the ajax requestor will receive a '0' in addition to the data
  // we print unless we end this function with 'die();'
}

// get content from etherpad
function expost_fetch_post_contents( $source ) {
  $data = array();

  $ep = basename( $source ); 
  $expost_url = "http://yootles.com/expost/$ep?htmlwrap=0&htmltitle=0";
  return file_get_contents($expost_url);

}

// handle fetching the etherpad marked down contents when the post is saved.
function expost_insert_post_data($data, $postarr) {
  global $post_ID, $post;
  if ($postarr['post_parent'] != 0)
    return $data;

  if (isset($_POST['expost_source']) && $_POST['expost_source'] !== '') { 
    $contents = expost_fetch_post_contents($_POST['expost_source']);
    if ($contents !== '') {
      $data['post_content'] = $contents;
    } else {
      // TODO: should I be alerting the user of an error in this case? 
    }
  }

  return $data;  
} 
add_filter('wp_insert_post_data','expost_insert_post_data', 1, 2); 

remove_filter('the_preview','_set_preview');
add_filter('the_preview', 'expost_set_preview');
function expost_set_preview($post) {
  error_log("expost_set_preview\n",3,"/tmp/php.log"); 
  $post['post_content'] = 'PREVIEW POST'; 
  return $post;
}

?>
