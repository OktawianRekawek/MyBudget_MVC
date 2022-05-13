
let incomes = [];

function getIncomes () {

  let data = new FormData();
  data.append('startDate', formatDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth()+1, 1));
  data.append('endDate', formatDate(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth()+1, lastDayOfMonth.getDate()));
  incomes = [];

  fetch('/Profile/getIncomes', {
    method: 'POST',
    body: data,
  })
  .then((res) => res.json())
  .then((data) => {
    data.forEach(element => {
      incomes.push(element);
    });
  })
  .then(() => initSummary())

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
    if (stayed < 0)
      stayed = 0;

    let divLimit = `<div class="col-3"><p class="font-weight-bold mb-0">Cel:</p><p class="mb-0">${limit.toFixed(2)} zł</p></div>`;
    let divDeposit = `<div class="col-3"><p class="font-weight-bold mb-0">Odłożono:</p><p class="mb-0">${deposited.toFixed(2)} zł</p></div>`;
    let divStayed = `<div class="col-3"><p class="font-weight-bold mb-0">Brakuje:</p><p class="mb-0">${stayed.toFixed(2)} zł</p></div>`;
    let divSum = `<div class="col-3"><p class="font-weight-bold mb-0">Suma:</p><p class="mb-0" id="summary">${deposited.toFixed(2)} zł</p></div>`;
    
    let classes = checkLimit.classList;
    if (deposited < limit) {
      classes.add("bg-info");
      classes.remove("bg-success");
    } else {
      classes.remove("bg-info");
      classes.add("bg-success");
    }
    checkLimit.innerHTML = divLimit + divDeposit + divStayed + divSum;

    let amount = document.getElementById("amount");
    amount.addEventListener('change', () => {
      let sum = deposited+parseFloat(amount.value);
      summary.innerHTML = (`${sum.toFixed(2)} zł`);
      if (sum > limit) 
        classes.replace("bg-success", "bg-info");
      else
        classes.replace("bg-info", "bg-success");
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
    messageContent.innerHTML = "Przychód został dodany!";
  }
  resultMessageElement.classList.remove('hidden');
}

function addIncome() {

  let amount = document.getElementById('amount').value;
  let date = document.getElementById('date').value;
  let category = document.getElementById('category').value;
  let comment = document.getElementById('comment').value;

  if (amount <= 0) {
    showResultMessage(ERR);
    return;
  }

  let data = new FormData();
  data.append('amount', amount);
  data.append('date', date);
  data.append('category', category);
  data.append('comment', comment);

  fetch('/Profile/addIncome', {
    method: 'POST',
    body: data
  }).then( (res) => res.json())
  .then((data) => {
    showResultMessage(data);
    getIncomes();
  })
}

window.onload = function() {

  getIncomes();

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
    
    getIncomes();
  })

  const amountInput = document.getElementById('amount');
  amountValidation(amountInput);

  const addIncomeBtn = document.getElementById('addIncomeBtn');
  addIncomeBtn.addEventListener('click', () => {
    addIncome();
  })
}