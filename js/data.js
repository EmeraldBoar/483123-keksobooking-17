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
  var lastTimeout;
  var filterPosters = function () {
    var filteredPosters = posters.slice();

    // Проверка по типу жилья
    var typeSelect = filterForm.querySelector('#housing-type');

    if (typeSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.type === typeSelect.value;
      });
    }

    // Проверка по стоимости аренды
    var priceSelect = filterForm.querySelector('#housing-price');

    if (priceSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        if (priceSelect.value === 'middle') {
          return poster.offer.price >= 10000 && poster.offer.price <= 50000;
        } else if (priceSelect.value === 'low') {
          return poster.offer.price < 10000;
        } else if (priceSelect.value === 'high') {
          return poster.offer.price > 50000;
        }
      });
    }

    // Проверка числа комнат
    var roomsSelect = filterForm.querySelector('#housing-rooms');
    if (roomsSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.rooms === parseInt(roomsSelect.value, 10);
      });
    }

    // Проверка числа гостей
    var guestsSelect = filterForm.querySelector('#housing-guests');
    if (guestsSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.guests === parseInt(guestsSelect.value, 10);
      });
    }

    // Проверка наличия удобств
    var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

    for (var i = 0; i < filterCheckboxes.length; i++) {
      if (filterCheckboxes[i].checked) {
        filteredPosters = filteredPosters.filter(function (poster) {
          return poster.offer.features.indexOf(filterCheckboxes[i].value) !== -1;
        });
      }
    }

    filteredPosters = filteredPosters.slice(0, PINS_TOTAL);
    hidePosterCard();


    // Debounce
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      addingPins(filteredPosters);
    }, 500);
  };

  var filterInputs = filterForm.querySelectorAll('.map__filter');
  var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', filterPosters);
  }

  for (var j = 0; j < filterCheckboxes.length; j++) {
    filterCheckboxes[j].addEventListener('change', filterPosters);
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
      for (var l = 0; l < featuresList.children.length; l++) {
        featuresList.children[l].style.display = 'none';
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

      for (var m = 0; m < photos.length; m++) {
        var offerPhoto = templatePhoto.cloneNode(true);
        offerPhoto.src = photos[m];
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
