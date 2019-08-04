'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var MIN_PRICES_PER_NIGHT = [0, 1000, 5000, 10000];

  window.util.disableForm();

  // связь полей формы Тип жилья и Цена за ночь
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

  // связь полей формы Время заезда и выезда
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

    if (roomsSelect.value !== '100') {
      guestsSelect.value = '1';
    } else {
      guestsSelect.value = '0';
    }
  });

  // сбор дефолтных значений полей формы
  var fields = form.querySelectorAll('input, textarea, select');
  var defaultValues = [];
  for (var i = 0; i < fields.length; i++) {
    defaultValues[i] = fields[i].value;
  }

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
    var removeErrorPopup = function () {
      errorPopup.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    };


    errorPopup.addEventListener('click', removeErrorPopup);
    document.addEventListener('keydown', onPopupEscPress);
    errorPopup.querySelector('.error__button').addEventListener('click', removeErrorPopup);
  };

  form.onsubmit = function (evt) {
    evt.preventDefault();
    window.load.upload(new FormData(form), onSubmitSuccess, onSubmitError);
  };

  // Очистка полей формы
  var resetForm = function () {
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
  };

  var formReset = form.querySelector('.ad-form__reset');
  formReset.addEventListener('click', window.util.desactivatePage);

  window.form = {
    resetForm: resetForm
  };
})();
