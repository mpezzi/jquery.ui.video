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
  
  $.ui.video.html5 = {
    codec: null,
    codecs: { mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', ogg: 'video/ogg; codecs="theora, vorbis"', webm: 'video/webm; codecs="vp8, vorbis"' },
    controller: 'apple',
    isFullscreen: false,
    
    // Initialize player.
    _init: function() {
      this.debug('[_init]');
      
      // Hide original element.
      this.element.hide();
      
      // Create player.
      this._playerCreate();
    },
    
    // Public methods.
    load: function(i) {
      if ( i !== undefined && this.current !== i && this.playlist[i] !== undefined ) {
        this.media.src = this._playerFile(this.playlist[i].url);
        this.media.load();
        this.current = i;
      }
    },
    play: function(i) {
      this.load(i);
      this.media.paused ? this.media.play() : this.media.pause();
    },
    pause: function() {
      this.media.pause();
    },
    prev: function() {
      this.play(this.current - 1);
    },
    next: function() {
      this.play(this.current + 1);
    },
    fullscreen: function(visible) {
      
    },
    
    // Private methods.
    _playerCreate: function() {
      this.debug('[_playerCreate]');
      
      // Create HTML Video elements.
      var css = { width: this.options.width, height: this.options.height };
      
      this.container = $('<div class="ui-video-container"></div>').css(css).appendTo(this.container);
      this.video = $('<video></video>').css(css).appendTo(this.container);
      this.poster = $('<div class="ui-video-poster"></div>').css(css).appendTo(this.container);
      this.loader = $('<div class="ui-video-loader"></div>').css(css).appendTo(this.container);
      this.error = $('<div class="ui-video-error"><span></span></div>').css(css).appendTo(this.container);
      
      this.media = this.video[0];
      
      // Create player controller on non-iOS machines.
      if ( !this.support.iOS() ) {
        $.extend(this, $.ui.video.html5[this.controller]);
        this._controllerCreate();
      }
      
      // Initialize player.
      this._playerPosterCreate();
      this._playerInit();
    },
    _playerInit: function() {
      this.debug('[_playerInit]');
      
      // Register HTMLMediaElement event listeners.
      this.media.addEventListener('play', this.onPlayerPlay.context(this), false);
      this.media.addEventListener('playing', this.onPlayerPlaying.context(this), false);
      this.media.addEventListener('pause', this.onPlayerPause.context(this), false);
      this.media.addEventListener('seeking', this.onPlayerSeeking.context(this), false);
      this.media.addEventListener('ended', this.onPlayerEnded.context(this), false);
      this.media.addEventListener('waiting', this.onPlayerWaiting.context(this), false);
      this.media.addEventListener('stalled', this.onPlayerStalled.context(this), false);
      this.media.addEventListener('loadstart', this.onPlayerLoadStart.context(this), false);
      this.media.addEventListener('loadeddata', this.onPlayerLoadedData.context(this), false);
      this.media.addEventListener('volumechange', this.onPlayerVolumeChange.context(this), false);
      this.media.addEventListener('error', this.onPlayerError.context(this), false);
      
      // Register Window event listeners.
      $(window).resize(this.onPlayerResize.context(this));
      
      // Set appropriate source codec.
      for ( var c in this.codecs ) {
        if ( this.media.canPlayType(this.codecs[c]) && this.codec == null ) this.codec = c;
      }
      
      // Create source element and use appropriate codec.
      var src = this._playerFile(this.playlist[0].url),
          type = this.codecs[this._playerFileExtension(src)];

      $('<source>').attr({ src: src, type: type }).appendTo(this.video);
    },
    _playerPosition: function() {
      this.debug('[_playerPosition]');
    },
    _playerPosterCreate: function() {
      
    },
    _playerFile: function(src) {
      return src.replace('.' + this._playerFileExtension(src), '.' + this.codec);
    },
    _playerFileExtension: function(src) {
      var parts = src.split('?')[0].split('.');
      return parts[parts.length - 1];
    },
    _playerTextSelectionBlock: function() {
      document.body.focus();
      document.onselectstart = function() { return false; };
    },
    _playerTextSelectionUnblock: function() {
      document.onselectstart = function() { return true; };
    },
    
    // HTMLMediaElement events.
    onPlayerPlay: function(e) {
      //this.debug('[event onPlayerPlay]');
    },
    onPlayerPlaying: function(e) {
      //this.debug('[event onPlayerPlaying]');
    },
    onPlayerPause: function(e) {
      //this.debug('[event onPlayerPause]');
    },
    onPlayerSeeking: function(e) {
      //this.debug('[event onPlayerSeeking]');
    },
    onPlayerEnded: function(e) {
      this.debug('[event: onPlayerEnded]');
      this.playlist[this.current + 1] !== undefined ? this.next() : this.onPlayerFinished(e);
    },
    onPlayerFinished: function(e) {
      this.debug('[event onPlayerFinished]');
      this.load(0);
    },
    onPlayerProgress: function(e) {
      //this.debug('[event onPlayerProgress]');
    },
    onPlayerWaiting: function(e) {
      //this.debug('[event onPlayerWaiting]');
    },
    onPlayerStalled: function(e) {
      //this.debug('[event onPlayerStalled]');
    },
    onPlayerLoadStart: function(e) {
      //this.debug('[event onPlayerLoadStart]');
    },
    onPlayerLoadedData: function(e) {
      //this.debug('[event onPlayerLoadedData]');
    },
    onPlayerVolumeChange: function(e) {
      //this.debug('[event onPlayerVolumeChange]');
    },
    onPlayerError: function(e) {
      //this.debug('[event onPlayerError]');
    },
    onPlayerResize: function(e) {
      
    }
  };
  
})(jQuery);