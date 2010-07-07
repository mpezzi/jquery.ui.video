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
  
  if ( typeof $.widget == 'undefined' )
    alert('jQuery UI Video requires the jQuery UI Widget Factory Plugin');
  
  $.widget('ui.video', {
    
    // Default options.
    options: {
      debug: true,
      width: 640,
      height: 360,
      preload: false,
      autoplay: false,
      controls: false,
      player: null,
      players: { html5: 'html5', flash: 'flowplayer' },
      classes: {
        item: 'item',
        forced: 'item-forced'
      }
    },
    
    // Create Player instance.
    _create: function() {
      this.debug('[_create]');
      
      var self = this, o = self.options,
          
          // Create UI Video Container.
          uiVideoContainer = $('<div class="ui-video"></div>')
            .width(o.width)
            .height(o.height)
            .insertAfter(self.element);
      
      self.element.css({
        display: 'block',
        width: o.width,
        height: o.height
      });
      
      // Override preload, autoplay and control options.
      this._setClassOptions(['preload', 'autoplay', 'controls']);
      
      // Create a video element.
      this.element.video = $.extend(this, {
        container: uiVideoContainer,
        current: 0
      }, this.support.html5() ? $.ui.video[o.players.html5] : $.ui.video[o.players.flash], this._createPlaylist());
    },
    
    // Create Playlist.
    _createPlaylist: function() {
      this.debug('[_createPlaylist]');
      
      var self = this, o = this.options, playlist = [];
      
      // Load a single video.
      if ( self.element.context.tagName == 'A' ) {
        playlist[0] = { url: self.element.attr('href'), forced: $(this).hasClass(o.classes.forced) };
      }
      
      // Load multiple videos.
      if ( self.element.context.tagName == 'OL' ) {
        $('.' + o.classes.item, self.element).each(function(i){
          playlist[i] = {
            url: $(this).attr('href'),
            forced: $(this).hasClass(o.classes.forced)
          };
        });
      }
      
      return { playlist: playlist };
    },
    
    // Override certain options via ui-video-{option} classes.
    _setClassOptions: function(o) {
      this.debug('[_setClassOptions]');
      
      for ( var i in o ) {
        this.options[o[i]] = this.options[o[i]] ? this.options[o[i]] : this.element.hasClass('ui-video-' + o[i]);
      }
    },
    
    support: {
      iOS: function() { return ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ); },
      html5: function() { return !!document.createElement('video').canPlayType; },
      flash: function() { return false; }
    },
    
    // Debug messages.
    debug: function(s) {
      if ( window.console && window.console.log && this.options.debug )
        window.console.log(s);
    }
    
  });
  
  Function.prototype.context = function(obj) {
    var method = this
    temp = function() {
      return method.apply(obj, arguments)
    }
    return temp
  }
  
})(jQuery);