'use strict';

(function () {

  var ARR_ACCOMMODATION = [
    {
      type: 'bungalo',
      minPrice: '0'
    },
    {
      type: 'flat',
      minPrice: '1000'
    },
    {
      type: 'house',
      minPrice: '5000'
    },
    {
      type: 'palace',
      minPrice: '10000'
    }
  ];

  var MAP_HEIGHT = 630;
  var MAP_PADDING = 130;
  var NUM_ADS = 8;


  window.util = {
    ARR_ACCOMMODATION: ARR_ACCOMMODATION,
    MAP_HEIGHT: MAP_HEIGHT,
    MAP_PADDING: MAP_PADDING,
    NUM_ADS: NUM_ADS,

    getRandomArr: function (arr) {
      return Math.floor(Math.random() * arr.length);
    },

    getRandomNum: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    getParseCoordinates: function (str) {
      return parseInt(str, 10);
    }
  };
})();
