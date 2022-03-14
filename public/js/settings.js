
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

var getPaymentMethodsCategories = function () {
  $.ajax({
    url: "/Profile/getPaymentMethodsCategories",
    type: "POST",
    dataType: 'json',
    success: function (response) {
      var categories = response;
      var category;
      var categoryName;
      
      categories.forEach(function (item, index) {
        categoryName = item.name;
        categoryId = item.id;
        category = `<button type="button" class="btn btn-primary payment-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="payment" data-id="${categoryId}" data-name="${categoryName}">${categoryName}`;
        category += `</button>`;
        $('#payment-categories').append(category);
        
      });

      var addCategoryBtn = `<button type="button" class="btn btn-success row mx-auto col-sm-12 my-1 rounded justify-content-between addCatModalBtn" data-category="payment">Dodaj kategorię</button>`;
      $('#payment-categories').append(addCategoryBtn);
    }
  });
}

var changeCategorySettings = function (property) {
  var categoryName = $(property).data('name');
  var categoryId = $(property).data('id');

  $('#categoryName').val(categoryName);
  $('#categoryId').val( categoryId);

  if ($(property).data('category') != 'payment') {
    var categoryLimitAmount = $(property).data('amount');
    var categoryLimited = $(property).data('limit');
    
    $('#limitAmount').val(categoryLimitAmount);
  
    $('.category-amount').removeClass("hidden");

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
  } else {
    $('.category-amount').addClass("hidden");
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
    $('#categoryId').val(null);
  if ($(property).data('category') != 'payment') {
    $('.category-amount').removeClass("hidden");
    $('#limitAmount').val("");
    $("#limitAmount").attr("disabled", "disabled");
    $('#limitCheck').prop('checked', false);
  } else {
    $('.category-amount').addClass("hidden");
  }
    
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
        element.data('name', categoryName);
        if (categoryType != 'payment')
          element.data('amount', categoryLimitAmount).data('limit', categoryLimited);
      } else {
        categoryId = result.responseJSON[0];
        category = `<button type="button" class="btn btn-primary ${categoryType}-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="${categoryType}" data-id="${categoryId}" data-name="${categoryName}"`;
        if (categoryType != 'payment') {
          category += ` data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}"`;
        }
        category += `>${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Cel: ${categoryLimitAmount} zł`;
        category += `</button>`;
        $(`.addCatModalBtn:visible`).before(category);
      }

        $("#settingsModal").modal('hide');
      }
  });
}

var chooseSettingsCategory = function () {

  $("#incomes-category-toggle").click(function () {
    slideItem("#incomes-categories");
    if ($('#expenses-categories').css('display') == 'block')
      slideItem("#expenses-categories");
    if ($('#payment-categories').css('display') == 'block')
      slideItem("#payment-categories");
    if ($('#user-settings').css('display') == 'block')
        slideItem("#user-settings");
  });

  $("#expenses-category-toggle").click(function () {
    slideItem("#expenses-categories");
    if ($('#incomes-categories').css('display') == 'block')
      slideItem("#incomes-categories");
    if ($('#payment-categories').css('display') == 'block')
      slideItem("#payment-categories");
    if ($('#user-settings').css('display') == 'block')
        slideItem("#user-settings");
  });

  $("#payment-category-toggle").click(function () {
    slideItem("#payment-categories");
    if ($('#expenses-categories').css('display') == 'block')
      slideItem("#expenses-categories");
    if ($('#incomes-categories').css('display') == 'block')
      slideItem("#incomes-categories");
    if ($('#user-settings').css('display') == 'block')
      slideItem("#user-settings");
  });

  $("#user-settings-toggle").click(function () {
    slideItem("#user-settings");
    if ($('#expenses-categories').css('display') == 'block')
      slideItem("#expenses-categories");
    if ($('#incomes-categories').css('display') == 'block')
      slideItem("#incomes-categories");
    if ($('#payment-categories').css('display') == 'block')
      slideItem("#payment-categories");
  });
}

var showUserEditModal = function () {
  $('#login-input').val($('#login').html());
  $('#email-input').val($('#email').html());
  $('#login-form').removeClass("hidden");
  $('#email-form').removeClass("hidden");
  $('#password-form').addClass("hidden");
  $("#userSettingsModal").modal('show');
}

var showChangePasswordModal = function () {
  $('#login-form').addClass("hidden");
  $('#email-form').addClass("hidden");
  $('#password-form').removeClass("hidden");
  $("#userSettingsModal").modal('show');
}

var saveUserSettings = function () {
  if ($('#login-form').hasClass('hidden')) {
    $.ajax({
      url: "/Profile/changeUserSettings",
      type: "POST",
      dataType: "json",
      data: {
        password: $('#password-input').val()
      },
      complete: function (result) {
          retCode = result.responseJSON;
          switch (retCode)
          {
            case 0:
              $('#err-message').html("");
              $("#userSettingsModal").modal('hide');
              break;
            case 1:
              $('#err-message').html("Hasło musi zawierać conajmniej 6 znaków!");
              break;
            case 2:
              $('#err-message').html("Hasło musi zawierać conajmniej jedną literę!");
              break;
            case 3:
              $('#err-message').html("Hasło musi zawierać conajmniej jedną cyfrę!");
              break;
          }
        }
    });
  } else {
    $.ajax({
      url: "/Profile/changeUserSettings",
      type: "POST",
      dataType: "json",
      data: {
        name: $('#login-input').val(),
        email: $('#email-input').val()
      },
      complete: function (result) {
          retCode = result.responseJSON;
          switch (retCode)
          {
            case 0:
              $('#err-message').html("");
              $('#login').html($('#login-input').val());
              $('#email').html($('#email-input').val());
              $("#userSettingsModal").modal('hide');
              break;
            case 1:
              $('#err-message').html("Nazwa nie może być pusta!");
              break;
            case 2:
              $('#err-message').html("Proszę wpisać poprawny adres email!");
              break;
            case 3:
              $('#err-message').html("Nie wprowadzono żadnych zmian!");
              break;
            case 4:
              $('#err-message').html("Podany adres email jest już używany!");
              break;
          }
        }
    });
  }
}

$(document).ready(function () {

  getIncomesCategories();
  getExpensesCategories();
  getPaymentMethodsCategories();

  chooseSettingsCategory();

  $(".categories-list").on('click', "#settingsModalBtn", function () {
    changeCategorySettings(this);
    $(this).addClass("chosen");
  });

  $(".categories-list").on('click', '.addCatModalBtn', function() {
    showAddCategoryModal(this);
  });

  $("#user-settings").on('click', '#userEdit', function() {
    showUserEditModal();
  });

  $("#user-settings").on('click', '#changePassword', function() {
    showChangePasswordModal();
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

  $("#userSettingsModal").on('click', "#saveUserSettings", function () {
    saveUserSettings();
  });

  $("#settingsModal").on('hidden.bs.modal', function () {
    $('.chosen').removeClass('chosen');
  });

  $("#settingsModal").on('shown.bs.modal', function () {
    $('#categoryName').focus();
  });
  
  

});
