'use strict';

(function () {

  var map = document.querySelector('.map');

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
  var addingPins = function (similarPosters) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < similarPosters.length; i += 1) {
      var similarPoster = similarPosters[i];
      var posterCard = renderPin(similarPoster);
      fragment.appendChild(posterCard);
    }
    similarListElement.appendChild(fragment);
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

    window.load('https://js.dump.academy/keksobooking/data', addingPins, onError);
  };

  window.date = {
    getSimilarPosters: getSimilarPosters
  };
})();
