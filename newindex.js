const text = document.getElementById('text');
const amount = document.getElementById('amount');
const form = document.getElementById('form');
const list = document.getElementById('list');
const balance = document.getElementById('balance'); 

form.addEventListener('submit', addTransaction);

async function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    showNotification();
    return;
  }

  const formData = new FormData();
  formData.append('text', text.value);
  formData.append('amount', parseFloat(amount.value));

  try {
    const response = await fetch('addTransaction.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      console.log('Transaction added successfully!');
      fetchTransactions(); 
    } else {
      console.error('Failed to add transaction:', result.message);
      showNotification();
    }
  } catch (error) {
    console.error('Error adding transaction:', error);
    showNotification();
  }

  text.value = '';
  amount.value = '';
}

