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

$.ui.video.html5.controller = {
  isControllerActive: false,
  isControllerVisible: false,
  
  _controllerBuild: function() {
    this.debug('[method _controllerBuild]');
    
    // Build controller.
    this.controller = $('<ul class="video-controller">').hide().appendTo(this.container);
    
    // Build control elements.
    this.controls = {
      play: $('<li class="video-control-button video-control-play">Play</li>').attr('title', 'Play').appendTo(this.controller),
      prev: $('<li class="video-control-button video-control-prev">Previous</li>').attr('title', 'Previous').hide().appendTo(this.controller),
      next: $('<li class="video-control-button video-control-next">Next</li>').attr('title', 'Next').hide().appendTo(this.controller),
      progress: $('<li class="video-control-progress"><ul></ul></li>').appendTo(this.controller),
      position: $('<li class="video-control-position"></li>'),
      buffer: $('<li class="video-control-buffer"></li>'),
      time: $('<li class="video-control-time"></li>').appendTo(this.controller),
      volume: $('<li class="video-control-volume"></li>').attr('title', 'Volume').appendTo(this.controller),
      fullscreen: $('<li class="video-control-button video-control-fullscreen">Fullscreen</li>').attr('title', 'Fullscreen').appendTo(this.controller)
    };
    
    // Add progress elements to progress container.
    $([this.controls.buffer, this.controls.position]).appendTo(this.controls.progress.find('ul'));
    
    this._controllerInit();
  },
  _controllerInit: function() {
    this.debug('[method _controllerInit]');
    
    // Control events.
    this.video.bind('click', this.onControllerPlay.context(this));
    this.poster.bind('click', this.onControllerPlay.context(this));
    this.container.bind('mousemove', this.onControllerShow.context(this));
    this.container.bind('mouseleave', this.onControllerHide.context(this));
    this.controller.bind('mouseenter', this.onControllerOver.context(this));
    this.controller.bind('mouseleave', this.onControllerOut.context(this));
    this.controls.play.bind('mouseup', this.onControllerPlay.context(this));
    this.controls.prev.bind('mouseup', this.onControllerPrev.context(this));
    this.controls.next.bind('mouseup', this.onControllerNext.context(this));
    this.controls.progress.bind('mousedown', this.onControllerProgressStart.context(this));
    this.controls.progress.bind('mouseup', this.onControllerProgressStop.context(this));
    this.controls.volume.bind('mousedown', this.onControllerVolumeStart.context(this));
    this.controls.volume.bind('mouseup', this.onControllerVolumeStop.context(this));
    this.controls.fullscreen.bind('mouseup', this.onControllerFullscreen.context(this));
    
    // Keyboard events.
    $(document).bind('keyup', this.onControllerKeyPress.context(this));
    
    // Show playlist buttons for multiple videos.
    if ( this.playlist.length > 1 ) {
      this.controls.prev.show();
      this.controls.next.show();
    }
  },
  _controllerPosition: function() {
    this.controller.css('left', ( this.video.width() / 2 ) - ( this.controller.width() / 2 ) + 'px');
  },
  _controllerShow: function() {
    if ( this.controller.is(':visible') || this.isFullscreenTransition ) return;
    this.debug('[method _controllerShow]');
    this._controllerPosition();
    this.controller.fadeIn();
    this.isControllerVisible = true;
  },
  _controllerHide: function(delayed) {
    if ( delayed !== undefined ) {
      clearInterval(this._controllerHideDelay);
      if ( !this.isOnController ) {
        this._controllerHideDelay = setTimeout(function(){
          this._controllerHide();
        }.context(this), 4000);
      }
    } else {
      this.debug('[method _controllerHide]');
      this.controller.fadeOut();
      this.isControllerVisible = false;
    }
  },
  _controllerProgressSet: function(progress) {
    this.video[0].currentTime = Math.floor( ( progress / 100 ) * this.video[0].duration );
  },
  _controllerProgressPercentage: function(x, y) {
    var percent = ( x / y ) * 100;
    return ( percent <= 100 && percent >= 0 ) ? percent : 0;
  },
  _controllerProgressPositionStart: function() {
    this._controllerProgressPositionInterval = setInterval(function(){
      this._controllerProgressPositionUpdate();
    }.context(this), 33);
  },
  _controllerProgressPositionStop: function() {
    clearInterval(this._controllerProgressPositionInterval);
  },
  _controllerProgressPositionUpdate: function() {
    if ( this.controller.is(':hidden') ) return;
    this.controls.position.css('width', this._controllerProgressPercentage(this.video[0].currentTime, this.video[0].duration) + '%');
  },
  _controllerProgressBufferStart: function() {
    
  },
  _controllerProgressBufferStop: function() {
    
  },
  _controllerProgressBufferUpdate: function() {
    
  },
  
  // Controller Listeners.
  onControllerPlay: function(e) {
    this.debug('[event onControllerPlay]');
    this.play();
  },
  onControllerPrev: function(e) {
    this.debug('[event onControllerPrev]');
    this.prev();
  },
  onControllerNext: function(e) {
    this.debug('[event onControllerNext]');
    this.next();
  },
  onControllerProgressStart: function(e) {
    
  },
  onControllerProgressStop: function(e) {
    
  },
  onControllerProgressUpdate: function(e) {
    
  },
  onControllerVolume: function(e) {
    
  },
  onControllerVolumeStart: function(e) {
    
  },
  onControllerVolumeStop: function(e) {
    
  },
  onControllerVolumeTrack: function(e) {
    
  },
  onControllerFullscreen: function(e) {
    
  },
  onControllerShow: function(e) {
    this._controllerShow();
    this._controllerHide(true);
  },
  onControllerHide: function(e) {
    this._controllerHide(false);
  },
  onControllerOver: function(e) {
    this.isControllerActive = true;
  },
  onControllerOut: function(e) {
    this.isControllerActive = false;
  },
  onControllerKeyPress: function(e) {
    
  }
};

})(jQuery);