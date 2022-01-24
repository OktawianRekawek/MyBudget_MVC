
var slideItem = function (itemName) {
  $(itemName).slideToggle(500);
}

var getIncomesCategories = function () {
  $.ajax({
    url: "/Profile/getIncomesCategories",
    type: "POST",
    dataType: 'json',
    success: function (response) {
      var categories = response;
      var category;
      var categoryName;
      var categoryLimited;
      var categoryLimitAmount;
      
      categories.forEach(function (item, index) {
        categoryName = item.name;
        categoryLimited = item.limited;
        categoryLimitAmount = item.amount;
        categoryId = item.id;
        category = `<button type="button" class="btn btn-primary income-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="incomeSettingsModalBtn" data-id="${categoryId}" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Cel: ${categoryLimitAmount} zł`;
        category += `</button>`;
        $('#incomes-categories').append(category);
        
      });
    }
  });
}

var changeCategorySettings = function (property) {
  var categoryName = $(property).data('name') ;
  var categoryLimitAmount = $(property).data('amount') ;
  var categoryLimited = $(property).data('limit') ;
  var categoryId = $(property).data('id') ;
  $('#categoryName').val(categoryName);
  $('#limitAmount').val(categoryLimitAmount);
  $('#categoryId').val( categoryId);
  if (categoryLimited)
  {
    $('#limitCheck').prop('checked', true);
    $("#limitAmount").removeAttr("disabled");
  } else {
    $('#limitCheck').prop('checked', false);
    $("#limitAmount").attr("disabled", "disabled");
  }

  $("#incomeSettingsModal").modal('show');
}

var saveSettings = function () {
  var categoryName = $('#categoryName').val();
  var categoryLimitAmount = $('#limitAmount').val();
  var categoryLimited = $('#limitCheck').is(":checked")?1:0;
  var categoryId = $('#categoryId').val() ;
  $.ajax({
    url: "/Profile/saveIncomeCategorySettings",
    type: "POST",
    dataType: "json",
    data: {
      id: categoryId,
      name: categoryName,
      amount: categoryLimitAmount,
      limited: categoryLimited
    },
    complete: function () {
        var element = $('.chosen');
        if (categoryLimited)
          element.html(`${categoryName}<br>Cel: ${categoryLimitAmount} zł`);
        else
          element.html(`${categoryName}`);
        element.data('name', categoryName).data('amount', categoryLimitAmount).data('limit', categoryLimited);
      }
  });
}

$(document).ready(function () {

  getIncomesCategories();

  $("#incomes-category-toggle").click(function () {
    slideItem(".incomes-categories");
  });

  $("#incomes-categories").on('click', "#incomeSettingsModalBtn", function () {
    changeCategorySettings(this);
    $(this).addClass("chosen");
  });

  $('#limitCheck').click(function () {
    if($(this).is(":checked")) {
      $("#limitAmount").removeAttr("disabled");
      $("#limitAmount").focus();
    } else {
      $("#limitAmount").attr("disabled", "disabled");
    }
  });

  $("#incomeSettingsModal").on('click', "#saveSettings", function () {
    saveSettings();
    $("#incomeSettingsModal").modal('hide');
  });

  $("#incomeSettingsModal").on('hidden.bs.modal', function () {
    $('.chosen').removeClass('chosen');
  });

});
