'use strict';
var ARR_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var numAds = 8;

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var similarListElement = map.querySelector('.map__pins');
var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Рандомное число от 0 до длины массива
var getRandomArr = function (arr) {
  return Math.floor(Math.random() * arr.length);
};

// Рандомное число от min до max
var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// Создание массива чисел от 1 до numAds с рандомным порядком
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
var shuffleArr = getShuffleArr(numAds);
var createAds = function (num) {
  var similarAds = [];
  for (var i = 0; i < num; i += 1) {
    similarAds[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + shuffleArr[i] + '.png'
      },
      'offer': {
        'type': ARR_TYPE[getRandomArr(ARR_TYPE)]
      },
      'location': {
        'x': getRandomNum(0, 1200),
        'y': getRandomNum(130, 630)
      }
    };
  }
  return similarAds;
};

// Отрисовка указателей
var renderPin = function (pin) {
  var pinElement = similarPinsTemplate.cloneNode(true);
  pinElement.style.cssText = 'left: ' + (pin.location.x - 50 / 2) + 'px; top: ' + (pin.location.y - 70) + 'px;';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.type;
  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < createAds(numAds).length; i++) {
  fragment.appendChild(renderPin(createAds(numAds)[i]));
}

similarListElement.appendChild(fragment);
