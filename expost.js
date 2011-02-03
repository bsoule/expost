jQuery(document).ready(function($) {

  $('#titlediv').after($('#expost_div').detach());

  $('#ep_preview').click( function() {
    $('#ep_preview').addClass('orange').removeClass('white');
    $('#ep_source').removeClass('orange').addClass('white');
    $('#expost-content-frame').remove();
    // $('#expost_content')
    //   .append( '<div id="expost-content-preview"> the content </div>' );
    $.post( ajaxurl, 
          { action: "expost_fetch_post",
            source: $('#expost_source').val() },
            function(response) {
              if (response.post_preview) {
                if ( !$('#expost-content-preview').length ) 
                  $('#expost_content')
                    .append('<div id="expost-content-preview"></div>');
                $('#expost-content-preview').html(response.post_preview); 
              } 
            }, 
          "json" );
  } );

  $('#ep_source').parent().click( function() {
    $('#expost_source').change();
  } );

  $('#expost_source').bind( 'change keypress', function(e) {
    // key codes: tab=9, enter=13, undefined=>'change'
    var key = (e.keyCode || 0), s = $('#expost_source');
    $('#ep_source').addClass('orange').removeClass('white');
    $('#ep_preview').removeClass('orange').addClass('white');

    if ( 13 == key || 9 == key || 'change' == e.type ) { // 'save' ==> 
      if (s.val()) {
        $('#postdivrich').hide();
        $('#expost_buttons').show();

        if ( $('#expost-content-frame').length ) {
          $('#expost-content-frame')
            .attr('src', s.val());   
        } else {
          $('#expost-content-preview').remove();
          $('#expost_content')
            .append( "<iframe id='expost-content-frame' src='"+
                    s.val()+"' /></div>"); 
        } 
        return false;
      } else {
        $('#expost-content-frame').remove();
        $('#expost-content-preview').remove();
        $('#postdivrich').show();
        $('#expost_buttons').hide();
        return false;
      }
    } // if ( 27 == key ) // 'escape': don't do anything special
    
  });

  if ($('#expost_source').val()) {
    $('#expost_source').change();
  }
});

