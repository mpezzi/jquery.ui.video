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
      html5: 'html5',
      flash: 'flowplayer'
    },
    
    // Initializer.
    _create: function() {
      var self = this,
          o = self.options,
          
          // Video Container.
          uiVideoContainer = $('<div></div>')
            .addClass('ui-video')
            .width(this.options.width)
            .height(this.options.height)
            .insertAfter(self.element);
      
      self.element.css({
        display: 'block',
        width: o.width,
        height: o.height
      });
      
      // Override certain options via ui-video-{option} classes.
      this._buildOptions(['preload', 'autoplay', 'controls']);
      
      self.element.video = $.extend(self, {
        current: 0,
        playlist: [],
        container: uiVideoContainer
      }, this._buildPlayer());
      
      this._buildPlaylist();
      
      return this;
    },
    
    // Public methods.
    play: function(item) {},
    pause: function() {},
    stop: function() {},
    prev: function() {},
    next: function() {},
    poster: function() {},
    
    // Private methods.
    _buildPlayer: function() {
      return ( this.options.player == null ) ?
        $.ui.video.support.html5() ?
          $.ui.video[this.options.html5] : $.ui.video[this.options.flash] :
          $.ui.video[this.options.flash];
    },
    _buildPlaylist: function() {
      var self = this;
      
      // Load a single video.
      if ( self.element.context.tagName == 'A' ) {
        self.playlist[0] = { url: self.element.attr('href') };
      }
      
      // Load multiple videos.
      if ( self.element.context.tagName == 'OL' ) {
        $('li a.item', self.element).each(function(i){
          var item = {};
          
          item.url = $(this).attr('href');
          item.forced = $(this).hasClass('item-forced');
          
          self.playlist[i] = item;
        });
      }
    },
    _buildPoster: function() {
      return $('img.poster', this.element).attr('src');
    },
    _buildOptions: function(o) {
      for ( var i in o ) {
        this.options[o[i]] = this.options[o[i]] ? this.options[o[i]] : this.element.hasClass('ui-video-' + o[i]);
      }
    },
    _setOption: function(key, value) {
      
    },
    
    // Debug.
    debug: function(s) {
      if ( window.console && window.console.log )
        window.console.log(s);
    }
  });
  
  $.ui.video.support = {
    html5: function() { return !!document.createElement('video').canPlayType; },
    flash: function() { return false; }
  };
  
})(jQuery);
