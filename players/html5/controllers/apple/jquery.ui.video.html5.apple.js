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
  
  $.ui.video.html5.apple = {
    videoWasPlaying: false,
    
    _controllerCreate: function() {
      this.debug('[_controllerCreate]');
      
      // Create controller.
      this.controls = $('<ul class="ui-video-controller">').hide().appendTo(this.container);
      
      // Create control elements.
      this.control = {
        play:       $('<li class="ui-video-control-button ui-video-control-play">Play</li>').attr('title', 'Play').appendTo(this.controls),
        prev:       $('<li class="ui-video-control-button ui-video-control-prev">Prev</li>').attr('title', 'Prev').hide().appendTo(this.controls),
        next:       $('<li class="ui-video-control-button ui-video-control-next">Next</li>').attr('title', 'Next').hide().appendTo(this.controls),
        progress:   $('<li class="ui-video-control-progress"><ul></ul></li>').appendTo(this.controls),
        position:   $('<li class="ui-video-control-bar ui-video-control-position"></li>'),
        buffer:     $('<li class="ui-video-control-bar ui-video-control-buffer"></li>'),
        time:       $('<li class="ui-video-control-time"></li>').appendTo(this.controls),
        volume:     $('<li class="ui-video-control-volume"></li>').appendTo(this.controls),
        fullscreen: $('<li class="ui-video-control-button ui-video-control-fullscreen">Fullscreen</li>').attr('title', 'Fullscreen').appendTo(this.controls)
      };
      
      // Add progress bars to progress element.
      $([this.control.buffer, this.control.position]).appendTo( this.control.progress.find('ul') );
      
      this._controllerInit();
    },
    _controllerInit: function() {
      this.debug('[_controllerInit]');
      
      // Register HTMLMediaElement event listeners.
      this.media.addEventListener('play', this.onControllerMediaPlay.context(this), false);
      this.media.addEventListener('playing', this.onControllerMediaPlaying.context(this), false);
      this.media.addEventListener('pause', this.onControllerMediaPause.context(this), false);
      this.media.addEventListener('progress', this.onControllerMediaProgress.context(this), false);
      this.media.addEventListener('loadstart', this.onControllerMediaLoadStart.context(this), false);
      this.media.addEventListener('loadeddata', this.onControllerMediaLoadedData.context(this), false);
      this.media.addEventListener('ended', this.onControllerMediaEnded.context(this), false);
      this.media.addEventListener('error', this.onControllerMediaError.context(this), false);
      
      // Register Controller event listeners.
      this.video.bind('mouseup', this.onControllerPlay.context(this));
      this.poster.bind('click', this.onControllerPlay.context(this));
      this.container.bind('mousemove', this.onControllerShow.context(this));
      this.container.bind('mouseleave', this.onControllerHide.context(this));
      this.controls.bind('mouseenter', this.onControllerOver.context(this));
      this.controls.bind('mouseleave', this.onControllerOut.context(this));
      this.control.play.bind('mouseup', this.onControllerPlay.context(this));
      this.control.prev.bind('mouseup', this.onControllerPrev.context(this));
      this.control.next.bind('mouseup', this.onControllerNext.context(this));
      this.control.progress.bind('mousedown', this.onControllerProgressPositionDragStart.context(this));
      this.control.fullscreen.bind('mouseup', this.onControllerFullscreen.context(this));
      
      // Register Keyboard event listeners.
      $(document).bind('keyup', this.onControllerKeyPress.context(this));
      
      // Register Window event listeners.
      $(window).resize(this.onControllerPlayerResize.context(this));
    },
    _controllerShow: function() {
      if ( this.controls.is(':visible') ) return;
      this.debug('[_controllerShow]');
      this._controllerPosition();
      this.controls.fadeIn();
      this.isControllerVisible = true;
    },
    _controllerHide: function(delayed) {
      if ( delayed ) {
        clearInterval(this._controllerHideDelay);
        if ( !this.isControllerActive ) {
          this._controllerHideDelay = setTimeout(function(){
            this._controllerHide();
          }.context(this), 4000);
        }
      } else {
        this.debug('[_controllerHide]');
        this.controls.fadeOut();
        this.isControllerVisible = false;
      }
    },
    _controllerPosition: function() {
      this.controls.css('left', ( this.video.width() / 2 ) - ( this.controls.width() / 2) + 'px');
    },
    _controllerPercentage: function(x, y) {
      var percent = ( x / y ) * 100;
      return ( percent <= 100 && percent >= 0 ) ? percent : 0;
    },
    _controllerRelativePosition: function(x, element) {
      return Math.max(0, Math.min(1, ( x - this._controllerFindX(element) ) / element.offsetWidth));
    },
    _controllerFindX: function(element) {
      var x = element.offsetLeft;
      
      while ( element = element.offsetParent ) {
        x += element.offsetLeft;
      }
      
      return x;
    },
    _controllerProgressPositionTrackStart: function() {
      this._controllerProgressPositionTrackInterval = setInterval(function(){
        this._controllerProgressPositionTrackUpdate();
      }.context(this), 33);
    },
    _controllerProgressPositionTrackStop: function() {
      clearInterval(this._controllerProgressPositionTrackInterval);
    },
    _controllerProgressPositionTrackUpdate: function() {
      if ( this.isControllerVisible ) {
        this.control.position.css('width', this._controllerPercentage(this.media.currentTime, this.media.duration) + '%');
      }
    },
    _controllerForced: function(forced) {
      if ( forced ) {
        this.control.prev.hide();
        this.control.next.hide();
        this.media.seekable = false;
      } else {
        this.control.prev.show();
        this.control.next.show();
        this.media.seekable = true;
      }
    },
    
    // HTMLMediaElement events.
    onControllerMediaPlay: function(e) {
      this.debug('[event onControllerMediaPlay]');
      this.control.play.text('Pause');
    },
    onControllerMediaPlaying: function(e) {
      this.debug('[event onControllerMediaPlaying]');
      this._controllerForced(this.playlist[this.current].forced);
      this._controllerProgressPositionTrackStart();
    },
    onControllerMediaPause: function(e) {
      this.debug('[event onControllerMediaPause]');
      this.control.play.text('Play');
    },
    onControllerMediaProgress: function(e) {
      this.debug('[event onControllerMediaProgress]');
      
      var loaded = e.loaded || this.media.buffered.end(0),
          total = e.total || this.media.duration;
      
      this.control.buffer.css('width', Math.round(this._controllerPercentage(loaded, total)) + "%");
    },
    onControllerMediaLoadStart: function(e) {
      //this.debug('[event onControllerMediaLoadStart]');
    },
    onControllerMediaLoadedData: function(e) {
      this.debug('[event onControllerMediaLoadedData]');
    },
    onControllerMediaEnded: function(e) {
      this.debug('[event onControllerMediaEnded]');
      this._controllerProgressPositionTrackStop();
    },
    onControllerMediaError: function(e) {
      this._controllerForced(false);
    },
    
    // Controller events.
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
    onControllerShow: function(e) {
      this._controllerShow();
      this._controllerHide(true);
    },
    onControllerHide: function(e) {
      this._controllerHide(true);
    },
    onControllerOver: function(e) {
      this.isControllerActive = true;
    },
    onControllerOut: function(e) {
      this.isControllerActive = false;
    },
    onControllerProgressPositionDragStart: function(e) {
      var self = this;
      
      // Disable any text selection on document.
      self._playerTextSelectionBlock();
      
      // Remember current video state.
      if ( self.media.paused ) {
        self.videoWasPlaying = false;
      } else {
        self.videoWasPlaying = true;
        self.media.pause();
      }
      
      $(document)
        .bind('mousemove', self.onControllerProgressPositionDragUpdate.context(self))
        .bind('mouseup', function() {
          $(this).unbind('mousemove mouseup');
          
          // Enable any text selection on document.
          self._playerTextSelectionUnblock();
          
          // Return video to previous play state.
          if ( self.videoWasPlaying ) {
            self.media.play();
          }
        });
    },
    onControllerProgressPositionDragUpdate: function(e) {
      //this.debug(this._controllerRelativePosition(e.pageX, this.control.progress[0]) * this.media.duration);
      this._playerSetPosition( this._controllerRelativePosition(e.pageX, this.control.progress[0]) * this.media.duration );
    },
    onControllerFullscreen: function(e) {
      this.debug('[event onControllerFullscreen]');
      this._playerFullscreen(!this._isFullscreen);
      this._controllerPosition();
    },
    onControllerKeyPress: function(e) {
      
    },
    onControllerPlayerResize: function(e) {
      this._controllerPosition();
    }
    
  };
  
})(jQuery);