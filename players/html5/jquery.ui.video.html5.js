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
    _isFullscreen: false,
    codec: null,
    codecs: { mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', ogg: 'video/ogg; codecs="theora, vorbis"', webm: 'video/webm; codecs="vp8, vorbis"' },
    controller: 'apple',
    messages: {
      error: [
        'An unknown error occurred.',
        'You aborted the video playback.',
        'A network error caused the video download to fail part-way.',
        'The video playback was aborted due to a corruption problem <br />or because the video used features your browser did not support.',
        'The video could not be loaded, either because the server or <br />network failed or because the format is not supported.'
      ],
      linkUrl: 'Click video for more information'
    },
    
    // Initialize player.
    _create: function() {
      this.debug('[_init]');
      
      // Hide original element.
      this.element.hide();
      
      // Create player.
      this._playerCreate();
    },
    
    // Public methods.
    load: function(i) {
      if ( this.playlist[i] !== undefined ) {
        this.debug('[loading ' + this._playerFile(this.playlist[i].url) +']');
        
        //this._playerLoaderShow();
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
      this._playerFullscreen(visible);
    },
    poster: function(visible) {
      visible ? this._playerPosterShow() : this._playerPosterHide();
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
      this.msg = $('<div class="ui-video-msg"></div>').appendTo(this.container);
      
      this.media = this.video[0];
      
      // Create player controller on non-iOS machines.
      if ( !this.support.iOS() ) {
        $.extend(this, $.ui.video.html5[this.controller]);
        this._controllerCreate();
      }
      
      // Initialize player.
      this._playerPosterCreate();
      this._playerInit();
      
      // Autoplay.
      if ( this.options.autoplay )
        this.play();
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
      
      if ( this.support.iOS() ) {
        // Create source element and use appropriate codec.
        var src = this._playerFile(this.playlist[0].url),
            type = this.codecs[this._playerFileExtension(src)];

        $('<source>').attr({ src: src, type: type }).appendTo(this.video);
        
        this.video.attr('controls', 'controls');
      } else {
        this.load(0);
      }
    },
    _playerPosterCreate: function() {
      var poster = $('img.poster', this.element).attr('src');
      
      if ( this.support.iOS() ) {
        this.video.attr('poster', poster);
      } else {
        this.poster.css({ backgroundImage: 'url('+ poster +')', backgroundRepeat: 'no-repeat' });
        this.poster.show();
      }
    },
    _playerPosterShow: function() {
      if ( !this.support.iOS() ) {
        this.poster.filter(':hidden').show();
        this._playerErrorHide();
        this._playerLoaderHide();
      }
    },
    _playerPosterHide: function() {
      if ( !this.support.iOS() ) {
        this.poster.filter(':visible').fadeOut();
      }
    },
    _playerLoaderShow: function() {
      if ( !this.support.iOS() ) {
        this.loader.filter(':hidden').fadeIn();
        this._playerErrorHide();
        this._playerPosterHide();
      };
    },
    _playerLoaderHide: function() {
      if ( !this.support.iOS() ) {
        this.loader.filter(':visible').fadeOut();
      }
    },
    _playerErrorShow: function(e) {
      this.error.filter(':hidden').fadeIn().find('span').html(this.messages.error[e.code] || messages[0]);
    },
    _playerErrorHide: function() {
      this.error.filter(':visible').fadeOut();
    },
    _playerMsgShow: function(msg) {
      this.msg.html(msg).filter(':hidden').fadeIn();
    },
    _playerMsgHide: function() {
      this.msg.filter(':visible').fadeOut();
    },
    _playerPosition: function() {
      this.debug('[_playerPosition]');
    },
    _playerFullscreen: function(fullscreen) {
      var self = this, elements = [ this.container, this.video, this.loader, this.error, this.poster ];
      
      if ( fullscreen ) {
        this.container.css({ position: 'fixed', top: 0, left: 0 }).addClass('ui-video-fullscreen');
        $.each(elements, function(){
          $(this).css({ width: $(window).width(), height: $(window).height() });
        });
        this._isFullscreen = true;
      } else {
        this.container.css('position', 'relative').removeClass('ui-video-fullscreen');
        $.each(elements, function(){
          $(this).css({ width: self.options.width, height: self.options.height });
        });
        this._isFullscreen = false;
      }
    },
    _playerLink: function(link) {
      if ( link ) {
        this.video.bind('click', function(){ window.location = link; });
      } else {
        this.video.unbind('click');
      }
    },
    _playerSetPosition: function(time) {
      if ( time > 0 && time <= this.media.duration ) {
        this.media.currentTime = Math.round(time);
      }
    },
    _playerSetVolume: function(l) {
      this.media.volume = localStorage['volume'] = 1;
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
      this.debug('[event onPlayerPlay]');
      this.element.trigger('play', this.playlist[this.current]);
      this.playlist[this.current].linkUrl ? this._playerMsgShow(this.playlist[this.current].linkMsg) : this._playerMsgHide();
    },
    onPlayerPlaying: function(e) {
      this.debug('[event onPlayerPlaying]');
      this._playerPosterHide();
      this._playerLoaderHide();
      this._playerErrorHide();
      
      this._playerLink(this.playlist[this.current].linkUrl);
    },
    onPlayerPause: function(e) {
      //this.debug('[event onPlayerPause]');
      this.element.trigger('pause', this.playlist[this.current]);
    },
    onPlayerSeeking: function(e) {
      //this.debug('[event onPlayerSeeking]');
    },
    onPlayerEnded: function(e) {
      this.debug('[event: onPlayerEnded]');
      this.element.trigger('ended', this.playlist[this.current]);
      this.playlist[this.current + 1] !== undefined ? this.next() : this.onPlayerFinished(e);
      
    },
    onPlayerFinished: function(e) {
      this.debug('[event onPlayerFinished]');
      this.element.trigger('finished');
      this._playerPosterShow();
      this.load(0);
    },
    onPlayerProgress: function(e) {
      //this.debug('[event onPlayerProgress]');
    },
    onPlayerWaiting: function(e) {
      this.debug('[event onPlayerWaiting]');
      this.element.trigger('waiting', this.playlist[this.current]);
      this._playerLoaderShow();
    },
    onPlayerStalled: function(e) {
      this.debug('[event onPlayerStalled]');
      this.element.trigger('stalled', this.playlist[this.current]);
      this._playerLoaderShow();
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
      this.debug('[event onPlayerError]');
      this.element.trigger('error', this.playlist[this.current]);
      this._playerPosterHide();
      this._playerLoaderHide();
      this._playerErrorShow(this.media.error);
    },
    onPlayerResize: function(e) {
      if ( this._isFullscreen ) {
        $.each([ this.container, this.video, this.loader, this.error, this.poster ], function(){
          $(this).css({ width: $(window).width(), height: $(window).height() });
        });
      }
    }
  };
  
})(jQuery);