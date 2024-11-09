const balance = document.getElementById('balance')
const moneyPlus = document.getElementById('money-plus')
const moneyMinus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')
const notification = document.getElementById('notification')


const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions'),
)
let transactions =
  localStorageTransactions !== null ? localStorageTransactions : []

function updateLocaleStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

function showNotification() {
  notification.classList.add('show')
  setTimeout(() => {
    notification.classList.remove('show')
  }, 2000)
}

function generateID() {
  return Math.floor(Math.random() * 100000000)
}

function addTransaction(e) {
  e.preventDefault()
  if (text.value.trim() === '' || amount.value.trim() === '') {
    showNotification()
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    }
    transactions.push(transaction)
    addTransactionDOM(transaction)
    updateValues()
    updateLocaleStorage()
    text.value = ''
    amount.value = ''
  }
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+'
  const item = document.createElement('li')
  item.classList.add(sign === '+' ? 'plus' : 'minus')
  item.innerHTML = `
          ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span
          ><button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa fa-times"></i></button>
                    <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button> `
  list.appendChild(item)
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount)
  const total = amounts
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2)
  const income = amounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2)
  const expense = (
    amounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => (accumulator += value), 0) * -1
  ).toFixed(2)
  balance.innerText = `$${total}`
  moneyPlus.innerText = `$${income}`
  moneyMinus.innerText = `$${expense}`
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id)
  updateLocaleStorage()
  init()
}

function init() {
  list.innerHTML = ''
  transactions.forEach(addTransactionDOM)
  updateValues()
}

init()

form.addEventListener('submit', addTransaction)


window.onload = function() {

  const dataPoints = transactions.map(transaction => ({
    y: (transaction.amount),
    label: transaction.text
  }));
      
  const negativeDataPoints = dataPoints.filter(function(dataPoint) {
    return dataPoint.y < 0; 
});

  let chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "expenses"
    },
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0.00\"%\"",
      indexLabel: "{label} {y}",
      dataPoints:negativeDataPoints,
    }]
  });
  chart.render();

  let pn = dataPoints.filter(function(dataPoint) {
    return dataPoint.y > 0; 
});

  

  let chart2 = new CanvasJS.Chart("chartContainer2", {
    animationEnabled: true,
    title: {
      text: "income"
    },
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0.00\"%\"",
      indexLabel: "{label} {y}",
      dataPoints:pn
    }]
  });
  chart2.render();
  

  }
  const filters = document.getElementById('filters');

  filters.addEventListener('change',filtertransactions);

  function filtertransactions(){
    const filtervalue = filters.value;
    let filtertransactions=transactions;

    if(filtervalue === 'expense'){
      filtertransactions=transactions.filter(transaction=>transaction.amount<0);
    }else if(filtervalue === 'income') {
      filtertransactions = transactions.filter(transaction=>transaction.amount>0);
    }
    else if (filtervalue ==='low to high'){
      filtertransactions = transactions.sort((a,b)=>a.amount - b.amount);
    }
    else if(filtervalue === 'high to low'){
      filtertransactions = transactions.sort((a,b)=>b.amount - a.amount);
    }
    list.innerHTML='';
    filtertransactions.forEach(addTransactionDOM);
  }
  filtertransactions();

  function editTransaction(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    if (transaction) {
      text.value = transaction.text;
      amount.value = Math.abs(transaction.amount); 
  
      form.removeEventListener('submit', addTransaction); 
      form.addEventListener('submit', (e) => updateTransaction(e, id)); 
    }
  }
  function updateTransaction(e, id) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
      showNotification();
    } else {
      const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
      if (transactionIndex > -1) {
        transactions[transactionIndex].text = text.value; 
        transactions[transactionIndex].amount = +amount.value; 
      }
  
      init(); 
      updateLocaleStorage(); 
  
      text.value = '';
      amount.value = '';
      
      form.removeEventListener('submit', (e) => updateTransaction(e, id)); 
      form.addEventListener('submit', addTransaction); 
    }
  }
  
  a