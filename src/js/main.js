var $ = require('expose?jQuery!../../vendor/bower_components/jquery/dist/jquery'),
    constants = require('../../config/constants');

require('../../vendor/javascripts/bootstrap');

// Loads data from API server
//
$.getJSON(constants.API_ENDPOINT, {}, function(data){
  $('.js-total-points').text(data.total_points);
  $('.js-total-users').text(data.total_users);
});

// Navigation-related interaction
//
var $body = $('body'),
    $deactivatingElements = $('main, .main-nav a'),
    NAV_OPEN_CLS = 'is-nav-opened';
$('#toggle').click(function(){
  $body.toggleClass(NAV_OPEN_CLS);

  $deactivatingElements.one('click', function(){
    $body.removeClass(NAV_OPEN_CLS);
  });
});

// Map activation
var $mapFold = $('.map-fold'), MAP_ACTIVE_CLS = 'is-map-activated';
$mapFold.find('.cover').click(function(){
  window.location.hash = '';
  window.location.hash = '#map';
  $mapFold.addClass(MAP_ACTIVE_CLS);

  window.ga('send', 'event', 'map', 'activate', 'booth');
});
$mapFold.find('.deactivate-map').click(function(){ $mapFold.removeClass(MAP_ACTIVE_CLS); });

// Loads Youtube video
//
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

// Send pageview events when scrolling through pages
//
$body.on('activate.bs.scrollspy', function(evt){
  var targetHash = $(evt.target).find('a').attr('href');
  // console.log(targetHash);
  window.ga('send', 'pageview', window.location.pathname + targetHash);
});

// Generic google analytics click event sender
//
$body.on('click', '[ga-label]', function(){
  var label = $(this).attr('ga-label');
  window.ga('send', 'event', 'button', 'click', label);
})
