let currentDate = new Date();

let expenses = [];

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

function getExpenses () {

  let data = new FormData();
  data.append('startDate', formatDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth()+1, 1));
  data.append('endDate', formatDate(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth()+1, lastDayOfMonth.getDate()));
  expenses = [];

  fetch('/Profile/getExpenses', {
    method: 'POST',
    body: data,
  })
  .then((res) => res.json())
  .then((data) => {
    data.forEach(element => {
      expenses.push(element);
    });
  })
  .then(() => initSummary())
  
}

function getSpendAmount(categoryName) {
  
  let amount;
  expenses.forEach(element => {
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
    let spend = parseFloat(getSpendAmount(category));
    if (isNaN(spend)) {
      spend = 0;
    }
    let stayed = limit - spend;
    if (stayed < 0)
      stayed = 0;

    let divLimit = `<div class="col-3"><p class="font-weight-bold mb-0">Limit:</p><p class="mb-0">${limit.toFixed(2)} zł</p></div>`;
    let divSpend = `<div class="col-3"><p class="font-weight-bold mb-0">Wydano:</p><p class="mb-0">${spend.toFixed(2)} zł</p></div>`;
    let divStayed = `<div class="col-3"><p class="font-weight-bold mb-0">Zostało:</p><p class="mb-0">${stayed.toFixed(2)} zł</p></div>`;
    let divSum = `<div class="col-3"><p class="font-weight-bold mb-0">Suma:</p><p class="mb-0" id="summary">${spend.toFixed(2)} zł</p></div>`;

    let classes = checkLimit.classList;
    if (stayed <= 0) {
      classes.add("bg-danger");
      classes.remove("bg-success");
    } else {
      classes.remove("bg-danger");
      classes.add("bg-success");
    }
    checkLimit.innerHTML = divLimit + divSpend + divStayed + divSum;

    let amount = document.getElementById("amount");
    amount.addEventListener('change', () => {
      let sum = spend+parseFloat(amount.value);
      let summary = document.getElementById("summary");
      summary.innerHTML = (`${sum.toFixed(2)} zł`);
      if (sum > limit) 
        classes.replace("bg-success", "bg-danger");
      else
        classes.replace("bg-danger", "bg-success");
    });
  }
}

function showResultMessage(result) {
  const resultMessageElement = document.getElementById('resultMessage');
  const messageContainer = resultMessageElement.querySelector('div');
  const messageContent = resultMessageElement.querySelector('h2');
  if (result == ERR) {
    if(messageContainer.classList.contains('bg-success'))
      messageContainer.classList.remove('bg-success');
    messageContainer.classList.add('bg-danger');
    messageContent.innerHTML = "wpisz prawidłową kwotę!";
  } else {
    if(messageContainer.classList.contains('bg-danger'))
      messageContainer.classList.remove('bg-danger');
    messageContainer.classList.add('bg-success');
    messageContent.innerHTML = "Wydatek został dodany!";
  }
  resultMessageElement.classList.remove('hidden');
}

function addExpense() {

  let amount = document.getElementById('amount').value;
  let date = document.getElementById('date').value;
  let category = document.getElementById('category').value;
  let payment = document.getElementById('payment').value;
  let comment = document.getElementById('comment').value;


  if (amount <= 0) {
    showResultMessage(ERR);
    return;
  }

  let data = new FormData();
  data.append('amount', amount);
  data.append('date', date);
  data.append('category', category);
  data.append('payment', payment);
  data.append('comment', comment);

  fetch('/Profile/addExpense', {
    method: 'POST',
    body: data
  }).then( (res) => res.json())
  .then((data) => {
    showResultMessage(data);
    getExpenses();
  })
}

window.onload = function() {

  getExpenses();

  const category = document.getElementById("category");
  const dateElement = document.getElementById("date");

  category.addEventListener('change', () => {
    initSummary();
  });

  date.addEventListener('change', () => {
    let date = new Date();
    date.setTime(Date.parse(dateElement.value));
    firstDayOfMonth = makeDate(date.getFullYear(), date.getMonth(), 1);
    lastDayOfMonth = makeDate(date.getFullYear(), date.getMonth()+1, 0);
    
    getExpenses();
  })
  
  const amountInput = document.getElementById('amount');
  amountValidation(amountInput);

  const addExpenseeBtn = document.getElementById('addExpenseBtn');
  addExpenseeBtn.addEventListener('click', () => {
    addExpense();
  })
}