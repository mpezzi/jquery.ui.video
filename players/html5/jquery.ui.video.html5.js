/*!
 * jQuery UI Video HTML5 Plugin
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * HTML5 Plugin based off of VideoJS. http://videojs.com
 */

// Using jresig's Class implementation http://ejohn.org/blog/simple-javascript-inheritance/
(function(){var initializing=false, fnTest=/xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/; this.Class = function(){}; Class.extend = function(prop) { var _super = this.prototype; initializing = true; var prototype = new this(); initializing = false; for (var name in prop) { prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn){ return function() { var tmp = this._super; this._super = _super[name]; var ret = fn.apply(this, arguments); this._super = tmp; return ret; }; })(name, prop[name]) : prop[name]; } function Class() { if ( !initializing && this.init ) this.init.apply(this, arguments); } Class.prototype = prototype; Class.constructor = Class; Class.extend = arguments.callee; return Class;};})();

(function($){

var player = 0;

$.ui.video.html5 = {
  _init: function() {
    this.buildPlayer();
    
    // Hide original construction element.
    this.element.hide();
  },
  
  play: function(item) {
    if ( this.current !== item && this.playlist[item] !== undefined ) {
      this.video[0].src = this.playlist[item].url;
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
  
  buildPlayer: function() {
    this.current = 0;
    
    this.container = $('<div>').css({ width: this.options.width, height: this.options.height }).addClass('video-container').appendTo(this.container);
    this.video = $('<video>').attr({ width: this.options.width, height: this.options.height }).appendTo(this.container);
    this.loader = $('<div>').css({ width: this.options.width, height: this.options.height }).addClass('video-loader').appendTo(this.container);
    
    this.options.autoplay ? this.video.attr('autoplay', 'autoplay') : false;
    this.options.preload ? this.video.attr('preload', 'preload') : false;
    
    this.buildPoster();
    this.showPoster();
    this.buildController();
    
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
  },
  
  buildController: function() {
    this.onController = false;
    
    // Build controller.
    this.controller = $('<ul>').hide().width(this.options.width).addClass('video-controller').appendTo(this.container);
    
    // Build control elements.
    this.control = {
      play: $('<li></li>').attr('title', 'Play').addClass('video-control-button video-control-play').appendTo(this.controller),
      prev: $('<li></li>').hide().attr('title', 'Previous').addClass('video-control-button video-control-prev').appendTo(this.controller),
      next: $('<li></li>').hide().attr('title', 'Next').addClass('video-control-button video-control-next').appendTo(this.controller),
      scrubber: $('<li></li>').addClass('video-control-scrubber').appendTo(this.controller),
      progress: $('<span></span>').addClass('video-control-scrubber-progress'),
      buffer: $('<span></span>').addClass('video-control-scrubber-buffer'),
      total: $('<span></span>').addClass('video-control-scrubber-total'),
      time: $('<span></span>').addClass('video-control-scrubber-time'),
      volume: $('<li></li>').attr('title', 'Volume').addClass('video-control-volume').appendTo(this.controller),
      fullscreen: $('<li></li>').attr('title', 'Fullscreen').addClass('video-control-button video-control-fullscreen').appendTo(this.controller)
    };
    
    // Add progress elements to scrubber.
    $([this.control.progress, this.control.buffer, this.control.total]).appendTo(this.scrubber);
    
    // Show playlist buttons.
    if ( this.playlist.length > 1 ) {
      this.control.prev.show();
      this.control.next.show();
    }
  },
  
  positionController: function() {
    scrubber = ( this.playlist.length > 1 ) ? 172 : 108;
    this.control.scrubber.width(this.options.width - scrubber);
  },
  
  showController: function() {
    if ( this.controller.is(':visible') ) return;
    
    this.positionController();
    this.controller.fadeIn();
  },
  
  hideController: function(delayed) {
    if ( delayed !== undefined ) {
      clearInterval(this.hideControllerDelay);
      if ( !this.onController ) {
        //this.debug('[start: hideControllerDelay]');
        this.hideControllerDelay = setTimeout(function(){ 
          this.debug('[end: hideControllerDelay]');
          this.hideController();
        }.context(this), 4000);  
      }
    } else {
      this.controller.fadeOut();
    }
  },
  
  buildPoster: function() {
    this.video.attr('poster', this._buildPoster);
  },
  
  positionPoster: function() {
    
  },
  
  showPoster: function() {
    
  },
  
  hidePoster: function() {
    
  },
  
  showLoader: function() {
    this.loader.fadeIn();
  },
  
  hideLoader: function() {
    this.loader.fadeOut();
  },
  
  sizeProgressBar: function() {
    
  },
  
  trackPlayProgress: function() {
    
  },
  
  stopTrackingPlayProgress: function() {
    
  },
  
  updatePlayProgress: function() {
    
  },
  
  setPlayProgress: function(newProgress) {
    
  },
  
  setPlayProgressWithEvent: function() {
    
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
  
  // Event listeners.
  onLoadStart: function(e) {
    this.debug('[event: onLoadStart]');
  },
  
  onLoadedData: function(e) {
    this.debug('[event: onLoadedData]');
  },
  
  onStalled: function(e) {
    this.debug('[event: onStalled]');
    this.showLoader();
  },
  
  onWaiting: function(e) {
    this.debug('[event: onWaiting]');
    this.showLoader();
  },
  
  onPlay: function(e) {
    this.debug('[event: onPlay]');
    
    // If there are no defined videos, play the first one.
    if ( this.video[0].src == '' ) {
      this.video[0].src = this.playlist[0].url;
      this.video[0].load();
    }
    
    this.video[0].play();
  },
  
  onPlaying: function(e) {
    this.debug('[event: onPlaying]');
    this.hideLoader();
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
    this.debug(e);
    this.debug(this.video[0].error);
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
    this.showController();
    this.hideController(true);
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

