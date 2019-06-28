'use strict';
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
var NUM_ADS = 8;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;
var MAP_HEIGHT = 630;
var MAP_PADDING = 130;

// Карта
var map = document.querySelector('.map');
var mapWidth = map.clientWidth;
var mapMainPin = document.querySelector('.map__pin--main');
var similarListElement = map.querySelector('.map__pins');
var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var isPageActive = false;

// Форма
var adForm = document.querySelector('.ad-form');
var fieldsetForm = document.querySelectorAll('fieldset');
var selectForm = document.querySelectorAll('select');
var selectTimeIn = document.querySelector('select[name=timein]');
var selectTimeOut = document.querySelector('select[name=timeout]');
var selectAccommodationType = adForm.querySelector('select[name=type]');
var inputAccommodationPrice = adForm.querySelector('input[name=price]');
var address = adForm.querySelector('#address');


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
        'type': ARR_ACCOMMODATION[getRandomArr(ARR_ACCOMMODATION)].type
      },
      'location': {
        'x': getRandomNum(0, mapWidth),
        'y': getRandomNum(MAP_PADDING, MAP_HEIGHT)
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
  if (!isPageActive) {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    formEnable(fieldsetForm);
    formEnable(selectForm);

    isPageActive = true;
    addingPins();
    getRenderAddress();
  }
};

// Значения поля адрес при неактивной странице
getRenderAddress();

// Синхронизация времени прибытия/выезда
var setTimeIn = function () {
  selectTimeOut.selectedIndex = selectTimeIn.selectedIndex;
};

var setTimeOut = function () {
  selectTimeIn.selectedIndex = selectTimeOut.selectedIndex;
};

// Изменение цены от выбранного жилья
var getChangePrice = function () {
  for (var i = 0; i < selectAccommodationType.length; i += 1) {
    if (ARR_ACCOMMODATION[i].type === selectAccommodationType.value) {
      inputAccommodationPrice.placeholder = ARR_ACCOMMODATION[i].minPrice;
      inputAccommodationPrice.min = ARR_ACCOMMODATION[i].minPrice;
    }
  }
};

mapMainPin.addEventListener('mousedown', function (evt) {
  activatePage();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mapMainPinY = (mapMainPin.offsetTop - shift.y);
    var mapMainPinX = (mapMainPin.offsetLeft - shift.x);

    if (mapMainPinY < MAP_PADDING - PIN_HEIGHT) {
      mapMainPinY = MAP_PADDING - PIN_HEIGHT;
    } else if (mapMainPinY > MAP_HEIGHT) {
      mapMainPinY = MAP_HEIGHT;
    }

    if (mapMainPinX < -MAIN_PIN_WIDTH / 2) {
      mapMainPinX = -MAIN_PIN_WIDTH / 2;
    } else if (mapMainPinX > (mapWidth - MAIN_PIN_WIDTH / 2)) {
      mapMainPinX = mapWidth - MAIN_PIN_WIDTH / 2;
    }

    mapMainPin.style.top = mapMainPinY + 'px';
    mapMainPin.style.left = mapMainPinX + 'px';

    getRenderAddress();
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    getRenderAddress();
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


selectAccommodationType.addEventListener('change', getChangePrice);
selectTimeOut.addEventListener('change', setTimeOut);
selectTimeIn.addEventListener('change', setTimeIn);
