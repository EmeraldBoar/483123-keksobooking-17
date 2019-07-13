'use strict';

(function () {

  var PIN_HEIGHT = 70;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;


  // Карта
  var map = document.querySelector('.map');
  var mapWidth = map.clientWidth;
  var mapMainPin = document.querySelector('.map__pin--main');
  var isPageActive = false;

  // Форма
  var adForm = document.querySelector('.ad-form');
  var fieldsetForm = document.querySelectorAll('fieldset');
  var selectForm = document.querySelectorAll('select');
  var address = adForm.querySelector('#address');


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


  // Функция вносит координаты указателя в input #address
  var getRenderAddress = function () {
    address.value = (window.util.getParseCoordinates(mapMainPin.style.left) + MAIN_PIN_WIDTH / 2) + ',' + ' ' + (window.util.getParseCoordinates(mapMainPin.style.top) + MAIN_PIN_HEIGHT + 22);
  };


  // Значения поля адрес при неактивной странице
  getRenderAddress();


  // Функция активации страницы
  var activatePage = function () {
    if (!isPageActive) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      formEnable(fieldsetForm);
      formEnable(selectForm);
      isPageActive = true;
      window.date.getSimilarPosters();
      getRenderAddress();
    }
  };


  // Перемещение главной метки по карте
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

      if (mapMainPinY < window.util.MAP_PADDING - PIN_HEIGHT) {
        mapMainPinY = window.util.MAP_PADDING - PIN_HEIGHT;
      } else if (mapMainPinY > window.util.MAP_HEIGHT) {
        mapMainPinY = window.util.MAP_HEIGHT;
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
})();
