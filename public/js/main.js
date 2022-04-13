const OK = 0;
const ERR = 1;

function amountValidation(input) {
  input.addEventListener('change', () => {
    if (input.value < 0)
      input.value = input.min;
    
    input.value = parseFloat(input.value).toFixed(2);
  });
}