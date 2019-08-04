'use strict';

(function () {

  var PIN_HEIGHT = 70;
  var MAIN_PIN_WIDTH = 62;

  // Карта
  var map = document.querySelector('.map');
  var mapWidth = map.clientWidth;
  var mainPin = document.querySelector('.map__pin--main');

  // Форма
  var form = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');

  var defaultPositionY = mainPin.style.top;
  var defaultPositionX = mainPin.style.left;

  var resetPosition = function () {
    mainPin.style.top = defaultPositionY;
    mainPin.style.left = defaultPositionX;
    setAddress();
  };


  var setAddress = function () {
    var addressInput = form.querySelector('#address');

    var mainPinPositionX = Math.floor(parseFloat(mainPin.style.left) + Math.round(MAIN_PIN_WIDTH / 2));
    var mainPinPositionY;
    var mainPinTop = parseFloat(mainPin.style.top);
    mainPinPositionY = parseFloat(mainPin.style.top) + PIN_HEIGHT;
    mainPinPositionY = mainPinTop + (window.util.isPageActive ? PIN_HEIGHT : (MAIN_PIN_WIDTH / 2));
    addressInput.value = mainPinPositionX + ', ' + mainPinPositionY;
  };

  // Функция активации страницы
  var activatePage = function () {
    if (!window.util.isPageActive) {
      map.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');

      for (var i = 0; i < form.children.length; i++) {
        form.children[i].disabled = false;
      }

      window.util.isPageActive = true;

      window.date.getList();
      setAddress();

      for (var j = 0; j < filterForm.children.length; j++) {
        filterForm.children[j].disabled = false;
      }
    }
  };

  setAddress();


  // Перемещение главной метки по карте
  mainPin.addEventListener('mousedown', function (evt) {
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

      var mainPinY = (mainPin.offsetTop - shift.y);
      var mainPinX = (mainPin.offsetLeft - shift.x);

      if (mainPinY < window.util.MAP_PADDING - PIN_HEIGHT) {
        mainPinY = window.util.MAP_PADDING - PIN_HEIGHT;
      } else if (mainPinY > window.util.MAP_HEIGHT) {
        mainPinY = window.util.MAP_HEIGHT;
      }

      if (mainPinX < -MAIN_PIN_WIDTH / 2) {
        mainPinX = -MAIN_PIN_WIDTH / 2;
      } else if (mainPinX > (mapWidth - MAIN_PIN_WIDTH / 2)) {
        mainPinX = mapWidth - MAIN_PIN_WIDTH / 2;
      }

      mainPin.style.top = mainPinY + 'px';
      mainPin.style.left = mainPinX + 'px';

      setAddress();
    };


    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      setAddress();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.mainPin = {
    resetPosition: resetPosition
  };
})();
