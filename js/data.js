'use strict';

(function () {

  var PINS_TOTAL = 5;
  var DEBOUNCE_INTERVAL = 500;
  var map = document.querySelector('.map');
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var OfferType = {
    'FLAT': 'Квартира',
    'BUNGALO': 'Бунгало',
    'HOUSE': 'Дом',
    'PALACE': 'Дворец'
  };


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

    window.util.removePins();

    similarPosters.forEach(function (similarPoster) {
      var posterCard = renderPin(similarPoster);
      addPinClickListener(posterCard, similarPoster);
      fragment.appendChild(posterCard);
    });
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
          return poster.offer.price >= LOW_PRICE && poster.offer.price <= HIGH_PRICE;
        } else if (priceSelect.value === 'low') {
          return poster.offer.price < LOW_PRICE;
        } else if (priceSelect.value === 'high') {
          return poster.offer.price > HIGH_PRICE;
        } else {
          return false;
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
    window.util.hidePosterCard();


    // Debounce
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      addingPins(filteredPosters);
    }, DEBOUNCE_INTERVAL);
  };

  var filterInputs = filterForm.querySelectorAll('.map__filter');
  var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', filterPosters);
  }

  for (var j = 0; j < filterCheckboxes.length; j++) {
    filterCheckboxes[j].addEventListener('change', filterPosters);
  }

  window.util.disableFilters();

  var loadPosters = function (similarPosters) {
    posters = similarPosters;
    filterPosters();
  };


  var getList = function () {

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

    window.xhr.load(LOAD_URL, loadPosters, onError);
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

    fillPosterCard('.popup__type', OfferType[similarPoster.offer.type]);

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
      similarPoster.offer.features.forEach(function (feature) {
        var featureClass = '.popup__feature--' + feature;
        featuresList.querySelector(featureClass).style.display = 'inline-block';
      });
    }

    fillPosterCard('.popup__description', similarPoster.offer.description);

    var photos = similarPoster.offer.photos;
    var photosBlock = posterCard.querySelector('.popup__photos');

    if (photos.length > 0) {
      var templatePhoto = posterCard.querySelector('.popup__photo');

      photosBlock.removeChild(templatePhoto);

      photos.forEach(function (photo) {
        var offerPhoto = templatePhoto.cloneNode(true);
        offerPhoto.src = photo;
        photosBlock.appendChild(offerPhoto);
      });
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
    cardClose.addEventListener('click', function () {
      window.util.hidePosterCard();
    });

    document.addEventListener('keydown', window.util.onPopupEscPress);
  };

  // При клике на пин показывает карточку объявления
  var addPinClickListener = function (pin, poster) {
    pin.addEventListener('click', function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var k = 0; k < pins.length; k++) {
        pins[k].classList.remove('map__pin--active');
      }

      pin.classList.add('map__pin--active');
      window.util.hidePosterCard();
      renderPosterCard(poster);
    });
  };

  window.date = {
    getList: getList
  };
})();
