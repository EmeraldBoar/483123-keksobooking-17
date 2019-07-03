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

  selectAccommodationType.addEventListener('change', getChangePrice);
  selectTimeOut.addEventListener('change', setTimeOut);
  selectTimeIn.addEventListener('change', setTimeIn);
})();
