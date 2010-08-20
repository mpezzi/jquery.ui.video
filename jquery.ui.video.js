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
    defaults: {
      debug: true,
      width: 640,
      height: 360,
      preload: false,
      autoplay: false,
      controls: false,
      player: false,
      players: { html5: 'html5', flash: 'flowplayer' },
      classes: {
        item: 'item',
        forced: 'item-forced'
      }
    },
    
    // Public functions.
    player: function() {
      return this.options.player;
    },
    
    // Create Player instance.
    _init: function() {
      this.debug('[_init]');
      
      this.options = $.extend({}, this.defaults, this.options);
      
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
      }, this._createPlayer(), this._createPlaylist());
      
      this._create();
      
      return this;
    },
    
    _createPlayer: function() {
      this.debug('[_createPlayer]');
      this.options.player = this.options.player || ( this.support.html5() ? this.options.players.html5 : this.options.players.flash );
      return $.ui.video[this.options.player];
    },
    
    // Create Playlist.
    _createPlaylist: function() {
      this.debug('[_createPlaylist]');
      
      var self = this, o = this.options, playlist = [];
      
      // Load a single video.
      if ( self.element.context.tagName == 'A' ) {
        playlist[0] = { 
          url: self.element.attr('href'),
          linkUrl: $(this).attr('rel'),
          forced: $(this).hasClass(o.classes.forced)
        };
      }
      
      // Load multiple videos.
      if ( self.element.context.tagName == 'OL' ) {
        $('.' + o.classes.item, self.element).each(function(i){
          playlist[i] = {
            url: $(this).attr('href'),
            linkUrl: $(this).attr('rel').split('|')[0],
            linkMsg: $(this).attr('rel').split('|')[1],
            banner: $(this).find('img.banner').attr('src'),
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
  
  // Google DFP Plugin.
  $.widget('ui.videodfp', {
    add: function(pos, item) {
      var li    = $('<li class="item-inserted-dfp"></li>'),
          link  = $('<a class="item"></a>')
                    .addClass(item.forced ? 'item-forced' : null)
                    .attr('href', item.url)
                    .attr('rel', item.linkUrl ? ( item.trackingUrl + item.linkUrl ) : '')
                    .text(item.title)
                    .appendTo(li);
      
      if ( item.banner ) {
        $('<img class="banner" />').attr('src', item.banner).appendTo(link);
      }
      
      if ( pos == 'end' ) {
        this.element.append(li);
      } else if ( pos > 0 && pos <= $('li:not(.item-inserted-dfp)', this.element).length ) {
        $('li:not(.item-inserted-dfp)', this.element).filter(':eq('+ (pos - 1) +')').before(li);
      }
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