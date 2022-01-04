
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
      var categoryLimit;

      categories.forEach(function (item, index) {
        categoryName = item.name;
        categoryLimit = item.amount;

        if (categoryLimit > 0)
          category = `<div class="btn btn-primary income-category row mx-auto col-sm-12 my-1 rounded justify-content-between">${categoryName}<br>Cel: ${categoryLimit} zł</div>`;
        else
          category = `<div class="btn btn-primary income-category row mx-auto col-sm-12 my-1 rounded justify-content-between">${categoryName}</div>`;
        $('#incomes-categories').append(category);
      });
    }
  });
}

$(document).ready(function () {

  getIncomesCategories();

  $("#incomes-category-toggle").click(function () {
    slideItem(".incomes-categories");
  });
});
