jQuery(document).ready(function($) {
  $('#titlediv').after($('#expost_div').detach());

  $('#ep_preview').click( function() {

      $.post( ajaxurl, 
          { action: "expost_fetch_post",
            source: $('#expost_source').val() },
            function(response) {
              if ($.trim(response.post_preview)) {

                $('#ep_preview').addClass('orange').removeClass('white');
                $('#ep_source').removeClass('orange').addClass('white');
                $('#expost-content-frame').remove();
 
                if ( !$('#expost-content-preview').length ) 
                  $('#expost_content')
                    .append('<div id="expost-content-preview"></div>');
                $('#expost-content-preview').html(response.post_preview); 

              } else {
                $('#ep_source').click();
              } 
            }, 
          "json" );
  } );

  $('#ep_source').click( function() {

    var s = $('#expost_source');
    $('#ep_source').addClass('orange').removeClass('white');
    $('#ep_preview').removeClass('orange').addClass('white');

    if ( $('#expost-content-frame').length ) {
      $('#expost-content-frame')
        .attr('src', s.val());   
    } else {
      $('#expost-content-preview').remove();
      $('#expost_content')
        .append( "<iframe id='expost-content-frame' src='"+
                s.val()+"' /></div>"); 
    } 
  });

  $('#expost_source').bind( 'change keypress', function(e) {
    // key codes: tab=9, enter=13, undefined=>'change'
    var key = (e.keyCode || 0), s = $('#expost_source'); 

    if ( 13 == key || 9 == key || 'change' == e.type ) { // 'save' ==> 
      if (s.val()) { // TODO: s.val() ?== TRUE if s.val() = '' 
        $('#postdivrich').hide();
        $('#expost_buttons').show();
        //TODO: update whichever is active
        $('#ep_preview').click();
      } else {
        $('#expost-content-frame').remove();
        $('#expost-content-preview').remove();
        $('#postdivrich').show();
        $('#expost_buttons').hide();
        return false;
      }
    } 
  });

  if ($('#expost_source').val()) {
    $('#expost_source').change();
  }
});

