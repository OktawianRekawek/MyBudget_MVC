
const periodSelect = document.getElementById('period');
const uncommonPeriodForm = document.getElementById('uncommonPeriodForm');
const commonPeriodLabel = document.getElementById('commonPeriodLabel');
let chosenPeriodLabel;

let startDate = formatDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth()+1, 1);
let endDate = formatDate(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth()+1, lastDayOfMonth.getDate());
let incomes, expenses;

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

const incomesContainerElement = document.getElementById('incomesContainer');

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

function createRecordContainer(recordData, categoryName) {
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

function createCategoryRecordsContainer(recordsData, categoryName) {
  let categoryRecordsContainer = document.createElement('div');
  categoryRecordsContainer.classList.add('hidden');
  // console.log(recordsData);
  recordsData.forEach(record => {
    categoryRecordsContainer.appendChild(createRecordContainer(record, categoryName));
  })

  return categoryRecordsContainer;
}

function createCategorySummaryContainer(categoryData) {
  let categorySummaryContainer = document.createElement('div');
  
  
  categorySummaryContainer.id = categoryData[0];
  // categorySummaryContainer.classList.add('row');
  categorySummaryContainer.appendChild(createSummaryLabelBtn(categoryData));
  categorySummaryContainer.appendChild(createCategoryRecordsContainer(categoryData[3], categoryData[1]));
  // categorySummaryContainer.innerHTML = categoryData[1];
  
  return categorySummaryContainer;
}

async function updateBalance() {
  incomes = await getIncomes(startDate, endDate);
  incomesSum = 0;
  incomesContainerElement.innerHTML = '';
  // console.log(incomes);
  incomes.forEach(element => {
    incomesSum += element[2];
    if (element[2] != 0)
      incomesContainerElement.appendChild(createCategorySummaryContainer(element));
  });
  
  // console.log(incomesContainerElement);
  // expenses = getExpenses(startDate, endDate);
  document.getElementById('incomesSumAmount').innerHTML = incomesSum.toFixed(2);
}

async function showEditRecordModal(recordElement) {
  let record = {
    amount: recordElement.dataset.amount,
    date: recordElement.dataset.date,
    comment: recordElement.dataset.comment,
    category: recordElement.dataset.category,
    id: recordElement.dataset.id,
    type: null,
    typeText: null
  };

  let recordAmountInput = document.getElementById('amount');
  let recordDateInput = document.getElementById('date');
  let recordCommentInput = document.getElementById('comment');
  let recordCategorySelect = document.getElementById('category');
  let recordId = document.getElementById('recordId');

  recordAmountInput.value = record.amount;
  recordDateInput.value = record.date;
  recordCommentInput.value = record.comment;
  recordId.value = record.id;

  recordCategorySelect.innerHTML = '';
  incomes.forEach(element => {
    let categoryOption = document.createElement('option');
    categoryOption.innerHTML = element[1];
    recordCategorySelect.appendChild(categoryOption);
    if (element[1] == record.category)
      categoryOption.selected = true;
  });

  if (recordElement.closest('.incomes')) {
    record.type = 'income';
    record.typeText = 'przychód';
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