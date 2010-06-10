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
  
  buildPlayer: function() {
    this.container = $('<div>').css({ width: this.options.width, height: this.options.height }).addClass('video-container').appendTo(this.container);
    this.video = $('<video>').attr({ width: this.options.width, height: this.options.height }).appendTo(this.container);
    this.loader = $('<div>').css({ width: this.options.width, height: this.options.height }).addClass('video-loader').appendTo(this.container);
    
    this.buildPoster();
    this.showPoster();
    
    this.buildController();
    this.showController();
    
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
    this.video.bind('mousemove', this.onControlVideoMouseMove.context(this));
    this.video.bind('mouseout', this.onControlVideoMouseOut.context(this));
    this.controller.bind('mouseover', this.onControlControllerMouseOver.context(this));
    this.controller.bind('mouseout', this.onControlControllerMouseOut.context(this));
    this.control.play.bind('mouseup', this.onControlPlayClick.context(this));
    this.control.progress.bind('mousedown', this.onControlProgressMouseDown.context(this));
    this.control.progress.bind('mouseup', this.onControlProgressMouseUp.context(this));
    this.control.volume.bind('mousedown', this.onControlVolumeMouseDown.context(this));
    this.control.volume.bind('mouseup', this.onControlVolumeMouseUp.context(this));
    this.control.fullscreen.bind('mouseup', this.onControlFullscreenClick.context(this));
  },
  
  buildController: function() {
    this.onController = false;
    this.controller = $('<ul>').width(this.options.width).addClass('video-controller').appendTo(this.container);
    this.control = {
      play: $('<li>Play</li>').addClass('video-control-button video-control-play').appendTo(this.controller),
      progress: $('<li>Progress</li>').addClass('video-control-progress').appendTo(this.controller),
      time: $('<li>Time</li>').addClass('video-control-time').appendTo(this.controller),
      volume: $('<li>Volume</li>').addClass('video-control-volume').appendTo(this.controller),
      fullscreen: $('<li>Fullscreen</li>').addClass('video-control-button video-control-fullscreen').appendTo(this.controller)
    };
  },
  
  positionController: function() {
    
  },
  
  showController: function() {
    if ( this.controller.is(':hidden') )
      this.controller.fadeIn();
  },
  
  hideController: function() {
    if ( !this.onController )
      this.controller.fadeOut();
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
  
  onControlControllerMouseOver: function(e) {
    this.onController = true;
  },
  
  onControlControllerMouseOut: function(e) {
    this.onController = false;
  },
  
  onControlVideoMouseMove: function(e) {
    //this.debug('[event: onControlVideoMouseMove]');
    this.showController();
  },
  
  onControlVideoMouseOut: function(e) {
    //this.debug('[event: onControlVideoMouseOut]');
    this.hideController();
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

