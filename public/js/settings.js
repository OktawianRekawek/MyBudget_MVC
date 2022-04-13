
function slideItem(itemName) {
  $(itemName).slideToggle(500);
}

function getIncomesCategories() {

  fetch('/Profile/getIncomesCategories')
  .then((res) => res.json())
  .then((data) => {
      let categories = data;
      let category;
      let categoryName;
      let categoryLimited;
      let categoryLimitAmount;
      let categoriesList = document.getElementById('incomes-categories');
      
      categories.forEach(function (item, index) {
        categoryName = item.name;
        categoryLimited = item.limited;
        categoryLimitAmount = item.amount;
        categoryId = item.id;
        category = `<button type="button" class="btn btn-primary income-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="income" data-id="${categoryId}" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Cel: ${categoryLimitAmount} zł`;
        category += `</button>`;
        categoriesList.innerHTML += category;
        
      });

      let addCategoryBtn = `<button type="button" class="btn btn-success row mx-auto col-sm-12 my-1 rounded justify-content-between addCatModalBtn" data-category="income">Dodaj kategorię</button>`;
      categoriesList.innerHTML += addCategoryBtn;
    });
}

function getExpensesCategories() {
  fetch('/Profile/getExpensesCategories')
  .then((res) => res.json())
  .then((data) => {
      let categories = data;
      let category;
      let categoryName;
      let categoryLimited;
      let categoryLimitAmount;
      let categoriesList = document.getElementById('expenses-categories');
      
      categories.forEach(function (item, index) {
        categoryName = item.name;
        categoryLimited = item.limited;
        categoryLimitAmount = item.amount;
        categoryId = item.id;
        category = `<button type="button" class="btn btn-primary expense-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="expense" data-id="${categoryId}" data-name="${categoryName}" data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}">${categoryName}`;
        if (categoryLimited==1)
          category += `<br>Limit: ${categoryLimitAmount} zł`;
        category += `</button>`;
        categoriesList.innerHTML += category;
        
      });

      let addCategoryBtn = `<button type="button" class="btn btn-success row mx-auto col-sm-12 my-1 rounded justify-content-between addCatModalBtn" data-category="expense">Dodaj kategorię</button>`;
      categoriesList.innerHTML += addCategoryBtn;
    });
}

function getPaymentMethodsCategories() {
  fetch('/Profile/getPaymentMethodsCategories')
  .then((res) => res.json())
  .then((data) => {
      let categories = data;
      let category;
      let categoryName;
      let categoriesList = document.getElementById('payment-categories');
      
      categories.forEach(function (item, index) {
        categoryName = item.name;
        categoryId = item.id;
        category = `<button type="button" class="btn btn-primary payment-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="payment" data-id="${categoryId}" data-name="${categoryName}">${categoryName}`;
        category += `</button>`;
        categoriesList.innerHTML += category;
        
      });

      let addCategoryBtn = `<button type="button" class="btn btn-success row mx-auto col-sm-12 my-1 rounded justify-content-between addCatModalBtn" data-category="payment">Dodaj kategorię</button>`;
      categoriesList.innerHTML += addCategoryBtn;
  });
}

function changeCategorySettings(property) {
  let categoryName = property.dataset.name;
  let categoryId = property.dataset.id;

  let categoryNameInput = document.getElementById('categoryName');
  let categoryIdInput = document.getElementById('categoryId');
  let categoryAmount = document.getElementById('category-amount');

  categoryNameInput.value = categoryName;
  categoryIdInput.value = categoryId;

  if (property.dataset.category === 'payment') {
    categoryAmount.classList.add("hidden");  
  } else {

    let categoryLimitAmount = property.dataset.amount;
    let categoryLimited = property.dataset.limit;
    let limitAmount = document.getElementById('limitAmount');
    
    limitAmount.value = categoryLimitAmount;
  
    categoryAmount.classList.remove("hidden");

    let formCheckLabel = document.getElementById('form-check-label');
    if (property.dataset.category === 'income')
      formCheckLabel.innerHTML = 'Ustal cel';
    else if (property.dataset.category === 'expense')
      formCheckLabel.innerHTML = 'Ustal limit'; 

    let limitCheck = document.getElementById('limitCheck');
    if (categoryLimited == 1)
    {
      limitCheck.checked = true;
      limitAmount.disabled = false;
    } else {
      limitCheck.checked = false;
      limitAmount.disabled = true;
    }
  }

  let modalLabel = document.getElementById('modalLabel');
  modalLabel.innerHTML = "Ustawienia kategorii";

  let settingsModal = document.getElementById('settingsModal');
  $("#settingsModal").modal('show');
  settingsModal.dataset.category = property.dataset.category;
}

function showAddCategoryModal(property) {
  let formCheckLabel = document.getElementById('form-check-label');
  if (property.dataset.category == 'income')
    formCheckLabel.innerHTML = 'Ustal cel';
  else if (property.dataset.category == 'expense')
    formCheckLabel.innerHTML = 'Ustal limit';

  let modalLabel = document.getElementById('modalLabel');
  let categoryName = document.getElementById('categoryName');
  let categoryId = document.getElementById('categoryId');
  modalLabel.innerHTML = "Dodaj kategorię";
  categoryName.value = "";
  categoryId.value = null;
  let categoryAmount = document.getElementById('category-amount');
  let limitAmount = document.getElementById('limitAmount');
  let limitCheck = document.getElementById('limitCheck');
  if (property.dataset.category != 'payment') {
    categoryAmount.classList.remove("hidden");
    limitAmount.value = "";
    limitCheck.checked = false;
    limitAmount.disabled = true;
  } else {
    categoryAmount.classList.add("hidden");
  }

  let settingsModal = document.getElementById('settingsModal');  
  $("#settingsModal").modal('show');
  settingsModal.dataset.category = property.dataset.category;
}

function saveSettings() {
  let categoryNameElement = document.getElementById('categoryName');
  let categoryName = categoryNameElement.value;
  if (categoryName === "") {
    categoryNameElement.classList.add("err-amount");
    return;
  } else
    categoryNameElement.classList.remove('err-amount');
  let categoryLimitAmount = document.getElementById('limitAmount').value;
  let categoryLimited = document.getElementById('limitCheck').checked?1:0;
  let categoryId = document.getElementById('categoryId').value;
  let categoryType = document.getElementById('settingsModal').dataset.category;
  let text;
  if (categoryType == 'income')
    text = 'Cel';
  else 
    text = 'Limit';

  let data = new FormData();
  data.append('category', categoryType);
  data.append('id', categoryId);
  data.append('name', categoryName);
  data.append('amount', categoryLimitAmount);
  data.append('limited', categoryLimited);

  fetch('/Profile/saveCategorySettings', {
    method: 'POST',
    body: data
  })
  .then((res) => res.json())
  .then((data) => {
    if (categoryId) {
      let element = document.getElementsByClassName('chosen')[0];
      if (categoryLimited)
        element.innerHTML = `${categoryName}<br>${text}: ${categoryLimitAmount} zł`;
      else
        element.innerHTML = `${categoryName}`;
      element.dataset.name = categoryName;
      if (categoryType != 'payment')
      {
        element.dataset.amount = categoryLimitAmount;
        element.dataset.limit = categoryLimited;
      }
    } else {
      categoryId = data[0];
      category = `<button type="button" class="btn btn-primary ${categoryType}-category row mx-auto col-sm-12 my-1 rounded justify-content-between" id="settingsModalBtn" data-category="${categoryType}" data-id="${categoryId}" data-name="${categoryName}"`;
      if (categoryType != 'payment') {
        category += ` data-amount="${categoryLimitAmount}" data-limit="${categoryLimited}"`;
      }
      category += `>${categoryName}`;
      if (categoryLimited==1)
        category += `<br>Cel: ${categoryLimitAmount} zł`;
      category += `</button>`;
      let addCategoryBtn = document.querySelector('.categories-list[style*="display\\: block"] .addCatModalBtn');
      addCategoryBtn.insertAdjacentHTML("beforebegin", category);
    }

    $("#settingsModal").modal('hide');
  });
}

function chooseSettingsCategory() {

  let incomesCategoryToggle = document.getElementById('incomes-category-toggle');
  let expensesCategoryToggle = document.getElementById('expenses-category-toggle');
  let paymentCategoryToggle = document.getElementById('payment-category-toggle');
  let userSettingsToggle = document.getElementById('user-settings-toggle');
  let incomesCategories = document.getElementById('incomes-categories');
  let expensesCategories = document.getElementById('expenses-categories');
  let paymentCategories = document.getElementById('payment-categories');
  let userSettings = document.getElementById('user-settings');

  incomesCategoryToggle.addEventListener('click', () => {
    slideItem(incomesCategories);
    if (expensesCategories.style.display == 'block')
      slideItem(expensesCategories);
    if (paymentCategories.style.display == 'block')
      slideItem(paymentCategories);
    if (userSettings.style.display == 'block')
        slideItem(userSettings);
  });

  expensesCategoryToggle.addEventListener('click', () => {
    slideItem(expensesCategories);
    if (incomesCategories.style.display == 'block')
      slideItem(incomesCategories);
    if (paymentCategories.style.display == 'block')
      slideItem(paymentCategories);
    if (userSettings.style.display == 'block')
        slideItem(userSettings);
  });

  paymentCategoryToggle.addEventListener('click', () => {
    slideItem(paymentCategories);
    if (expensesCategories.style.display == 'block')
      slideItem(expensesCategories);
    if (incomesCategories.style.display == 'block')
      slideItem(incomesCategories);
    if (userSettings.style.display == 'block')
      slideItem(userSettings);
  });

  userSettingsToggle.addEventListener('click', () => {
    slideItem(userSettings);
    if (expensesCategories.style.display == 'block')
      slideItem(expensesCategories);
    if (incomesCategories.style.display == 'block')
      slideItem(incomesCategories);
    if (paymentCategories.style.display == 'block')
      slideItem(paymentCategories);
  });
}

function showUserEditModal() {
  document.getElementById('login-input').value = document.getElementById('login').innerHTML;
  document.getElementById('email-input').value = document.getElementById('email').innerHTML;
  document.getElementById('login-form').classList.remove("hidden");
  document.getElementById('email-form').classList.remove("hidden");
  document.getElementById('password-form').classList.add("hidden");
  $("#userSettingsModal").modal('show');
}

function showChangePasswordModal() {
  document.getElementById('login-form').classList.add("hidden");
  document.getElementById('email-form').classList.add("hidden");
  document.getElementById('password-form').classList.remove("hidden");
  $("#userSettingsModal").modal('show');
}

function saveUserSettings() {
  let data = new FormData();

  if (document.getElementById('login-form').classList.contains('hidden')) {
    data.append('password', document.getElementById('password-input').value);

    fetch('/Profile/changeUserSettings', {
      method: 'POST',
      body: data
    })
    .then((res) => res.json())
    .then((data) => {
      retCode = data;
      switch (retCode)
      {
        case 0:
          document.getElementById('err-message').innerHTML = "";
          $("#userSettingsModal").modal('hide');
          break;
        case 1:
          document.getElementById('err-message').innerHTML = "Hasło musi zawierać conajmniej 6 znaków!";
          break;
        case 2:
          document.getElementById('err-message').innerHTML = "Hasło musi zawierać conajmniej jedną literę!";
          break;
        case 3:
          document.getElementById('err-message').innerHTML = "Hasło musi zawierać conajmniej jedną cyfrę!";
          break;
      }
    });
  } else {
    data.append('name', document.getElementById('login-input').value);
    data.append('email', document.getElementById('email-input').value);

    fetch('/Profile/changeUserSettings', {
      method: 'POST',
      body: data
    })
    .then((res) => res.json())
    .then((data) => {
      retCode = data;
      switch (retCode)
      {
        case 0:
          document.getElementById('err-message').innerHTML = "";
          document.getElementById('login').innerHTML = document.getElementById('login-input').value;
          document.getElementById('email').innerHTML = document.getElementById('email-input').value;
          $("#userSettingsModal").modal('hide');
          break;
        case 1:
          document.getElementById('err-message').innerHTML = "Nazwa nie może być pusta!";
          break;
        case 2:
          document.getElementById('err-message').innerHTML = "Proszę wpisać poprawny adres email!";
          break;
        case 3:
          document.getElementById('err-message').innerHTML = "Nie wprowadzono żadnych zmian!";
          break;
        case 4:
          document.getElementById('err-message').innerHTML = "Podany adres email jest już używany!";
          break;
      }
    });
  }
}
window.onload = function(){

  getIncomesCategories();
  getExpensesCategories();
  getPaymentMethodsCategories();

  chooseSettingsCategory();

  document.addEventListener('click', (event) => {
    let element = event.target;
    if(element && element.id == 'settingsModalBtn') {
      changeCategorySettings(element);
      element.classList.add('chosen');
    }
    if(element && element.classList.contains('addCatModalBtn')) {
      showAddCategoryModal(element);
    }
    if(element && element.id == 'userEdit') {
      showUserEditModal();
    }
    if(element && element.id == 'changePassword') {
      showChangePasswordModal();
    }
    if(element && element.id == 'saveSettings') {
      saveSettings();
    }
    if(element && element.id == 'saveUserSettings') {
      saveUserSettings();
    }
    if(element && element.id == 'limitCheck') {
      if(element.checked) {
        document.getElementById('limitAmount').disabled = false;
        document.getElementById('limitAmount').focus();
      } else {
        document.getElementById('limitAmount').disabled = true;
      }
    }
  });

  $("#settingsModal").on('hidden.bs.modal', () => {
    let chosenElement = document.getElementsByClassName('chosen');
    if (chosenElement.length)
      document.getElementsByClassName('chosen')[0].classList.remove('chosen');
  });

  $("#settingsModal").on('shown.bs.modal', () => {
    document.getElementById('categoryName').focus();
  });
  
  

}
