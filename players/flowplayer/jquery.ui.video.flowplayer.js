/*
 * jQuery UI Video HTML5 Plugin by M. Pezzi
 * http://thespiral.ca/jquery/ui.video/demo/
 * Version: 1.0 (03/07/10)
 * Dual licensed under the MIT and GPL licences:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.4.2 or later
 * Requires: jQuery UI v1.8.2 or later
 */
(function($){
  var instance = 0;
  
  $.ui.video.flowplayer = {
    player: '../players/flowplayer/swf/flowplayer-3.2.2.swf',
    
    _create: function() {
      var self = this, o = this.options,
          
          uiVideoContainer = $('<div class="flowplayer"></div>')
            .appendTo(this.container),
          
          uiVideoFlowplayer = $('<a>')
            .attr({ id: 'flowplayer-' + instance, 'href': self.playlist[0].url })
            .css({ display: 'block', width: o.width, height: o.height })
            .appendTo(uiVideoContainer);
        
        this.flowplayer = uiVideoFlowplayer;
        
        this._createPlaylist();
        this._createPlayer();
        
        this.element.hide();

        instance++;
    },
    
    play: function() {
      $f(this.flowplayer[0]).play();
    },
    pause: function() {
      $f(this.flowplayer[0]).pause();
    },
    stop: function() {
      $f(this.flowplayer[0]).stop();
    },
    prev: function() {
      $f(this.flowplayer[0]).play( $f(this.flowplayer[0]).getClip().index - 1 );
    },
    next: function() {
      $f(this.flowplayer[0]).play( $f(this.flowplayer[0]).getClip().index + 1 );
    },
    
    _createPlayer: function() {
      this.flowplayer.flowplayer(this.player, {
        plugins: { controls: { playlist: ( this.playlist.length > 1 ) } },
        clip: { autoPlay: this.options.autoplay, autoBuffering: this.options.preload },
        canvas: { backgroundImage: 'url('+ $('img.poster', this.element).attr('src') +')' },
        playlist: this.playlist
      });
    },
    
    _createPlaylist: function() {
      var self = this;
      
      for ( var i in this.playlist ) {
        var item = this.playlist[i];
        
        item.onStart = function(current) { self.element.trigger('play', current); };
        item.onFinish = function(current) { self.element.trigger('ended', current); };
        
        // Disable player controls for forced videos.
        if ( item.forced ) {
          item.position = 0;
          item.controls = { playlist: false, enabled: { play: false, scrubber: false } };
        }
        
        // FlowPlayer doesn't autoplay playlist, so we must set this to all future playlist items.
        if ( i != 0 ) {
          item.autoPlay = true;
        }
      }
    }
  };
  
})(jQuery);