var $ = require('expose?jQuery!../../vendor/bower_components/jquery/dist/jquery'),
    constants = require('../../config/constants');

require('../../vendor/javascripts/bootstrap');

$.getJSON(constants.API_ENDPOINT, {}, function(data){
  $('.js-total-points').text(data.total_points);
  $('.js-total-users').text(data.total_users);
});