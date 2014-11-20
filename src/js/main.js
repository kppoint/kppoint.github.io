var $ = require('expose?jQuery!../../vendor/bower_components/jquery/dist/jquery'),
    constants = require('../../config/constants');

require('../../vendor/javascripts/bootstrap');

$.getJSON(constants.API_ENDPOINT, {}, function(data){
  $('.js-total-points').text(data.total_points);
  $('.js-total-users').text(data.total_users);
});


var $body = $('body'),
    $deactivatingElements = $('main, .main-nav a'),
    NAV_OPEN_CLS = 'is-nav-opened';
$('#toggle').click(function(){
  $body.toggleClass(NAV_OPEN_CLS);

  $deactivatingElements.one('click', function(){
    $body.removeClass(NAV_OPEN_CLS);
  });
});

// Loads Youtube video
window.onYouTubeIframeAPIReady = function(){
  var player = new window.YT.Player('player', {
    width: '1280', height: '720',
    videoId: 'W2b3L-AbVi8', events: {
      onStateChange: function(evt){
        // Send google analytics event when video is played.
        if(evt.data === window.YT.PlayerState.PLAYING){
          window.ga('send', 'event', 'video', 'play', 'KP advertisement');
        }
      }
    }
  });
};