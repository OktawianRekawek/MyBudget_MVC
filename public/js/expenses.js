var currentDate = new Date();

var expenses = new Array();

var firstDayOfMonth = makeDate(currentDate.getFullYear(), currentDate.getMonth(), 1);
var lastDayOfMonth = makeDate(currentDate.getFullYear(), currentDate.getMonth()+1, 0);

function makeDate(year, month, day) {
  return new Date(year, month, day);
}



function formatDate(year, month, day) {
  if (month < 10)
    month = '0' + month;
  if (day < 10)
    day = '0' + day;
  
  stringDate = year + "-" + month + "-" + day;
  return stringDate;
}

function getExpenses () {


  $.ajax({
    url: "/Profile/getExpenses",
    type: "POST",
    dataType: 'json',
    data: {
      startDate: formatDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth()+1, 1),
      endDate: formatDate(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth()+1, lastDayOfMonth.getDate())
    },
    success: function (response) {
      response.forEach(element => {
        expenses.push(element);
      });
    },
    async: false
  });

}

function getSpendAmount(categoryName) {
  
  var amount;
  expenses.forEach(element => {
    if (categoryName == element.name)
    {
      amount = element.amountSum;
    }
  });
  return amount;
}

function initSummary() {

  $(".check-limit").html("");

  if ($(".category-option:selected").data("limited")){

    var limit = parseFloat($(".category-option:selected").data("limit"));
    var category = $("#category option:selected").val();
    var spend = parseFloat(getSpendAmount(category));
    if (isNaN(spend)) {
      spend = 0;
    }
    var stayed = limit - spend;

    var divLimit = `<div class="col-3"><p class="font-weight-bold mb-0">Limit:</p><p class="mb-0">${limit}zł</p></div>`;
    var divSpend = `<div class="col-3"><p class="font-weight-bold mb-0">Wydano:</p><p class="mb-0">${spend.toFixed(2)}zł</p></div>`;
    var divStayed = `<div class="col-3"><p class="font-weight-bold mb-0">Zostało:</p><p class="mb-0">${stayed.toFixed(2)}zł</p></div>`;
    var divSum = `<div class="col-3"><p class="font-weight-bold mb-0">Suma:</p><p class="mb-0" id="summary">${spend.toFixed(2)}zł</p></div>`;
    if (stayed <= 0)
      $(".check-limit").removeClass("bg-success").addClass("bg-danger");
    else
      $(".check-limit").removeClass("bg-danger").addClass("bg-success");
    $(".check-limit").append(divLimit).append(divSpend).append(divStayed).append(divSum);

    $("#amount").change(function() {
      var sum = spend+parseFloat($("#amount").val());
      console.log(sum);
      console.log(limit);
      $("#summary").html(`${sum.toFixed(2)}zł`);
      if (sum > limit)
        $(".check-limit").removeClass("bg-success").addClass("bg-danger");
      else
        $(".check-limit").removeClass("bg-danger").addClass("bg-success");
    });
  }
}

$(document).ready(function () {

  getExpenses();
  initSummary();

  $("#category").change(function() {
    initSummary();
  });
  

});