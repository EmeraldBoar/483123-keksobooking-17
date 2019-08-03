/* eslint-disable no-invalid-this */
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
      onMapPinClick(posterCard, similarPoster);
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
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.type === typeSelect.value;
      });
    }
    filteredPosters = filteredPosters.slice(0, PINS_TOTAL);
    hidePosterCard();
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

  // Создание DOM - элемента карточки похожего объявления
  var createPosterCard = function (similarPoster) {
    var template = document.querySelector('#card').content.querySelector('.map__card');
    var posterCard = template.cloneNode(true);

    var fillPosterCard = function (tag, data) {
      var elem = posterCard.querySelector(tag);
      if (elem) {
        if (!data) {
          elem.style.display = 'none';
        } else {
          elem.textContent = data;
        }
      }
    };

    fillPosterCard('.popup__title', similarPoster.offer.title);

    fillPosterCard('.popup__text--address', similarPoster.offer.address);

    var priceField = posterCard.querySelector('.popup__text--price');
    priceField.firstChild.nodeValue = similarPoster.offer.price + '₽';

    var offerType = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };

    fillPosterCard('.popup__type', offerType[similarPoster.offer.type]);

    if (!similarPoster.offer.rooms || !similarPoster.offer.guests) {
      posterCard.querySelector('.popup__text--capacity').style.display = 'none';
    } else {
      fillPosterCard('.popup__text--capacity', similarPoster.offer.rooms + ' комнаты для ' + similarPoster.offer.guests + ' гостей');
    }

    fillPosterCard('.popup__text--time', 'Заезд после ' + similarPoster.offer.checkin + ', выезд до ' + similarPoster.offer.checkout);

    var featuresList = posterCard.querySelector('.popup__features');
    if (similarPoster.offer.features.length === 0) {
      featuresList.style.display = 'none';
    } else {
      for (var j = 0; j < featuresList.children.length; j++) {
        featuresList.children[j].style.display = 'none';
      }
      for (var k = 0; k < similarPoster.offer.features.length; k++) {
        var featureClass = '.popup__feature--' + similarPoster.offer.features[k];
        featuresList.querySelector(featureClass).style.display = 'inline-block';
      }
    }

    fillPosterCard('.popup__description', similarPoster.offer.description);

    var photos = similarPoster.offer.photos;
    var photosBlock = posterCard.querySelector('.popup__photos');

    if (photos.length > 0) {
      var templatePhoto = posterCard.querySelector('.popup__photo');

      photosBlock.removeChild(templatePhoto);

      for (var l = 0; l < photos.length; l++) {
        var offerPhoto = templatePhoto.cloneNode(true);
        offerPhoto.src = photos[l];
        photosBlock.appendChild(offerPhoto);
      }
    } else {
      photosBlock.style.display = 'none';
    }

    posterCard.querySelector('.popup__avatar').src = similarPoster.author.avatar;

    return posterCard;
  };

  // Отрисовка карточки похожего объявления

  var renderPosterCard = function (similarPoster) {
    var mapFilters = map.querySelector('.map__filters-container');
    var fragment = document.createDocumentFragment();
    var posterCard = createPosterCard(similarPoster);

    fragment.appendChild(posterCard);
    map.insertBefore(fragment, mapFilters);

    var cardClose = document.querySelector('.map__card .popup__close');
    cardClose.addEventListener('click', hidePosterCard);

    document.addEventListener('keydown', onPopupEscPress);
  };

  // При клике на пин показывает карточку объявления
  var onMapPinClick = function (pin, poster) {
    pin.addEventListener('click', function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var k = 0; k < pins.length; k++) {
        pins[k].classList.remove('map__pin--active');
      }

      this.classList.add('map__pin--active');
      hidePosterCard();
      renderPosterCard(poster);
    });
  };

  // Удаление карточки
  var hidePosterCard = function () {
    var posterCard = map.querySelector('.map__card');

    if (posterCard) {
      map.removeChild(posterCard);
    }

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === 27) {
      hidePosterCard();
    }
  };

  window.date = {
    getSimilarPosters: getSimilarPosters
  };
})();
