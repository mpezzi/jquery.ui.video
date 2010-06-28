/*!
 * jQuery UI Video HTML5 Plugin
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * HTML5 Plugin based off of VideoJS. http://videojs.com
 */

(function($){

var player = 0;

$.ui.video.html5 = {
  isFullscreen: false,
  isFullscreenTransition: false,
  current: null,
  codec: null,
  codecs: { mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', ogg: 'video/ogg; codecs="theora, vorbis"', webm: 'video/webm; codecs="vp8, vorbis"' },
  
  // Initialize player.
  _init: function() {
    this._playerBuild();
    this.element.hide();
  },
  
  // Public Methods.
  play: function(item) {
    this.load(item);
    this.video[0].paused ? this.video[0].play() : this.video[0].pause();
  },
  pause: function() {
    this.video[0].pause();
  },
  prev: function() {
    this.play(this.current - 1);
  },
  next: function() {
    this.play(this.current + 1);
  },
  load: function(item) {
    if ( item !== undefined && this.current !== item && this.playlist[item] !== undefined ) {
      this.video[0].src = this._playerVideoFile(this.playlist[item].url);
      this.video[0].load();
      this.current = item;
    }
  },
  controller: function(controller) {
    controller ? this._controllerShow() : this._controllerHide();
  },
  fullscreen: function(fullscreen) {
    this._playerFullscreen(fullscreen);
  },
  
  // Private Methods.
  _playerBuild: function() {
    this.debug('[method _playerBuild]');
    
    var dimensions = { width: this.options.width, height: this.options.height };
    
    // Create HTML Video elements.
    this.container = $('<div class="video-container video-window"></div>').css(dimensions).appendTo(this.container);
    this.video = $('<video class="video-window"></video>').css(dimensions).appendTo(this.container);
    this.poster = $('<div class="video-poster"></div>').css(dimensions).appendTo(this.container);
    this.loader = $('<div class="video-loader video-window"></div>').css(dimensions).appendTo(this.container);
    this.error = $('<div class="video-error video-window"><span></span></div>').css(dimensions).appendTo(this.container);
    
    // Create controller.
    $.extend(this, $.ui.video.html5.controller);
    
    // Ignore controller and poster for iOS devices.
    if ( !this._playerIsiOS() ) {
      this._controllerBuild();
    }
    
    // Initialize player.
    this._playerPosterBuild();
    this._playerInit();
  },
  _playerInit: function() {
    this.debug('[method _playerInit]');
    
    // Video Events.
    this.video[0].addEventListener('loadstart', this.onLoadStart.context(this), false);
    this.video[0].addEventListener('loadeddata', this.onLoadedData.context(this), false);
    this.video[0].addEventListener('stalled', this.onStalled.context(this), false);
    this.video[0].addEventListener('waiting', this.onWaiting.context(this), false);
    this.video[0].addEventListener('play', this.onPlay.context(this), false);
    this.video[0].addEventListener('playing', this.onPlaying.context(this), false);
    this.video[0].addEventListener('pause', this.onPause.context(this), false);
    this.video[0].addEventListener('seeking', this.onSeeking.context(this), false);
    this.video[0].addEventListener('ended', this.onEnded.context(this), false);
    this.video[0].addEventListener('volumechange', this.onVolumeChange.context(this), false);
    this.video[0].addEventListener('error', this.onError.context(this), false);
    
    // Resize events.
    $(window).resize(this.onResize.context(this));
    
    // Set appropriate codec.
    for ( var c in this.codecs ) {
      if ( this.video[0].canPlayType(this.codecs[c]) && this.codec == null ) this.codec = c;
    }
    
    var src = this._playerVideoFile(this.playlist[0].url),
        type = this.codecs[this._playerVideoFileExtension(src)];
    
    $('<source>').attr({ src: src, type: type }).appendTo(this.video);
  },
  _playerPosition: function() {
    
  },
  _playerPosterBuild: function() {
    if ( this._playerIsiOS() ) {
      this.video.attr('poster', this._buildPoster());
    } else {
      this.poster.css({ backgroundImage: 'url('+ this._buildPoster() +')', backgroundRepeat: 'no-repeat' });
      this.poster.show();
    }
  },
  _playerPosterShow: function() {
    if ( !this._playerIsiOS() )
      this.poster.filter(':hidden').fadeIn(1000);
  },
  _playerPosterHide: function() {
    if ( !this._playerIsiOS() )
      this.poster.filter(':visible').fadeOut(1000);
  },
  _playerLoaderShow: function() {
    this.loader.filter(':hidden').fadeIn();
  },
  _playerLoaderHide: function() {
    this.loader.filter(':visible').fadeOut();
  },
  _playerErrorShow: function(e) {
    var messages = [
      'An unknown error occurred.',
      'You aborted the video playback.',
      'A network error caused the video download to fail part-way.',
      'The video playback was aborted due to a corruption problem <br />or because the video used features your browser did not support.',
      'The video could not be loaded, either because the server or <br />network failed or because the format is not supported.'
    ];
    
    this.error.filter(':hidden').fadeIn().find('span').html(messages[e.code] || messages[0]);
  },
  _playerErrorHide: function() {
    this.error.filter(':visible').fadeOut();
  },
  _playerFullscreen: function(fullscreen) {
    if ( this.isFullscreen = fullscreen ) {
      
    } else {
      
    }
  },
  _playerVideoFile: function(src) {
    return src.replace('.' + this._playerVideoFileExtension(src), '.' + this.codec);
  },
  _playerVideoFileExtension: function(src) {
    var parts = src.split('?')[0].split('.');
    return parts[parts.length - 1];
  },
  _playerVolumeSet: function(l) {
    this.video[0].volume = localStorage['volume'] = l;
  },
  _playerTextSelectionBlock: function() {
    document.body.focus();
    document.onselectstart = function () { return false; };
  },
  _playerTextSelectionUnblock: function() {
    document.onselectstart = function () { return true; };
  },
  _playerFinished: function() {
    
  },
  _playerIsiOS: function() {
    return ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) );
  },
  
  // Event listeners.
  onPlay: function(e) {
    this.debug('[event onPlay]');
  },
  onPause: function(e) {
    this.debug('[event onPause]');
  },
  onEnded: function(e) {
    this.debug('[event onEnded]');
    
    // Proceed to next video in playist, if it exists.
    this.playlist[this.current + 1] !== undefined ? this.next() : this.onFinished(e);
  },
  onFinished: function(e) {
    this.debug('[event onFinished]');
    this._playerPosterShow();
    this.load(0);
  },
  onPlaying: function(e) {
    this.debug('[event onPlaying]');
    
    this._playerPosterHide();
    this._playerLoaderHide();
    this._playerErrorHide();
  },
  onSeeking: function(e) {
    
  },
  onWaiting: function(e) {
    this.debug('[event onWaiting]');
    this._playerLoaderShow();
  },
  onStalled: function(e) {
    this.debug('[event onStalled]');
    this._playerLoaderShow();
    this._controllerProgressStop();
  },
  onError: function(e) {
    this.debug('[event onError]');
    this._playerLoaderHide();
    this._playerErrorShow(this.video[0].error);
  },
  onResize: function(e) {
    
  },
  onLoadStart: function(e) {
    this.debug('[event onLoad]');
    this._controllerProgressBufferStart();
  },
  onLoadedData: function(e) {
    this.debug('[event onLoadedData]');
  },
  onVolumeChange: function(e) {
    
  },
  onResize: function(e) {
    if ( this.isFullscreen ) {
      this._playerPosition();
      this._controllerPosition();
    }
  }
};

Function.prototype.context = function(obj) {
  var method = this
  temp = function() {
    return method.apply(obj, arguments)
  }
  return temp
}

})(jQuery);
