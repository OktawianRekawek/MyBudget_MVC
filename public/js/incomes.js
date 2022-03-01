var currentDate = new Date();

var incomes = new Array();

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

function getIncomes () {


  $.ajax({
    url: "/Profile/getIncomes",
    type: "POST",
    dataType: 'json',
    data: {
      startDate: formatDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth()+1, 1),
      endDate: formatDate(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth()+1, lastDayOfMonth.getDate())
    },
    success: function (response) {
      response.forEach(element => {
        incomes.push(element);
      });
    },
    async: false
  });

}

function getIncomesAmount(categoryName) {
  
  var amount;
  incomes.forEach(element => {
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
    var deposited = parseFloat(getIncomesAmount(category));
    if (isNaN(deposited)) {
      deposited = 0;
    }
    var stayed = limit - deposited;

    var divLimit = `<div class="col-3"><p class="font-weight-bold mb-0">Cel:</p><p class="mb-0">${limit.toFixed(2)} zł</p></div>`;
    var divDeposit = `<div class="col-3"><p class="font-weight-bold mb-0">Odłożono:</p><p class="mb-0">${deposited.toFixed(2)} zł</p></div>`;
    var divStayed = `<div class="col-3"><p class="font-weight-bold mb-0">Brakuje:</p><p class="mb-0">${stayed.toFixed(2)} zł</p></div>`;
    var divSum = `<div class="col-3"><p class="font-weight-bold mb-0">Suma:</p><p class="mb-0" id="summary">${deposited.toFixed(2)} zł</p></div>`;
    if (deposited < limit)
      $(".check-limit").removeClass("bg-success").addClass("bg-info");
    else
      $(".check-limit").removeClass("bg-info").addClass("bg-success");
    $(".check-limit").append(divLimit).append(divDeposit).append(divStayed).append(divSum);

    $("#amount").change(function() {
      var sum = deposited+parseFloat($("#amount").val());
      console.log(sum);
      console.log(limit);
      $("#summary").html(`${sum.toFixed(2)} zł`);
      if (sum < limit)
        $(".check-limit").removeClass("bg-success").addClass("bg-info");
      else
        $(".check-limit").removeClass("bg-info").addClass("bg-success");
    });
  }
}

$(document).ready(function () {

  getIncomes();
  initSummary();

  $("#category").change(function() {
    initSummary();
  });
  

});