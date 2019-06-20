'use strict';
var ARR_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var NUM_ADS = 8;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;

var map = document.querySelector('.map');
var mapMainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var fieldsetForm = document.querySelectorAll('fieldset');
var selectForm = document.querySelectorAll('select');
var address = adForm.querySelector('#address');
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

// Создание массива чисел от 1 до NUM_ADS с рандомным порядком
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
var shuffleArr = getShuffleArr(NUM_ADS);
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


// Добавляет элементы в DOM дерево
var addingPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < createAds(NUM_ADS).length; i++) {
    fragment.appendChild(renderPin(createAds(NUM_ADS)[i]));
  }
  similarListElement.appendChild(fragment);
};

var formDisabled = function (collection) {
  for (var i = 0; i < collection.length; i += 1) {
    collection[i].setAttribute('disabled', 'disabled');
  }
};

var formEnable = function (collection) {
  for (var i = 0; i < collection.length; i += 1) {
    collection[i].removeAttribute('disabled');
  }
};

formDisabled(fieldsetForm);
formDisabled(selectForm);

// Функция переводит строку в число
var getParseCoordinates = function (str) {
  return parseInt(str, 10);
};

// Функция вносит координаты указателя в input #address
var getRenderAddress = function () {
  address.value = (getParseCoordinates(mapMainPin.style.left) + MAIN_PIN_WIDTH / 2) + ',' + ' ' + (getParseCoordinates(mapMainPin.style.top) + MAIN_PIN_HEIGHT + 22);
};

// Функция активации страницы
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  formEnable(fieldsetForm);
  formEnable(selectForm);
  addingPins();
  getRenderAddress();
};


mapMainPin.addEventListener('click', activatePage);
