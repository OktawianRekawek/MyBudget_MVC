
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
        category = `<button type="button" class="btn btn-primary income-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="income" data-id="${categoryId}" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Cel: ${categoryLimitAmount} zł`;
        category += `</button>`;
        $('#incomes-categories').append(category);
        
      });

      var addCategoryBtn = `<button type="button" class="btn btn-success row mx-auto col-sm-12 my-1 rounded justify-content-between addCatModalBtn" data-category="income">Dodaj kategorię</button>`;
      $('#incomes-categories').append(addCategoryBtn);
    }
  });
}

var getExpensesCategories = function () {
  $.ajax({
    url: "/Profile/getExpensesCategories",
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
        category = `<button type="button" class="btn btn-primary expense-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="expense" data-id="${categoryId}" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Limit: ${categoryLimitAmount} zł`;
        category += `</button>`;
        $('#expenses-categories').append(category);
        
      });

      var addCategoryBtn = `<button type="button" class="btn btn-success row mx-auto col-sm-12 my-1 rounded justify-content-between addCatModalBtn" data-category="expense">Dodaj kategorię</button>`;
      $('#expenses-categories').append(addCategoryBtn);
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

  if ($(property).data('category') == 'income')
    $('.form-check-label').html('Ustal cel');
  else if ($(property).data('category') == 'expense')
    $('.form-check-label').html('Ustal limit'); 

  if (categoryLimited)
  {
    $('#limitCheck').prop('checked', true);
    $("#limitAmount").removeAttr("disabled");
  } else {
    $('#limitCheck').prop('checked', false);
    $("#limitAmount").attr("disabled", "disabled");
  }
  $("#modalLabel").html("Ustawienia kategorii");

  $("#settingsModal").modal('show').data('category', $(property).data('category'));
}

var showAddCategoryModal = function(property) {
  if ($(property).data('category') == 'income')
    $('.form-check-label').html('Ustal cel');
  else if ($(property).data('category') == 'expense')
    $('.form-check-label').html('Ustal limit'); 

    $("#modalLabel").html("Dodaj kategorię");
    $('#categoryName').val("");
    $('#limitAmount').val("");
    $("#limitAmount").attr("disabled", "disabled");
    $('#limitCheck').prop('checked', false);
    $('#categoryId').val(null);

    $("#settingsModal").modal('show').data('category', $(property).data('category'));
}

var saveSettings = function () {
  var categoryName = $('#categoryName').val();
  if (categoryName === "") {
    $('#categoryName').addClass("err-amount");
    return;
  } else
    $('#categoryName').removeClass('err-amount');
  var categoryLimitAmount = $('#limitAmount').val();
  var categoryLimited = $('#limitCheck').is(":checked")?1:0;
  var categoryId = $('#categoryId').val();
  var categoryType = $('#settingsModal').data('category');
  if (categoryType == 'income')
    var text = 'Cel';
  else 
    var text = 'Limit';
  $.ajax({
    url: "/Profile/saveCategorySettings",
    type: "POST",
    dataType: "json",
    data: {
      category: categoryType,
      id: categoryId,
      name: categoryName,
      amount: categoryLimitAmount,
      limited: categoryLimited
    },
    complete: function (result) {
      if (categoryId) {
        var element = $('.chosen');
        if (categoryLimited)
          element.html(`${categoryName}<br>${text}: ${categoryLimitAmount} zł`);
        else
          element.html(`${categoryName}`);
        element.data('name', categoryName).data('amount', categoryLimitAmount).data('limit', categoryLimited);
      } else {
        categoryId = result.responseJSON[0];
        category = `<button type="button" class="btn btn-primary ${categoryType}-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="${categoryType}" data-id="${categoryId}" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Cel: ${categoryLimitAmount} zł`;
        category += `</button>`;
        $(`.addCatModalBtn:visible`).before(category);
      }

        $("#settingsModal").modal('hide');
      }
  });
}

$(document).ready(function () {

  getIncomesCategories();
  getExpensesCategories();

  $("#incomes-category-toggle").click(function () {
    slideItem("#incomes-categories");
    if ($('#expenses-categories').css('display') == 'block')
      slideItem("#expenses-categories");
  });

  $("#expenses-category-toggle").click(function () {
    slideItem("#expenses-categories");
    if ($('#incomes-categories').css('display') == 'block')
      slideItem("#incomes-categories");
  });

  $(".categories-list").on('click', "#settingsModalBtn", function () {
    changeCategorySettings(this);
    $(this).addClass("chosen");
  });

  $(".categories-list").on('click', '.addCatModalBtn', function() {
    showAddCategoryModal(this);
  });

  $('#limitCheck').click(function () {
    if($(this).is(":checked")) {
      $("#limitAmount").removeAttr("disabled");
      $("#limitAmount").focus();
    } else {
      $("#limitAmount").attr("disabled", "disabled");
    }
  });

  $("#settingsModal").on('click', "#saveSettings", function () {
    saveSettings();
  });

  $("#settingsModal").on('hidden.bs.modal', function () {
    $('.chosen').removeClass('chosen');
  });

});
