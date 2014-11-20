var $ = require('expose?jQuery!../../vendor/bower_components/jquery/dist/jquery'),
    constants = require('../../config/constants'),
    FastClick = require('../../vendor/bower_components/fastclick/lib/fastclick');

require('../../vendor/javascripts/bootstrap');
FastClick.attach(document.body);

var $body = $('body'),
    $window = $('window');

// Loads data from API server
//
$.getJSON(constants.API_ENDPOINT, {}, function(data){
  animateText($('.js-total-points'), data.total_points);
  animateText($('.js-total-users'), data.total_users);
});

// Navigation-related interaction
//
var $deactivatingElements = $('main, .main-nav a'),
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

  // Wait until all assets loaded
  $(window).load(function(){
    console.log('onLoad called');
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
});

// Delay the loading of maps after body loads
//
$(window).load(function(){
  console.log('loading maps')
  $('.map-fold iframe').attr('src', 'https://mapsengine.google.com/map/u/0/embed?mid=zI3lo4kPc9e4.kuZC0pgWAtNs')
});

// Utility functions
//

function animateText($target, to) {
  var value, isPending = false;

  $({ value: +$target.text()}).animate({
      value: to
  }, {
    easing: 'swing', duration: 1600,
    progress: function(){
      value = this.value;
      if(!isPending){
        requestAnimationFrame(function(){
          $target.text(value.toFixed(0));
          isPending = false;
        });
        isPending = true;
      }
    },
    complete: function(){$target.text(to);}
  });
}
