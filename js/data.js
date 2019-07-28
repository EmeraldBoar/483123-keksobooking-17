'use strict';

(function () {

  var PINS_TOTAL = 5;
  var map = document.querySelector('.map');


  // Отрисовка указателей
  var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (pin) {
    var pinElement = similarPinsTemplate.cloneNode(true);
    pinElement.style.cssText = 'left: ' + (pin.location.x - 50 / 2) + 'px; top: ' + (pin.location.y - 70) + 'px;';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.type;
    return pinElement;
  };


  // Добавляет элементы в DOM дерево
  var addingPins = function (similarPosters) {
    var similarListElement = map.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    var renderedPins = similarListElement.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < renderedPins.length; i++) {
      similarListElement.removeChild(renderedPins[i]);
    }

    for (var j = 0; j < similarPosters.length; j += 1) {
      var similarPoster = similarPosters[j];
      var posterCard = renderPin(similarPoster);
      fragment.appendChild(posterCard);
    }
    similarListElement.appendChild(fragment);
  };


  var filterForm = document.querySelector('.map__filters');
  var posters = [];

  var filterPosters = function () {
    var filteredPosters = posters.slice();
    var typeSelect = filterForm.querySelector('#housing-type');

    if (typeSelect.value !== 'any') {
      filteredPosters = filteredPosters
        .filter(function (poster) {
          return poster.offer.type === typeSelect.value;
        });
    }
    filteredPosters = filteredPosters.slice(0, PINS_TOTAL);
    addingPins(filteredPosters);
  };

  var filterInputs = filterForm.querySelectorAll('select');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', filterPosters);
  }

  var loadPosters = function (similarPosters) {
    posters = similarPosters;
    filterPosters();
  };


  var getSimilarPosters = function () {

    var onError = function () {
      var template = document.querySelector('#error').content.querySelector('.error');
      var errorMessage = template.cloneNode(true);

      var errorText = errorMessage.querySelector('.error__message');
      errorText.textContent = 'Ошибка загрузки похожих объявлений';

      var main = document.querySelector('main');
      main.appendChild(errorMessage);
      var errorClose = errorMessage.querySelector('.error__button');
      errorClose.textContent = 'Закрыть';
      errorClose.addEventListener('click', function () {
        main.removeChild(errorMessage);
      });
    };

    window.load('https://js.dump.academy/keksobooking/data', loadPosters, onError);
  };

  window.date = {
    getSimilarPosters: getSimilarPosters
  };
})();
