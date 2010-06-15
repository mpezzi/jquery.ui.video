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
  current: null,
  codec: null,
  codecs: { mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', ogg: 'video/ogg; codecs="theora, vorbis"', webm: 'video/webm; codecs="vp8, vorbis"' },
  
  // Initialize player.
  _init: function() {
    this._playerBuild();
    this.element.hide();
  },
  
  // Public methods.
  play: function(item) {
    if ( item !== undefined && this.current !== item && this.playlist[item] !== undefined ) {
      this.video[0].src = this._fileGet(this.playlist[item].url);
      this.video[0].load();
      this.current = item;
    }
    
    this.paused() ? this.video[0].play() : this.pause();
  },
  pause: function() {
    this.video[0].pause();
  },
  paused: function() {
    return this.video[0].paused;
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
  fullscreen: function(visible) {
    
  },
  
  // Private methods.
  _playerBuild: function() {
    this.videoIsFullscreen = false;
    
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
    this.video[0].addEventListener('seeking', this.onSeek.context(this), false);
    this.video[0].addEventListener('ended', this.onEnded.context(this), false);
    this.video[0].addEventListener('volumechange', this.onVolumeChange.context(this), false);
    this.video[0].addEventListener('error', this.onError.context(this), false);
    
    // Control Events.
    this.video.bind('click', this.onControllerPlay.context(this));
    this.container.bind('mousemove', this.onControllerShow.context(this));
    this.container.bind('mouseleave', this.onControllerHide.context(this));
    this.controller.bind('mouseenter', this.onControllerOver.context(this));
    this.controller.bind('mouseleave', this.onControllerOut.context(this));
    this.controls.play.bind('mouseup', this.onControllerPlay.context(this));
    this.controls.prev.bind('mouseup', this.onControllerPrev.context(this));
    this.controls.next.bind('mouseup', this.onControllerNext.context(this));
    this.controls.progress.bind('mousedown', this.onControllerScrubberStart.context(this));
    this.controls.progress.bind('mouseup', this.onControllerScrubberStop.context(this));
    this.controls.volume.bind('mousedown', this.onControllerVolumeStart.context(this));
    this.controls.volume.bind('mouseup', this.onControllerVolumeStop.context(this));
    this.controls.fullscreen.bind('mouseup', this.onControllerFullscreen.context(this));
    
    // Initialize playlist.
    if ( this.options.autoplay )
      this._playlistInit();
  },
  _controllerBuild: function() {
    this.onController = false;
    
    // Build controller.
    this.controller = $('<ul>').hide().width(this.options.width).addClass('video-controller').appendTo(this.container);
    
    // Build control elements.
    this.controls = {
      play: $('<li class="video-control-button video-control-play">Play</li>').attr('title', 'Play').appendTo(this.controller),
      prev: $('<li class="video-control-button video-control-prev">Previous</li>').attr('title', 'Previous').hide().appendTo(this.controller),
      next: $('<li class="video-control-button video-control-next">Next</li>').attr('title', 'Next').hide().appendTo(this.controller),
      progress: $('<li class="video-control-progress"><ul></ul></li>').appendTo(this.controller),
      position: $('<li class="video-control-position"></li>'),
      buffer: $('<li class="video-control-buffer"></li>'),
      time: $('<li class="video-control-time"></li>'),
      volume: $('<li class="video-control-volume"></li>').attr('title', 'Volume').appendTo(this.controller),
      fullscreen: $('<li class="video-control-button video-control-fullscreen">Fullscreen</li>').attr('title', 'Fullscreen').appendTo(this.controller)
    };
    
    // Add progress elements to progress container.
    $([this.controls.position, this.controls.buffer, this.controls.total]).appendTo(this.controls.progress);
    
    // Show playlist buttons.
    if ( this.playlist.length > 1 ) {
      this.controls.prev.show();
      this.controls.next.show();
    }
  },
  _controllerPosition: function() {
    scrubber = ( this.playlist.length > 1 ) ? 172 : 108;
    this.controls.progress.width(this.options.width - scrubber);
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
      this.controller.fadeOut();
    }
  },
  _fileGet: function(src) {
    if ( this.codec == null ) {
      for ( var i in this.codecs ) {
        if ( this.video[0].canPlayType(this.codecs[i]) && this.codec == null ) {
          this.codec = i;
        }
      }  
    }
    
    return src.replace('.' + this._fileGetExtension(src), '.' + this.codec);
  },
  _fileGetExtension: function(src) {
    var parts = src.split('?')[0].split('.');
    return parts[parts.length - 1];
  },
  _fullscreen: function(visible) {
    if ( this.videoIsFullscreen = visible ) {
      this.videoOverflow = document.documentElement.style.overflow = 'hidden';
      this.container.addClass('video-fullscreen');
    } else {
      document.documentElement.style.overflow = this.videoOverflow;
      this.container.removeClass('video-fullscreen');
    }
    
    this._controllerPosition();
    this._posterPosition();
  },
  _playlistInit: function() {
    if ( this.video[0].src == '' ) {
      this.video[0].src = this._fileGet(this.playlist[0].url);
      this.video[0].load();
      this.current = 0;
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
  _volumeSet: function(level) {
    this.debug('[set volume level - ' + level + ']');
    this.video[0].volume = localStorage['volume'] = level;
  },
  _textSelectionBlock: function() {
    document.body.focus();
    document.onselectstart = function () { return false; };
  },
  _textSelectionUnblock: function() {
    document.onselectstart = function () { return true; };
  },
  _positionRelative: function(x, relativeElement) {
    return Math.max(0, Math.min(1, (x - this._positionFindX(relativeElement[0])) / relativeElement[0].offsetWidth));
  },
  _positionFindX: function(obj) {
    var curleft = obj.offsetLeft;
    while(obj = obj.offsetParent) {
      curleft += obj.offsetLeft;
    }
    return curleft;
  },
  
  // Controller events.
  onControllerPlay: function(e) {
    this.debug('[event controller: onControllerPlay]');
    this.play();
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
  onControllerVolume: function(e) {
    //this.debug('[event controller: onControllerVolume]');
    this._volumeSet(this._positionRelative(e.pageX, this.control.volume));
  },
  onControllerVolumeStart: function(e) {
    //this.debug('[event controller: onControllerVolumeStart]');
    
    var self = this;
    
    this._textSelectionBlock();
    $(document).bind('mousemove', this.onControllerVolume.context(this));
    $(document).bind('mouseup', function(){ 
      this._textSelectionUnblock();
      $(document).unbind('mousemove mouseup');
    }.context(this));
  },
  onControllerVolumeStop: function(e) {
    //this.debug('[event controller: onControllerVolumeStop]');
    this.onControllerVolume(e);
  },
  onControllerFullscreen: function(e) {
    this.debug('[event controller: onControllerFullscreen]');
    this._fullscreen( !this.videoIsFullscreen );
  },
  onControllerShow: function(e) {
    //this.debug('[event controller: onControllerShow]');
    this._controllerShow();
    this._controllerHide(true);
  },
  onControllerHide: function(e) {
    //this.debug('[event controller: onControllerHide]');
    this._controllerHide(true);
  },
  onControllerOver: function(e) {
    this.debug('[event controller: onControllerOver]');
    this.onController = true;
  },
  onControllerOut: function(e) {
    this.debug('[event controller: onControllerOut]');
    this.onController = false;
  },
  
  // Player events.
  onPlay: function(e) {
    this._playlistInit();
    this.debug('[event player: onPlay] - ' + this.video[0].src);
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
    //this.debug('[event player: onVolumeChange]');
    var volume = Math.floor(this.video[0].volume * 6);
    for ( var i = 0; i < 6; i++ ) {
      
    }
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
    this._errorHide();
    this._loaderShow();
  },
  onError: function(e) {
    this.debug('[event player: onError]');
    this._errorShow(this.video[0].error);
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

