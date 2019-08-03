'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var selectTimeIn = document.querySelector('select[name=timein]');
  var selectTimeOut = document.querySelector('select[name=timeout]');
  var selectAccommodationType = adForm.querySelector('select[name=type]');
  var inputAccommodationPrice = adForm.querySelector('input[name=price]');


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
      if (window.util.ARR_ACCOMMODATION[i].type === selectAccommodationType.value) {
        inputAccommodationPrice.placeholder = window.util.ARR_ACCOMMODATION[i].minPrice;
        inputAccommodationPrice.min = window.util.ARR_ACCOMMODATION[i].minPrice;
      }
    }
  };

  // Связь полей формы Количество комнат и гостей
  var roomsSelect = adForm.querySelector('#room_number');
  var guestsSelect = adForm.querySelector('#capacity');
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

  selectAccommodationType.addEventListener('change', getChangePrice);
  selectTimeOut.addEventListener('change', setTimeOut);
  selectTimeIn.addEventListener('change', setTimeIn);
})();
