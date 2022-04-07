let currentDate = new Date();

let incomes = [];

let firstDayOfMonth = makeDate(currentDate.getFullYear(), currentDate.getMonth(), 1);
let lastDayOfMonth = makeDate(currentDate.getFullYear(), currentDate.getMonth()+1, 0);

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
  
  let amount;
  incomes.forEach(element => {
    if (categoryName == element.name)
    {
      amount = element.amountSum;
    }
  });
  return amount;
}

function initSummary() {

  let checkLimit = document.getElementById('check-limit');
  checkLimit.innerHTML = "";

  let categoryOptions = document.getElementById("category");
  let selectedCategoryOption = categoryOptions.selectedOptions[0];
  if (selectedCategoryOption.dataset.limited){

    let limit = parseFloat(selectedCategoryOption.dataset.limit);
    let category = selectedCategoryOption.label;
    let deposited = parseFloat(getIncomesAmount(category));
    if (isNaN(deposited)) {
      deposited = 0;
    }
    let stayed = limit - deposited;

    let divLimit = `<div class="col-3"><p class="font-weight-bold mb-0">Cel:</p><p class="mb-0">${limit.toFixed(2)} zł</p></div>`;
    let divDeposit = `<div class="col-3"><p class="font-weight-bold mb-0">Odłożono:</p><p class="mb-0">${deposited.toFixed(2)} zł</p></div>`;
    let divStayed = `<div class="col-3"><p class="font-weight-bold mb-0">Brakuje:</p><p class="mb-0">${stayed.toFixed(2)} zł</p></div>`;
    let divSum = `<div class="col-3"><p class="font-weight-bold mb-0">Suma:</p><p class="mb-0" id="summary">${deposited.toFixed(2)} zł</p></div>`;
    
    let classes = checkLimit.classList;
    if (deposited < limit) {
      classes.add("bg-danger");
      classes.remove("bg-success");
    } else {
      classes.remove("bg-danger");
      classes.add("bg-success");
    }
    checkLimit.innerHTML = divLimit + divDeposit + divStayed + divSum;

    let amount = document.getElementById("amount");
    amount.addEventListener('change', () => {
      let sum = deposited+parseFloat(amount.value);
      summary.innerHTML = (`${sum.toFixed(2)} zł`);
      if (sum > limit) 
        classes.replace("bg-success", "bg-danger");
      else
        classes.replace("bg-danger", "bg-success");
    });
  }
}

$(document).ready(function () {

  getIncomes();
  initSummary();

  let category = document.getElementById("category");

  category.addEventListener('change', () => {
    initSummary();
  });
});