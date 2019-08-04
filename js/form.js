'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var MIN_PRICES_PER_NIGHT = [0, 1000, 5000, 10000];

  window.util.disableForm();

  // Связь полей формы Тип жилья и Цена за ночь
  var offerTypeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');

  var elementIndex = window.util.OFFER_TYPES.indexOf(offerTypeSelect.value);

  priceInput.min = MIN_PRICES_PER_NIGHT[elementIndex];
  priceInput.placeholder = MIN_PRICES_PER_NIGHT[elementIndex];

  offerTypeSelect.addEventListener('change', function () {
    elementIndex = window.util.OFFER_TYPES.indexOf(offerTypeSelect.value);

    if (elementIndex !== -1) {
      priceInput.min = MIN_PRICES_PER_NIGHT[elementIndex];
      priceInput.placeholder = MIN_PRICES_PER_NIGHT[elementIndex];
    }
  });

  // Связь полей формы Время заезда и выезда
  var timeInInput = form.querySelector('#timein');
  var timeOutInput = form.querySelector('#timeout');

  timeInInput.addEventListener('change', function () {
    timeOutInput.value = timeInInput.value;
  });
  timeOutInput.addEventListener('change', function () {
    timeInInput.value = timeOutInput.value;
  });

  // Связь полей формы Количество комнат и гостей
  var roomsSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');
  guestsSelect.value = '1';

  roomsSelect.addEventListener('change', function () {
    for (var j = 0; j < guestsSelect.children.length; j++) {
      guestsSelect.children[j].disabled = true;
    }

    if (roomsSelect.value === '1') {
      guestsSelect.querySelector('option[value="1"]').disabled = false;
    } else if (roomsSelect.value === '2') {
      guestsSelect.querySelector('option[value="1"]').disabled = false;
      guestsSelect.querySelector('option[value="2"]').disabled = false;
    } else if (roomsSelect.value === '3') {
      guestsSelect.querySelector('option[value="1"]').disabled = false;
      guestsSelect.querySelector('option[value="2"]').disabled = false;
      guestsSelect.querySelector('option[value="3"]').disabled = false;
    } else {
      guestsSelect.querySelector('option[value="0"]').disabled = false;
    }

    guestsSelect.value = roomsSelect.value !== '100' ? '1' : '0';
  });

  // Сбор значений полей формы
  var fields = form.querySelectorAll('input, textarea, select');
  var defaultValues = [];
  for (var i = 0; i < fields.length; i++) {
    defaultValues[i] = fields[i].value;
  }

  var previewAvatar = form.querySelector('.ad-form-header__preview img');
  var defaultAvatar = previewAvatar.src;

  // Загрузка изображений
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooser = form.querySelector('#avatar');
  var photosBlock = form.querySelector('.ad-form__photo-container');

  var showAvatarCallback = function (file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      previewAvatar.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var showPhotosCallback = function (file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {

      var previewPhoto = previewAvatar.cloneNode(true);
      var previewPhotoContainerCopy = previewPhotosContainer.cloneNode(true);
      previewPhotosContainer.style.display = 'none';
      previewPhotoContainerCopy.style.display = 'block';
      previewPhoto.src = reader.result;
      previewPhoto.alt = 'фотография объекта';
      previewPhoto.width = '70';
      previewPhoto.height = '70';
      previewPhoto.style.objectFit = 'cover';
      previewPhotoContainerCopy.appendChild(previewPhoto);
      photosBlock.appendChild(previewPhotoContainerCopy);
    });

    reader.readAsDataURL(file);
  };

  var showPreview = function (fileChooser, callback) {
    fileChooser.addEventListener('change', function () {
      resetPhotos();
      for (var j = 0; j < fileChooser.files.length; j++) {
        var file = fileChooser.files[j];
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          callback(file);
        }
      }
    });
  };

  showPreview(avatarChooser, showAvatarCallback);

  var photoChooser = form.querySelector('#images');
  var previewPhotosContainer = form.querySelector('.ad-form__photo');

  showPreview(photoChooser, showPhotosCallback);

  // Очистка загруженных фотографий жилья
  var resetPhotos = function () {
    var photoPreviews = photosBlock.querySelectorAll('.ad-form__photo');
    for (var l = 1; l < photoPreviews.length; l++) {
      photoPreviews[l].remove();
    }
    photoPreviews[0].style.display = 'block';
  };

  // Отправка формы
  var onSubmitSuccess = function () {
    var template = document.querySelector('#success').content.querySelector('.success');
    var successPopup = template.cloneNode(true);

    document.querySelector('main').appendChild(successPopup);
    successPopup = document.querySelector('main .success');

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_CODE) {
        successPopup.remove();
      }
    };

    successPopup.addEventListener('click', function () {
      successPopup.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    });
    document.addEventListener('keydown', onPopupEscPress);
    window.util.desactivatePage();
  };

  var onSubmitError = function () {
    var template = document.querySelector('#error').content.querySelector('.error');
    var errorPopup = template.cloneNode(true);

    document.querySelector('main').appendChild(errorPopup);
    errorPopup = document.querySelector('main .error');

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_CODE) {
        errorPopup.remove();
      }
    };
    var onErrorClick = function () {
      errorPopup.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    };


    errorPopup.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onPopupEscPress);
    errorPopup.querySelector('.error__button').addEventListener('click', onErrorClick);
  };

  form.onsubmit = function (evt) {
    evt.preventDefault();
    window.xhr.upload(new FormData(form), onSubmitSuccess, onSubmitError);
  };

  // Очистка полей формы
  var reset = function () {
    for (var j = 0; j < fields.length; j++) {
      fields[j].value = defaultValues[j];
    }

    var checkboxes = form.querySelectorAll('input[type="checkbox"]');
    for (var k = 0; k < checkboxes.length; k++) {
      checkboxes[k].checked = false;
    }


    elementIndex = window.util.OFFER_TYPES.indexOf(offerTypeSelect.value);
    priceInput.min = MIN_PRICES_PER_NIGHT[elementIndex];
    priceInput.placeholder = MIN_PRICES_PER_NIGHT[elementIndex];

    previewAvatar.src = defaultAvatar;

    resetPhotos();
  };

  var formReset = form.querySelector('.ad-form__reset');
  formReset.addEventListener('click', window.util.desactivatePage);

  window.form = {
    reset: reset
  };
})();
