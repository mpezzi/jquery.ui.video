(function( $ ){
  $.ui.video.videojs = {
    codec: false,
    codecs: {
      mp4: 'video/mp4',
      ogg: 'video/ogg',
      webm: 'video/webm',
      mov: 'video/mov'
    },
    controls: {},

    _load: function() {
      this.debug('Using HTML5 - VideoJS');
      
      var self = this,
          o = self.options,
          
          uiVideoHTML5 = $('<video></video>')
            .addClass('video-js')
            .css('background', '#000')
            .attr({ width: o.width, height: o.height })
            .appendTo(self.container);
      
      this.video = uiVideoHTML5;
      
      this.debug(this);
    },

    onPlay: function(e) {
      
    },

    onEnd: function(e) {
      
    },

    play: function(item) {
      
    },
    pause: function() {

    },
    stop: function() {

    },
    prev: function() {

    },
    next: function() {

    },
    poster: function(src) {
      
    },
    _use_codec: function(src, codec) {
      
    }
  };
})(jQuery);

// (function( $ ){
//   $.ui.video.videojs = {
//     codec: false,
//     codecs: {
//       mp4: 'video/mp4',
//       ogg: 'video/ogg',
//       webm: 'video/webm',
//       mov: 'video/mov'
//     },
//     controls: {},
// 
//     _load: function() {
//       log('Using HTML5');
// 
//       var self = this;
// 
//       // Set HTML5 Poster.
//       if ( $('img.poster:eq(0)', this.element).length > 0 ) {
//         this.poster( $('img.poster', this.element).attr('src') );
//       }
// 
//       // Set options.
//       this.options.preload ? this.html5.attr('preroll', 'preroll') : null;
//       this.options.autoplay ? this.html5.attr('autoplay', 'autoplay') : null;
//       this.options.controls ? this.html5.attr('controls', 'controls') : null;
// 
//       // Set Listeners.
//       this.html5[0].addEventListener('play', this.onPlay.context(this), false);
//       this.html5[0].addEventListener('ended', this.onEnd.context(this), false);
// 
//       // Set first playlist item in player.
//       if ( self.playlist.length > 0 ) {
//         $.each(self.codecs, function(e, type){
//           var src = self.playlist[0].src, e2 = ext(src);
//           $('<source>').attr({ src: src.replace('.' + e2, '.' + e), type: type }).appendTo(self.html5);
//         });
//       }
// 
//       // Initialize VideoJS player.
//       VideoJS.setup();
// 
//       // Add playlist buttons.
//       if ( self.playlist.length > 1 ) {
//         self.controls.next = $('<li class="vjs-playlist-control vjs-next"><span></span></li>')
//                                 .css('cursor', 'pointer')
//                                 .insertAfter( $('.vjs-play-control', self.container) )
//                                 .click(function(){ self.play(self.current + 1) });
// 
//         self.controls.prev = $('<li class="vjs-playlist-control vjs-prev"><span></span></li>')
//                                 .css('cursor', 'pointer')
//                                 .insertAfter( $('.vjs-play-control', self.container) )
//                                 .click(function(){ self.play(self.current - 1) });
//       }
//     },
// 
//     onPlay: function(e) {
//       this.codec = ext(e.target.currentSrc);
//     },
// 
//     onEnd: function(e) {
//       if ( this.playlist[this.current + 1] !== undefined ) {
//         this.play(this.current + 1);
//       }
// 
// 
//     },
// 
//     play: function(item) {
//       if ( this.current !== item && this.playlist[item] !== undefined ) {
//         var src = this._use_codec(this.playlist[item].src, this.codec);
// 
//         this.html5[0].src = src;
//         this.html5[0].load();
//         this.html5[0].play();
// 
//         this.current = item;
//       }
//     },
//     pause: function() {
// 
//     },
//     stop: function() {
// 
//     },
//     prev: function() {
// 
//     },
//     next: function() {
// 
//     },
//     poster: function(src) {
//       this.html5.attr('poster', src);
//     },
//     _use_codec: function(src, codec) {
//       return src.replace('.' + ext(src), '.' + codec);
//     }
//   };
// })(jQuery);
