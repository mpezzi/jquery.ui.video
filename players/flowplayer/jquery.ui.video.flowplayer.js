(function($){
  var player = 0;
  
  $.ui.video.flowplayer = {
    _init: function() {
      var self = this,
          o = self.options
          
          uiVideoContainer = $('<div></div>')
            .addClass('flowplayer')
            .appendTo(self.container),
            
          uiVideoFlowplayer = $('<a>')
            .attr('id', 'flowplayer-' + player)
            .attr('href', self.playlist[0].url)
            .css({ display: 'block', width: o.width, height: o.height })
            .appendTo(uiVideoContainer);
      
      this.debug('Using Flash - FlowPlayer');
      this.debug(this);
      
      this.flowplayer = uiVideoFlowplayer;
      
      // FlowPlayer
      uiVideoFlowplayer.flowplayer('../players/flowplayer/flowplayer-3.2.2.swf', {
        playlist: self.playlist
      });
      
      this.element.hide();
      
      player++;
    },
    play: function() {

    },
    pause: function() {

    },
    stop: function() {

    },
    prev: function() {

    },
    next: function() {

    },
    
  };
  
  
})(jQuery);
