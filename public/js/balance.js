
const periodSelect = document.getElementById('period');
const uncommonPeriodForm = document.getElementById('uncommonPeriodForm');
const commonPeriodLabel = document.getElementById('commonPeriodLabel');
let chosenPeriodLabel;

let startDate = formatDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth()+1, 1);
let endDate = formatDate(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth()+1, lastDayOfMonth.getDate());
let incomes, expenses;

let paymentMethods = [];

function getPaymentMethods() {
    fetch ('/Profile/getPaymentMethodsCategories', {
      method: 'post',
    })
    .then((response) => response.json())
    .then((result) => {
      paymentMethods = result;
    })
}

function changePeriod(periodLabel) {
  let firstDayOfPeriod, lastDayOfPeriod;
  currentDate = new Date();
  if (periodLabel == 'Bieżący miesiąc') {
    firstDayOfPeriod = makeDate(currentDate.getFullYear(), currentDate.getMonth(), 1);
    lastDayOfPeriod = makeDate(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
  } else if (periodLabel == 'Poprzedni miesiąc') {
    let previousMonthDate = currentDate;
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    firstDayOfPeriod = makeDate(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), 1);
    lastDayOfPeriod = makeDate(previousMonthDate.getFullYear(), previousMonthDate.getMonth()+1, 0);
  } else if (periodLabel == 'Bieżący rok') {
    firstDayOfPeriod = makeDate(currentDate.getFullYear(), 0, 1);
    lastDayOfPeriod = makeDate(currentDate.getFullYear(), 11, 31);
  }

  if (periodLabel == 'Niestandardowy') {
    startDate = document.getElementById('date1').value;
    endDate = document.getElementById('date2').value;
  } else {
    startDate = formatDate(firstDayOfPeriod.getFullYear(), firstDayOfPeriod.getMonth()+1, firstDayOfPeriod.getDate());
    endDate = formatDate(lastDayOfPeriod.getFullYear(), lastDayOfPeriod.getMonth()+1, lastDayOfPeriod.getDate());
  }

  commonPeriodLabel.querySelector('h3').innerHTML = startDate + ' - ' + endDate;

}

function changePeriodFormDisplay(periodLabel) {
  if (periodLabel == 'Niestandardowy') {
    commonPeriodLabel.classList.add('hidden');
    uncommonPeriodForm.classList.remove('hidden');
  } else {
    commonPeriodLabel.classList.remove('hidden');
    uncommonPeriodForm.classList.add('hidden');
  }
}

function getIncomes(startDate, endDate) {
  let data = new FormData();
  data.append('startDate', startDate);
  data.append('endDate', endDate);
  return new Promise ( (resolve) => {
    fetch ('/Profile/getAllIncomes', {
      method: 'post',
      body: data
    })
    .then((response) => resolve(response.json()))
  })
}

function getExpenses(startDate, endDate) {
  let data = new FormData();
  data.append('startDate', startDate);
  data.append('endDate', endDate);
  return new Promise ( (resolve) => {
    fetch ('/Profile/getAllExpenses', {
      method: 'post',
      body: data
    })
    .then((response) => resolve(response.json()))
  })
}

const incomesContainerElement = document.getElementById('incomesContainer');
const expensesContainerElement = document.getElementById('expensesContainer');

function createSummaryLabelBtn(categoryData) {
  let summaryLabelBtn = document.createElement('div');
  let categoryName = document.createElement('div');
  let categoryAmountSum = document.createElement('div');
  summaryLabelBtn.appendChild(categoryName);
  summaryLabelBtn.appendChild(categoryAmountSum);
  summaryLabelBtn.classList.add('row','summaryLabelBtn');
  categoryName.classList.add('col-6');
  categoryAmountSum.classList.add('col-6', 'text-right');
  categoryName.innerHTML = '<p>'+categoryData[1]+'</p>';
  categoryAmountSum.innerHTML = '<p>'+categoryData[2].toFixed(2)+'</p>';

  return summaryLabelBtn;
}

function createIncomeContainer(recordData, categoryName) {
  let recordContainer = document.createElement('div');
  let recordDate = document.createElement('div');
  let recordComment = document.createElement('div');
  let recordAmount = document.createElement('div');
  recordContainer.appendChild(recordDate);
  recordContainer.appendChild(recordComment);
  recordContainer.appendChild(recordAmount);
  recordContainer.classList.add('row', 'recordContainer', 'border-bottom');
  recordContainer.dataset.amount = recordData['amount'];
  recordContainer.dataset.date = recordData['date'];
  recordContainer.dataset.comment = recordData['comment'];
  recordContainer.dataset.category = categoryName;
  recordContainer.dataset.id = recordData['id'];
  recordDate.classList.add('col-3', 'date');
  recordComment.classList.add('col-6', 'comment');
  recordAmount.classList.add('col-3', 'text-right', 'amount');
  recordDate.innerHTML = '<p>'+ recordData['date'] +'</p>';
  recordComment.innerHTML = '<p>'+ recordData['comment'] +'</p>';
  recordAmount.innerHTML = '<p>'+ recordData['amount'] +'</p>';

  return recordContainer;
}

function createExpenseContainer(recordData, categoryName) {
  let recordContainer = document.createElement('div');
  let recordDate = document.createElement('div');
  let recordComment = document.createElement('div');
  let recordPayment = document.createElement('div');
  let recordAmount = document.createElement('div');
  recordContainer.appendChild(recordDate);
  recordContainer.appendChild(recordComment);
  recordContainer.appendChild(recordPayment);
  recordContainer.appendChild(recordAmount);
  recordContainer.classList.add('row', 'recordContainer', 'border-bottom');
  recordContainer.dataset.amount = recordData['amount'];
  recordContainer.dataset.date = recordData['date'];
  recordContainer.dataset.comment = recordData['comment'];
  recordContainer.dataset.payment = recordData['payment'];
  recordContainer.dataset.category = categoryName;
  recordContainer.dataset.id = recordData['id'];
  recordDate.classList.add('col-3', 'date');
  recordComment.classList.add('col-4', 'comment');
  recordPayment.classList.add('col-2', 'payment');
  recordAmount.classList.add('col-3', 'text-right', 'amount');

  let paymentName;
  paymentMethods.forEach(element => {
    if (element['id'] == recordData['payment'])
      paymentName = element['name'];
  });

  recordDate.innerHTML = '<p>'+ recordData['date'] +'</p>';
  recordComment.innerHTML = '<p>'+ recordData['comment'] +'</p>';
  recordPayment.innerHTML = '<p>'+ paymentName +'</p>';
  recordAmount.innerHTML = '<p>'+ recordData['amount'] +'</p>';

  return recordContainer;
}

function createCategoryRecordsContainer(recordsData, categoryName, type) {
  let categoryRecordsContainer = document.createElement('div');
  categoryRecordsContainer.classList.add('hidden');
  if (type == 'incomes')
    recordsData.forEach(record => {
      categoryRecordsContainer.appendChild(createIncomeContainer(record, categoryName));
    });
  else
    recordsData.forEach(record => {
      categoryRecordsContainer.appendChild(createExpenseContainer(record, categoryName));
    });

  return categoryRecordsContainer;
}

function createCategorySummaryContainer(categoryData, type) {
  let categorySummaryContainer = document.createElement('div');
  
  
  categorySummaryContainer.id = categoryData[0];
  categorySummaryContainer.appendChild(createSummaryLabelBtn(categoryData));
  categorySummaryContainer.appendChild(createCategoryRecordsContainer(categoryData[3], categoryData[1], type));
  
  return categorySummaryContainer;
}

function updateBalanceLabel(balance) {
  const balanceSummaryTextElement = document.getElementById("balanceSummary");
  const balanceMessageElement = document.getElementById("balanceMessage");

  balanceSummaryTextElement.innerHTML = "Bilans: " + balance.toFixed(2) + " PLN";

  if (balance > 0) {
    balanceMessageElement.innerHTML = "Gratulacje! Świetnie zarządzasz finansami!";
    balanceMessageElement.classList.remove("text-danger");
    balanceMessageElement.classList.add("text-success");
  } else {
    balanceMessageElement.innerHTML = "Uważaj! Twoje finanse mają się kiepsko!";
    balanceMessageElement.classList.remove("text-success");
    balanceMessageElement.classList.add("text-danger");
  }
}

async function updateBalance() {
  incomes = await getIncomes(startDate, endDate);
  let incomesSum = 0;
  incomesContainerElement.innerHTML = '';

  incomes.forEach(element => {
    incomesSum += element[2];
    if (element[2] != 0)
      incomesContainerElement.appendChild(createCategorySummaryContainer(element, 'incomes'));
  });
  
  document.getElementById('incomesSumAmount').innerHTML = incomesSum.toFixed(2);
  updateChart("incomes");

  expenses = await getExpenses(startDate, endDate);
  let expensesSum = 0;
  expensesContainerElement.innerHTML = '';

  expenses.forEach(element => {
    expensesSum += element[2];
    if (element[2] != 0)
      expensesContainerElement.appendChild(createCategorySummaryContainer(element, 'expenses'));
  });
  
  document.getElementById('expensesSumAmount').innerHTML = expensesSum.toFixed(2);
  updateChart("expenses");

  updateBalanceLabel(incomesSum - expensesSum);
}

async function showEditRecordModal(recordElement) {
  let record = {
    amount: recordElement.dataset.amount,
    date: recordElement.dataset.date,
    comment: recordElement.dataset.comment,
    category: recordElement.dataset.category,
    payment: null,
    id: recordElement.dataset.id,
    type: null,
    typeText: null
  };

  const recordAmountInput = document.getElementById('amount');
  const recordDateInput = document.getElementById('date');
  const recordCommentInput = document.getElementById('comment');
  const recordCategorySelect = document.getElementById('category');
  const recordPaymentSelect = document.getElementById('payment');
  const paymentForm = document.getElementById('paymentForm');
  const recordId = document.getElementById('recordId');

  recordAmountInput.value = record.amount;
  recordDateInput.value = record.date;
  recordCommentInput.value = record.comment;
  recordId.value = record.id;

  recordCategorySelect.innerHTML = '';
  recordPaymentSelect.innerHTML = '';
  

  if (recordElement.closest('.incomes')) {
    record.type = 'income';
    record.typeText = 'przychód';
    paymentForm.classList.add('hidden');
    incomes.forEach(element => {
      let categoryOption = document.createElement('option');
      categoryOption.innerHTML = element[1];
      recordCategorySelect.appendChild(categoryOption);
      if (element[1] == record.category)
        categoryOption.selected = true;
    });
  } else {
    record.type = 'expense';
    record.typeText = 'wydatek';
    record.payment = recordElement.dataset.payment;
    paymentForm.classList.remove('hidden');
    expenses.forEach(element => {
      let categoryOption = document.createElement('option');
      categoryOption.innerHTML = element[1];
      recordCategorySelect.appendChild(categoryOption);
      if (element[1] == record.category)
        categoryOption.selected = true;
    });
    paymentMethods.forEach(element => {
      let paymentOption = document.createElement('option');
      paymentOption.innerHTML = element['name'];
      paymentOption.value = element['id'];
      recordPaymentSelect.appendChild(paymentOption);
      if (element['id'] == record.payment)
        paymentOption.selected = true;
    });
    
  }

  let modalLabel = document.getElementById('modalLabel');
  modalLabel.innerHTML = "Edytuj " + record.typeText;

  $("#recordModal").modal('show');
  let recordModal = document.getElementById('recordModal');
  recordModal.dataset.type = record.type;
}

function deleteRecord() {

  let data = new FormData();
  data.append('recordId', document.getElementById('recordId').value);
  data.append('recordType', document.getElementById('recordModal').dataset.type);

  fetch('/Profile/deleteRecord', {
    method: 'post',
    body: data
  })
  .then( (response) => response.json())
  .then( (result) => {
    if (result) 
      alert('Błąd podczas usuwania rekordu!');
    else{
      updateBalance();
      $("#recordModal").modal('hide');
    }
  });
}

function saveRecord() {

  let data = new FormData();
  data.append('category', document.getElementById('category').value);
  data.append('payment', document.getElementById('payment').value);
  data.append('id', document.getElementById('recordId').value);
  data.append('date', document.getElementById('date').value);
  data.append('amount', document.getElementById('amount').value);
  data.append('comment', document.getElementById('comment').value);
  data.append('recordType', document.getElementById('recordModal').dataset.type);

  fetch('/Profile/saveRecord', {
    method: 'post',
    body: data
  })
  .then((response) => response.json())
  .then((result) => {
    if (result) 
      alert('Błąd podczas zapisu rekordu!');
    else{
      updateBalance();
      $("#recordModal").modal('hide');
    }
  });
}

const autocolors = window['chartjs-plugin-autocolors'];
let inomesChart = null, expesesChart = null;

Chart.register(autocolors);

function updateChart(type) {
  const labels = [];
  const amounts = [];
  let records;
  let chartLabel;

  if (type == "incomes") {
    records = incomes;
    chartLabel = 'Przychody';
    if (inomesChart != null)
      inomesChart.destroy();
  } else { 
    records = expenses;
    chartLabel = 'Wydatki';
    if (expesesChart != null)
      expesesChart.destroy();
  }
  records.forEach(element => {
    labels.push(element[1]);
    amounts.push(element[2]);
  });

  const data = {
    labels: labels,
    datasets: [{
      label: chartLabel,
      data: amounts
    }]
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      plugins: {
        autocolors: {
          mode: 'data'
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: chartLabel,
          font: {
            size: 24
          }
      }
      }
    }
  };
  
  if (type == "incomes") {
    inomesChart = new Chart(
      document.getElementById('incomesChart'),
      config
    );
  } else { 
    expesesChart = new Chart(
      document.getElementById('expensesChart'),
      config
    );
  }
}

getPaymentMethods();
window.onload = function(){
  
  chosenPeriodLabel = periodSelect.selectedOptions[0].label;
  changePeriodFormDisplay(chosenPeriodLabel);
  changePeriod(chosenPeriodLabel);
  updateBalance();

  periodSelect.addEventListener('change', () => {
    chosenPeriodLabel = periodSelect.selectedOptions[0].label;
    changePeriodFormDisplay(chosenPeriodLabel);
    if (chosenPeriodLabel != 'Niestandardowy') {
      changePeriod(chosenPeriodLabel);
      updateBalance();
    }
  })

  document.addEventListener('click', (event) => {
    let element = event.target;
    if(element && element.classList.contains('summaryLabelBtn')) {
      if (element.nextSibling.classList.contains('hidden'))
        element.nextSibling.classList.remove('hidden');
      else
        element.nextSibling.classList.add('hidden');
    }
    if(element && element.classList.contains('recordContainer')) {
      showEditRecordModal(element);
    }
    if(element && element.id == 'deleteRecord') {
      if(confirm('Na pewno chcesz usunąć rekord?'))
        deleteRecord()
    }
    if(element && element.id == 'saveRecord') {
      saveRecord();
    }
  })

}