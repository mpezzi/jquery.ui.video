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
  // defaults: {
  //     buttonWidth: 25,
  //     buttonHeight: 24,
  //     buttonMarginTop: 5,
  //     buttonMarginRight: 0,
  //     buttonMarginBottom: 5,
  //     buttonMarginLeft: 5,
  //     buttonRadius: 5
  //   },
  codec: null,
  codecs: { mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', ogg: 'video/ogg; codecs="theora, vorbis"', webm: 'video/webm; codecs="vp8, vorbis"' },
  
  // Initialize player.
  _init: function() {
    this._playerBuild();
    this.element.hide();
  },
  
  // Public methods.
  play: function(item) {
    if ( this.current !== item && this.playlist[item] !== undefined ) {
      this.video[0].src = this.getFile(this.playlist[item].url);
      this.video[0].load();
      this.video[0].play();
      this.current = item;
    }
  },
  prev: function() {
    this.play(this.current - 1);
  },
  next: function() {
    this.play(this.current + 1);
  },
  controller: function(visible) {
    visible ? this._controllerShow() : this._controllerHide();
    return this.element;
  },
  
  // Private methods.
  _playerBuild: function() {
    this.current = 0;
    
    this.container = $('<div></div>').css({ width: this.options.width, height: this.options.height }).addClass('video-container').appendTo(this.container);
    this.video = $('<video></video>').attr({ width: this.options.width, height: this.options.height }).appendTo(this.container);
    this.loader = $('<div></div>').css({ width: this.options.width, height: this.options.height }).addClass('video-loader').appendTo(this.container);
    this.error = $('<div><span></span></div>').css({ width: this.options.width, height: this.options.height }).addClass('video-error').appendTo(this.container);
    
    this.options.autoplay ? this.video.attr('autoplay', 'autoplay') : false;
    this.options.preload ? this.video.attr('preload', 'preload') : false;
    
    this._posterBuild();
    this._controllerBuild();
    
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
    
    // Control Events.
    this.video.bind('mouseup', this.onControlPlayClick.context(this));
    this.container.bind('mousemove', this.onControlContainerMouseMove.context(this));
    this.container.bind('mouseleave', this.onControlContainerMouseLeave.context(this));
    this.controller.bind('mouseenter', this.onControlControllerMouseEnter.context(this));
    this.controller.bind('mouseleave', this.onControlControllerMouseLeave.context(this));
    this.control.play.bind('mouseup', this.onControlPlayClick.context(this));
    this.control.prev.bind('mouseup', this.onControlPrevClick.context(this));
    this.control.next.bind('mouseup', this.onControlNextClick.context(this));
    this.control.scrubber.bind('mousedown', this.onControlProgressMouseDown.context(this));
    this.control.scrubber.bind('mouseup', this.onControlProgressMouseUp.context(this));
    this.control.volume.bind('mousedown', this.onControlVolumeMouseDown.context(this));
    this.control.volume.bind('mouseup', this.onControlVolumeMouseUp.context(this));
    this.control.fullscreen.bind('mouseup', this.onControlFullscreenClick.context(this));
    
    // Define the first video source.
    if ( this.options.autoplay ) {
      this.loadPlaylist();
    }
  },
  _controllerBuild: function() {
    this.onController = false;
    
    // Build controller.
    this.controller = $('<ul>').hide().width(this.options.width).addClass('video-controller').appendTo(this.container);
    
    // Build control elements.
    this.control = {
      play: $('<li></li>').attr('title', 'Play').addClass('video-control-button video-control-play').appendTo(this.controller),
      prev: $('<li></li>').hide().attr('title', 'Previous').addClass('video-control-button video-control-prev').appendTo(this.controller),
      next: $('<li></li>').hide().attr('title', 'Next').addClass('video-control-button video-control-next').appendTo(this.controller),
      scrubber: $('<li></li>').addClass('video-control-scrubber').appendTo(this.controller),
      progress: $('<span></span>').addClass('video-control-bar video-control-scrubber-progress'),
      buffer: $('<span></span>').addClass('video-control-bar video-control-scrubber-buffer'),
      total: $('<span></span>').addClass('video-control-bar video-control-scrubber-total'),
      time: $('<span></span>').addClass('video-control-bar video-control-scrubber-time'),
      volume: $('<li></li>').attr('title', 'Volume').addClass('video-control-volume').appendTo(this.controller),
      fullscreen: $('<li></li>').attr('title', 'Fullscreen').addClass('video-control-button video-control-fullscreen').appendTo(this.controller)
    };
    
    // Add progress elements to scrubber.
    $([this.control.progress, this.control.buffer, this.control.total]).appendTo(this.control.scrubber);
    
    // Show playlist buttons.
    if ( this.playlist.length > 1 ) {
      this.control.prev.show();
      this.control.next.show();
    }
  },
  _controllerPosition: function() {
    scrubber = ( this.playlist.length > 1 ) ? 172 : 108;
    this.control.scrubber.width(this.options.width - scrubber);
  },
  _controllerShow: function() {
    if ( this.controller.is(':visible') ) return;
    
    this._controllerPosition();
    this.controller.fadeIn();
  },
  _controllerHide: function(delayed) {
    if ( delayed !== undefined ) {
      clearInterval(this._controllerHideDelay);
      if ( !this.onController ) {
        //this.debug('[start: hideControllerDelay]');
        this._controllerHideDelay = setTimeout(function(){ 
          this.debug('[end: hideControllerDelay]');
          this._controllerHide();
        }.context(this), 4000);  
      }
    } else {
      //this.controller.fadeOut();
    }
  },
  _posterBuild: function() {
    this.video.attr('poster', this._buildPoster);
  },
  _posterPosition: function() {
    
  },
  _posterShow: function() {
    
  },
  _posterHide: function() {
    
  },
  _loaderShow: function() {
    this.loader.fadeIn(200);
  },
  _loaderHide: function() {
    this.loader.fadeOut(1000);
  },
  _errorShow: function(error) {
    var message;
    
    if ( this.error.is(':hidden') )
      this.error.fadeIn();
    
    switch ( error.code ) {
      case error.MEDIA_ERR_ABORTED: message = 'You aborted the video playback.'; break;
      case error.MEDIA_ERR_NETWORK: message = 'A network error caused the video download to fail part-way.'; break;
      case error.MEDIA_ERR_DECODE: message = 'The video playback was aborted due to a corruption problem <br />or because the video used features your browser did not support.'; break;
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED: message = 'The video could not be loaded, either because the server or <br />network failed or because the format is not supported.'; break;
      default: message = 'An unknown error occurred.'; break;
    }
    
    this.error.find('span').html(message);
  },
  _errorHide: function() {
    if ( this.error.is(':visible') )
      this.error.fadeOut();
  },
  
  // Controller events.
  onControllerPlay: function(e) {
    this.debug('[event controller: onControllerPlay]');
    this.video[0].paused ? this.video[0].play() : this.video[0].pause();
  },
  onControllerPrev: function(e) {
    this.debug('[event controller: onControllerPrev]');
    this.prev();
  },
  onControllerNext: function(e) {
    this.debug('[event controller: onControllerNext]');
    this.next();
  },
  onControllerScrubberStart: function(e) {
    this.debug('[event controller: onControllerScrubberStart]');
  },
  onControllerScrubberStop: function(e) {
    this.debug('[event controller: onControllerScrubberStop]');
  },
  onControllerVolumeStart: function(e) {
    this.debug('[event controller: onControllerVolumeStart]');
  },
  onControllerVolumeStop: function(e) {
    this.debug('[event controller: onControllerVolumeStop]');
  },
  onControllerFullscreen: function(e) {
    this.debug('[event controller: onControllerFullscreen]');
  },
  onControllerShow: function(e) {
    this.debug('[event controller: onControllerShow]');
    this._controllerShow();
    this._controllerHide(true);
  },
  onControllerHide: function(e) {
    this.debug('[event controller: onControllerHide]');
    this._controllerHide(true);
  },
  onControllerOver: function(e) {
    this.debug('[event controller: onControllerOver]');
    this.onController = true;
  },
  onControllerOut: function(e) {
    this.debug('[event controller: onControllerOut]');
    this.onController = false;
  }
  
  // Player events.
  onPlay: function(e) {
    this.debug('[event player: onPlay]');
  },
  onPlaying: function(e) {
    this.debug('[event player: onPlaying]');
    this._loaderHide();
    this._errorHide();
  },
  onPause: function(e) {
    this.debug('[event player: onPause]');
  },
  onSeek: function(e) {
    this.debug('[event player: onSeek]');
  },
  onEnded: function(e) {
    this.debug('[event player: onEnded]');
    this.playlist[this.current + 1] !== undefined ? this.next() : this.current = 0;
  },
  onVolumeChange: function(e) {
    this.debug('[event player: onVolumeChange]');
  },
  onLoadStart: function(e) {
    this.debug('[event player: onLoadStart]');
  },
  onLoadedData: function(e) {
    this.debug('[event player: onLoadedData]');
  },
  onStalled: function(e) {
    this.debug('[event player: onStalled]');
    this._loaderShow();
  },
  onWaiting: function(e) {
    this.debug('[event player: onWaiting]');
    this._loaderShow();
  },
  onError: function(e) {
    this.debug('[event player: onError]');
  },
  
  // Old functions.
  sizeProgressBar: function() {
    
  },
  
  playProgressSet: function() {
    
  },
  
  playProgressSetWithEvent: function() {
    
  },
  
  playProgressTrack: function() {
    
  },
  
  playProgressUntrack: function() {
    
  },
  
  playProgressUpdate: function() {
    
  },
  
  updateTimeDisplay: function() {
    
  },
  
  setVolume: function() {
    
  },
  
  setVolumeWithEvent: function() {
    
  },
  
  updateVolumeDisplay: function() {
  
  },
  
  fullscreenOn: function() {
  
  },
  
  fullscreenOff: function() {
  
  },
  
  blockTextSelection: function() {
    
  },
  
  unblockTextSelection: function() {
    
  },
  
  formatTime: function(seconds) {
    
  },
  
  getRelativePosition: function(x, relativeElement) {
    
  },
  
  findPosX: function(obj) {
    
  },
  
  getFile: function(src) {
    if ( this.codec == null ) {
      for ( var i in this.codecs ) {
        if ( this.video[0].canPlayType(this.codecs[i]) && this.codec == null ) {
          this.codec = i;
        }
      }  
    }
    
    return src.replace('.' + this.getFileType(src), '.' + this.codec);
  },
  
  getFileType: function(src) {
    var parts = src.split('?')[0].split('.');
    return parts[parts.length - 1];
  },
  
  loadPlaylist: function() {
    if ( this.video[0].src == '' ) {
      this.video[0].src = this.getFile(this.playlist[0].url);
      this.video[0].load();
    }
  },
  
  _blockTextSelection: function() {
    document.body.focus();
    document.onselectstart = function () { return false; };
  },
  
  _unblockTextSelection: function() {
    document.onselectstart = function () { return true; };
  },
  
  // Event listeners.
  onLoadStart: function(e) {
    this.debug('[event: onLoadStart]');
  },
  
  onLoadedData: function(e) {
    this.debug('[event: onLoadedData]');
  },
  
  onStalled: function(e) {
    this.debug('[event: onStalled]');
    this._loaderShow();
  },
  
  onWaiting: function(e) {
    this.debug('[event: onWaiting]');
    this._loaderShow();
  },
  
  onPlay: function(e) {
    this.loadPlaylist();    
    this.debug('[event: onPlay - ' + this.video[0].src + ']');
  },
  
  onPlaying: function(e) {
    this.debug('[event: onPlaying]');
    this._loaderHide();
    this._errorHide();
  },
  
  onPause: function(e) {
    this.debug('[event: onPause]');
  },
  
  onSeeking: function(e) {
    this.debug('[event: onSeeking]');
  },
  
  onEnded: function(e) {
    this.debug('[event: onEnded]');
    
    if ( this.playlist[this.current + 1] !== undefined ) {
      this.next();
    } else {
      this.current = 0;
    }
  },
  
  onVolumeChange: function(e) {
    this.debug('[event: onVolumeChange]');
  },
  
  onError: function(e) {
    this.debug('[event: onError]');
    this.debug(this.video[0].error);
    this.showError(this.video[0].error);
  },
    
  onControlPlayClick: function(e) {
    this.debug('[event: onControlPlayClick]');
    this.video[0].paused ? this.video[0].play() : this.video[0].pause();
  },
  
  onControlPrevClick: function(e) {
    this.debug('[event: onControlPrevClick]');
    this.prev();
  },
  
  onControlNextClick: function(e) {
    this.debug('[event: onControlNextClick]');
    this.next();
  },
  
  onControlProgressMouseDown: function(e) {
    this.debug('[event: onControlProgressMouseDown]');
    
    var self = this;
    
    if ( this.video[0].paused ) {
      this.videoWasPlaying = false;
    } else {
      this.videoWasPlaying = true;
      this.video[0].pause();
    }
    
    this._blockTextSelection();
    
    $(document).bind('mousemove', this.setPlayProgressWithEvent().context(this));
    
    $(document).bind('mouseup', function(){
      self._unblockTextSelection();
      $(document).unbind('mousemove mouseup');
      if ( this.videoWasPlaying ) {
        this.video[0].play();
        this.trackPlayProgress()
      }
    });
  },
  
  onControlProgressMouseUp: function(e) {
    this.debug('[event: onControlProgressMouseUp]');
  },
  
  onControlVolumeMouseDown: function(e) {
    this.debug('[event: onControlVolumeMouseDown]');
  },
  
  onControlVolumeMouseUp: function(e) {
    this.debug('[event: onControlVolumeMouseUp]');
  },
  
  onControlFullscreenClick: function(e) {
    this.debug('[event: onControlFullscreenClick]');
  },
  
  onControlContainerMouseMove: function(e) {
    //this.debug('[event: onControlContainerMouseMove]');
    this._controllerShow();
    this._controllerHide(true);
  },
  
  onControlContainerMouseLeave: function(e) {
    //this.debug('[event: onControlContainerMouseLeave]');
    this.hideController(true);
  },
  
  onControlControllerMouseEnter: function(e) {
    //this.debug('[event: onControlControllerMouseEnter]');
    this.onController = true;
  },
  
  onControlControllerMouseLeave: function(e) {
    //this.debug('[event: onControlControllerMouseLeave]');
    this.onController = false;
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

