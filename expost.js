jQuery(document).ready(function($) {

  $('#titlediv').after($('#expost_div').detach());

  $('#expost_source').bind( 'change keypress', function(e) {
    // key codes: tab=9, enter=13, undefined=>'change'
    var key = (e.keyCode || 0), s = $('#expost_source');

    if ( 13 == key || 9 == key || 'change' == e.type ) { // 'save' ==> 
      if (s.val()) {
        //   * hide post box.
        $('#postdivrich').hide();
        //$('#edit-slug-box').hide();

        if ( $('#expost-content-frame').length ) {
          $('#expost-content-frame')
            .attr('src', s.val());   
        } else {
          $('#expost_content')
            .append( "<iframe id='expost-content-frame' src='"+
                    s.val()+"' /></div>"); 
        } 
        //update post_name:
        //$('#post_name').val(s.val());

        return false;
      } else {
      // else :
        $('#expost-content-frame').remove();
        $('#postdivrich').show();
        //$('#edit-slug-box').show();
        return false;
      }
    } // if ( 27 == key ) // 'escape': don't do anything special
    
  });

  if ($('#expost_source').val()) {
    $('#expost_source').change();
  }
});

