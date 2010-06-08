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
 
(function( $ ) {

$.widget('ui.video', {
  options: {
    width: 640,
    height: 360,
    preload: false,
    autoplay: false,
    controls: false,
    player: false,
    flash: 'flowplayer'
  },
  
  // Initialize plugin.
  _create: function(init) {
    var self = this,
        o = self.options,
        
        uiVideoContainer = $('<div></div>')
          .addClass('video-js-box')
          .insertAfter(self.element),
        
        uiVideoHTML5 = $('<video></video>')
          .addClass('video-js')
          .css('background', '#000')
          .attr('width', o.width)
          .attr('height', o.height)
          .appendTo(uiVideoContainer),
        
        uiVideoFlash = $('<div></div>')
          .addClass('ui-video-flash')
          .appendTo(uiVideoContainer),
        
        uiVideoFallback = $('<div></div>')
          .addClass('vjs-no-video')
          .appendTo(uiVideoContainer);
    
    o.preload = o.preload ? o.preload : self.element.hasClass('video-preload');
    o.autoplay = o.autoplay ? o.autoplay : self.element.hasClass('video-autoplay');
    o.controls = o.controls ? o.controls : self.element.hasClass('video-controls');
    
    self.element.video = $.extend(self, {
      current: 0,
      playlist: [],
      container: uiVideoContainer,
      html5: uiVideoHTML5,
      flash: uiVideoFlash,
      fallback: uiVideoFallback
    }, this._player());
    
    this._buildPlaylist();
    this.video()._load();
    this.element.hide();
  },
  
  video: function() {
    return this.element.video;
  },
  poster: function(src) {
    this.video().poster(src);
  },
  controls: function(visible) {},
  play: function() {},
  pause: function() {},
  stop: function() {},
  prev: function() {},
  next: function() {},
  _player: function() {
    return !this.options.player ?
      $.ui.video.supported ?
        $.ui.video.html5 : $.ui.video[this.options.flash] :
        $.ui.video[this.options.flash];
  },
  _load: function() {
    this.video()._load();
  },
  _buildController: function() {
    
  },
  _buildPlaylist: function() {
    var self = this;
    
    // Single video.
    if ( self.element.context.tagName == 'A' ) {
      self.playlist[0] = { src: this.element.attr('href') };
    }
    
    // Multiple videos.
    if ( self.element.context.tagName == 'OL' ) {
      $('li a.item', self.element).each(function(i){
        self.playlist[i] = { src: $(this).attr('href') };
      });
    }
  },
  _setOption: function(key, value) {
    this.options[key] = value;
  }
});

// Check if browser supports video.
$.ui.video.supported = function() {
  return !!$('<video>').canPlayType;
}

function ext(src) {
  var parts = src.split('.');
  
  return parts[ parts.length - 1 ];
}

function log(s) {
  if ( window.console && window.console.log )
    window.console.log(s);
}

})(jQuery);



