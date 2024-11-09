const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const notification = document.getElementById('notification');
const list = document.getElementById('list');
const balance = document.getElementById('balance');

form.addEventListener('submit', addTransaction);


async function addTransaction(e) {
    e.preventDefault();
  
    if (text.value.trim() === '' || amount.value.trim() === '') {
      showNotification();
      return;
    }
  
    const transaction = {
      text: text.value,
      amount: parseFloat(amount.value),
    };
  
  
    text.value = '';
    amount.value = '';
    form.querySelector('button').textContent = 'Add Transaction';
    isEditing = false;
    currentTransactionId = null;
  
    await fetchTransactions();
  }
  
  async function saveTransaction(transaction) {
    try {
      const response = await fetch('addTransaction.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
  
      const result = await response.json();
  
      if (!result.success) {
        console.error('Failed to add transaction:', result.message);
        showNotification();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      showNotification();
    }
  }
  



async function fetchTransactions() {
  console.log("Fetching transactions...");
  
  try {
    const response = await fetch('getTransactions.php');
    
    // Check if response is OK
    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      throw new Error('Network response was not ok');
    }

    // Parse the JSON response
    const transactions = await response.json();
    console.log("Fetched transactions:", transactions);

    // Validate that transactions is an array
    if (!Array.isArray(transactions)) {
      console.error('Invalid data format:', transactions);
      return;
    }

    // Update the UI with fetched transactions
    updateUI(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    showNotification();
  }
}



function showNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

window.onload = fetchTransactions;




