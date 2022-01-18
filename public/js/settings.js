
var slideItem = function (itemName) {
  $(itemName).slideToggle(500);
}

var getIncomesCategories = function () {
  $.ajax({
    url: "/Profile/showIncomesCategories",
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
        category = `<button type="button" class="btn btn-primary income-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="categorySettingsModalBtn" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited)
          category += `<br>Cel: ${categoryLimitAmount} zł`;
        category += `</button>`;
        $('#incomes-categories').append(category);
        
      });
    }
  });
}

var changeCategorySettins = function {
  var categoryName = $(this).data('name') ;
  var categoryLimitAmount = $(this).data('amount') ;
  var categoryLimited = $(this).data('limit') ;
  $('#categoryName').val(categoryName);
  $('#limitAmount').val(categoryLimitAmount);
  if (categoryLimited)
  {
    $('#limitCheck').prop('checked', true);
    $("#limitAmount").removeAttr("disabled");
  } else {
    $('#limitCheck').prop('checked', false);
    $("#limitAmount").attr("disabled", "disabled");
  }

  $("#categorySettingsModal").modal('show');
}

$(document).ready(function () {

  getIncomesCategories();

  $("#incomes-category-toggle").click(function () {
    slideItem(".incomes-categories");
  });

  $("#incomes-categories").on('click', "#categorySettingsModalBtn", function () {
    changeCategorySettins();
  });

  $('#limitCheck').click(function () {
    if($(this).is(":checked")) {
      $("#limitAmount").removeAttr("disabled");
      $("#limitAmount").focus();
    } else {
      $("#limitAmount").attr("disabled", "disabled");
    }
  });

});
