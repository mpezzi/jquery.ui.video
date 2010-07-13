<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

  <title>jQuery UI Video Plugin - Demo</title>
  
  <style type="text/css">@import "style.css";</style>
  <style type="text/css">@import "../players/html5/controllers/apple/css/ui.video.apple.css";</style>
  
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
  
  <script type="text/javascript" src="../jquery.ui.video.js"></script>
  <script type="text/javascript" src="../jquery.ui.video.dfp.js"></script>
  <script type="text/javascript" src="../players/html5/jquery.ui.video.html5.js"></script>
  <script type="text/javascript" src="../players/html5/controllers/apple/jquery.ui.video.html5.apple.js"></script>
  <script type="text/javascript" src="../players/flowplayer/jquery.ui.video.flowplayer.js"></script>
  <script type="text/javascript" src="../players/flowplayer/js/flowplayer-3.2.2.min.js"></script>
  
  <script type='text/javascript'>var v = null; $(document).ready(function(){ v = $('.ui-video').videodfp(); });</script>
  
  <script type='text/javascript' src='http://partner.googleadservices.com/gampad/google_service.js'></script>
  <script type='text/javascript'>GS_googleAddAdSenseService("ca-pub-5502974033364117"); GS_googleEnableAllServices();</script>
  <script type='text/javascript'>
    GA_googleAddSlot("ca-pub-5502974033364117", "HH_TV_Dynamic_Bigbox_300x250");
    GA_googleAddSlot("ca-pub-5502974033364117", "HH_TV_Static_Bigbox_300x250");
    GA_googleAddSlot("ca-pub-5502974033364117", "HH_TV_Static_Custom_300x80");
    GA_googleAddSlot("ca-pub-5502974033364117", "HH_TV_Video_640x360");
  </script>
  <script type='text/javascript'>GA_googleFetchAds();</script>
  <script type="text/javascript">GA_googleAddAttr('sponsor', 'hhtv');</script>
  <script type='text/javascript'>//GA_googleFillSlot("HH_TV_Video_640x360");</script>
  <script type="text/javascript">
    $(document).ready(function(){
      if ( v != undefined ) {
        v.videodfp('add', 1, {
          title: 'Home Hardware Signature Series',
          url: 'http://vhs.houseandhome.com/hhtv/advertisements/homehardware/homehardware_ad1.mp4',
          banner: 'http://www.houseandhome.com/en/test/images/test-bigbox-1-dark.jpg',
          linkUrl: 'http://www.homehardware.com|HHTV_Home Hardware_Signature',
          trackingUrl: '%%CLICK_URL_ESC%%',
          forced: true
        });
        
        v.videodfp('add', 4, {
          title: 'HHTV_ClickLighting_welcomevideo',
          url: 'http://vhs.houseandhome.com/hhtv/advertisements/click_lighting/click15.mp4',
          banner: 'http://www.houseandhome.com/en/test/images/test-bigbox-3-dark.jpg',
          linkUrl: 'http://clicklightingandhome.com/|HHTV_ClickLighting_welcomevideo',
          trackingUrl: '%%CLICK_URL_ESC%%',
          forced: true
        });
      }
    });
  </script>
  <script type="text/javascript">
    $(document).ready(function(){
      
      // Initialize player.
      v.video({ player: '<?php print $_GET["p"]; ?>' }).bind('play', function(e, item){ $('#debug').html(item.url); });
      
      // Link control elements.
      $('#controls a').click(function(){ v.video( $(this).attr('id') ); });
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
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/opening2.mp4" class="item">Opening</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/cameron_bedroom.mp4" class="item">Cameron</a></li>
    <li><a href="http://video-js.zencoder.com/oceans-clip.mp4" class="item">Oceans</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/photo_goo.mp4" class="item">Photo Goo</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/mcewan_food.mp4" class="item">McEwan</a></li>
    <li><a href="http://vhs.houseandhome.com/hhtv/s01/e29/e29_credits.mp4" class="item">Credits<img class="poster" src="http://www.houseandhome.com/tv/sites/default/files/segments/cameron-bedroom.jpg" /></a></li>
  </ol>
  
  <script type='text/javascript'>
    GA_googleFillSlot("HH_TV_Dynamic_Bigbox_300x250");
    GA_googleFillSlot("HH_TV_Static_Bigbox_300x250");
    GA_googleFillSlot("HH_TV_Static_Custom_300x80");
  </script>
  
</div> <!-- / #page -->

</body>
</html>
