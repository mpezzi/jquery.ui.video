/*
 * jQuery UI Video Plugin by M. Pezzi
 * http://thespiral.ca/jquery/ui.video/demo/
 * Version: 1.0 (03/07/10)
 * Dual licensed under the MIT and GPL licences:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.4.2 or later
 * Requires: jQuery UI v1.8.2 or later
 */
(function($){
  
  $.widget('ui.dfp', {
    add: function(pos, playlist) {
      var item = $('<li></li>')
                    .addClass('item-inserted-dfp'),
          link = $('<a></a>')
                    .text(playlist.title)
                    .addClass('item')
                    .addClass(playlist.forced ? 'item-forced' : null)
                    .attr({ 
                      href: playlist.url,
                      rel: playlist.linkUrl ? ( playlist.trackingUrl + playlist.linkUrl ) : ''
                    })
                    .appendTo(item);
      
      if ( pos == 'end' ) {
        $('li:not(.item-inserted-dfp)', this.element).append(item);
      } else {
        $('li:not(.item-inserted-dfp)', this.element).filter(':eq('+ (pos - 1) +')').before(item);
      }
    }
  });
  
})(jQuery);