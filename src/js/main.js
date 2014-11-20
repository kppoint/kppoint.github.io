var $ = require('expose?jQuery!../../vendor/bower_components/jquery/dist/jquery'),
    constants = require('../../config/constants');

require('../../vendor/javascripts/bootstrap');

$.getJSON(constants.API_ENDPOINT, {}, function(data){
  $('.js-total-points').text(data.total_points);
  $('.js-total-users').text(data.total_users);
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