const OK = 0;
const ERR = 1;

function amountValidation(input) {
  input.addEventListener('change', () => {
    if (input.value < 0)
      input.value = input.min;
    
    input.value = parseFloat(input.value).toFixed(2);
  });
}

let currentDate = new Date();

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