/*!
 * jQuery UI Video Plugin
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * HTML5 Plugin uses VideoJS. http://videojs.com
 * Flash Plugin uses FlowPlayer. http://flowplayer.org
 */

(function($){
  
  if ( $.widget == undefined )
    alert('jQuery UI Video requires the jQuery UI Widget Factory Plugin.');
  
  $.widget('ui.video', {
    options: {
      width: 640,
      height: 360,
      preload: false,
      autoplay: false,
      controls: false,
      player: null,
      html5: 'videojs',
      flash: 'flowplayer'
    },
    
    _create: function() {
      var self = this,
          o = self.options,
          
          // Video Container.
          uiVideoContainer = $('<div></div>')
            .addClass('ui-video')
            .insertAfter(self.element);
      
      // Override certain options via ui-video-{option} classes.
      this._buildOptions(['preload', 'autoplay', 'controls']);
      
      self.element.video = $.extend(self, {
        current: 0,
        playlist: [],
        container: uiVideoContainer
      }, this._buildPlayer());
      
      this._buildPlaylist();
      
      this.element.hide();
      
      return this;
    },
    
    // Private methods.
    _buildPlayer: function() {
      return ( this.options.player == null ) ?
        $.ui.video.support.html5 ?
          $.ui.video[this.options.html5] : $.ui.video[this.options.flash] :
          $.ui.video[this.options.flash];
    },
    
    _buildPlaylist: function() {
      var self = this;
      
      // Load a single video.
      if ( self.element.context.tagName == 'A' ) {
        self.playlist[0] = { src: self.element.attr('href') };
      }
      
      // Load multiple videos.
      if ( self.element.context.tagName == 'OL' ) {
        $('li a.item', self.element).each(function(i){
          self.playlist[i] = { src: $(this).attr('href') };
        });
      }
    },
    
    _buildController: function() {
      
    },
    
    _buildOptions: function(o) {
      for ( var i in o ) {
        this.options[o[i]] = this.options[o[i]] ? this.options[o[i]] : this.element.hasClass('ui-video-' + o[i]);
      }
    },
    
    _setOption: function(key, value) {
      
    },
    
    // Public methods.
    play: function(item) {},
    pause: function() {},
    stop: function() {},
    prev: function() {},
    next: function() {},
    poster: function() {},
    
    // Debug.
    debug: function(s) {
      if ( window.console && window.console.log )
        window.console.log(s);
    }
  });
  
  $.ui.video.support = {
    html5: function() {
      return !!$('<video>').canPlayType;
    },
    flash: function() {
      return false;
    }
  };
  
})(jQuery);
