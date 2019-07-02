'use strict';

(function () {

  // Создает массив от 0 до num и перемешивает его
  var getShuffleArr = function (num) {
    var arr = [];
    for (var i = 0; i < num; i += 1) {
      arr[i] = i + 1;
    }

    var count = arr.length;
    var j = 0;
    var temp = 0;

    while (count--) {
      j = Math.floor(Math.random() * count);
      temp = arr[count];
      arr[count] = arr[j];
      arr[j] = temp;
    }
    return arr;
  };


  // Функция создает массив с объектами
  var map = document.querySelector('.map');
  var mapWidth = map.clientWidth;
  var shuffleArr = getShuffleArr(window.util.NUM_ADS);
  var createAds = function (num) {
    var similarAds = [];
    for (var i = 0; i < num; i += 1) {
      similarAds[i] = {
        'author': {
          'avatar': 'img/avatars/user0' + shuffleArr[i] + '.png'
        },
        'offer': {
          'type': window.util.ARR_ACCOMMODATION[window.util.getRandomArr(window.util.ARR_ACCOMMODATION)].type
        },
        'location': {
          'x': window.util.getRandomNum(0, mapWidth),
          'y': window.util.getRandomNum(window.util.MAP_PADDING, window.util.MAP_HEIGHT)
        }
      };
    }
    return similarAds;
  };


  // Отрисовка указателей
  var similarListElement = map.querySelector('.map__pins');
  var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (pin) {
    var pinElement = similarPinsTemplate.cloneNode(true);
    pinElement.style.cssText = 'left: ' + (pin.location.x - 50 / 2) + 'px; top: ' + (pin.location.y - 70) + 'px;';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.type;
    return pinElement;
  };


  // Добавляет элементы в DOM дерево
  window.addingPins = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < createAds(window.util.NUM_ADS).length; i++) {
      fragment.appendChild(renderPin(createAds(window.util.NUM_ADS)[i]));
    }
    similarListElement.appendChild(fragment);
  };
})();
