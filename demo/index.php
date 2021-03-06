<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

  <title>jQuery UI Video Plugin - Demo</title>
  
  <style type="text/css">@import "style.css";</style>
  <style type="text/css">@import "../players/html5/controllers/apple/css/ui.video.apple.css";</style>
  
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.3/jquery-ui.min.js"></script>
  
  <script type="text/javascript" src="../jquery.ui.video.js"></script>
  <script type="text/javascript" src="../players/html5/jquery.ui.video.html5.js"></script>
  <script type="text/javascript" src="../players/html5/controllers/apple/jquery.ui.video.html5.apple.js"></script>
  <script type="text/javascript" src="../players/flowplayer/jquery.ui.video.flowplayer.js"></script>
  <script type="text/javascript" src="../players/flowplayer/js/flowplayer-3.2.2.min.js"></script>
  
  <script type="text/javascript">
    $(document).ready(function(){
      //var video = $('.ui-video').video();
      var v = $('.ui-video');
      
      v.video({ player: '<?php print $_GET["p"]; ?>' }).bind('play', function(e, item){
        $('#debug').html(item.url);
      });
      
      $('#controls a').click(function(){
        v.video( $(this).attr('id') );
      });
    });
  </script>
  
</head>

<body>

<div id="page">
  
  <ul>
    <li><a href="?p=html5">HTML5 Version</a></li>
    <li><a href="?p=flowplayer">Flowplayer Version</a></li>
  </ul>
  
  <div id="debug">
    Debugger
  </div>
  
  <p id="controls">
    <a id="play">Play</a><br />
    <a id="pause">Pause</a><br />
    <a id="prev">Prev</a><br />
    <a id="next">Next</a>
  </p>
  
  <h1>jQuery UI Video Plugin</h1>
  
  <p>This is a demonstration of the jQuery UI Video Plugin</p>
  
  <ol class="ui-video ui-video-autolay">
    <li><a rel="http://www.clicklightingandhome.com/Default.aspx|Find out more information about Click Lighting" href="http://vhs.houseandhome.com/hhtv/advertisements/click_lighting/click15.mp4" class="item item-forced">Click Lighting</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/opening2.mp4" class="item">Opening</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/cameron_bedroom.mp4" class="item">Cameron<img class="poster" src="http://www.houseandhome.com/tv/sites/default/files/segments/cameron-bedroom.jpg" /></a></li>
    <li><a href="http://video-js.zencoder.com/oceans-clip.mp4" class="item">Oceans</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/photo_goo.mp4" class="item">Photo Goo</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/mcewan_food.mp4" class="item">McEwan</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/e29_credits.mp4" class="item">Credits</a></li>
  </ol>
  
</div> <!-- / #page -->

</body>
</html>
