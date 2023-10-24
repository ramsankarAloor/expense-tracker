const apiBaseUrl = `http://13.48.1.93`;

document.addEventListener('DOMContentLoaded', function() {
  if(!localStorage.getItem('lastEnteredDate')){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if needed
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('date-pick').value = formattedDate;
  }else{
    document.getElementById('date-pick').value = localStorage.getItem('lastEnteredDate');
  }

  setupForPremium();
  getIncomesPerDate(document.getElementById('date-pick').value);
  getExpensesPerDate(document.getElementById('date-pick').value);
});

function onSetDate(){
  console.log(document.getElementById('date-pick').value);
  localStorage.setItem('lastEnteredDate', document.getElementById('date-pick').value);
  window.location.reload();
}

async function getIncomesPerDate(date){
  const token = localStorage.getItem('token');
  const {data:incomes} = await axios.post(`${apiBaseUrl}:3000/expenses`,{date:date, isIncome : true}, {
    headers : {
      'Authorization' : `Bearer ${token}`
    }
  });
  //displaying expenses list
  let totalIn = 0
  incomes.forEach((income) => {
    displayIncomeRecord(income);
    totalIn += income.amount;
  });

  let displayTotal = totalIn;
  let textTotal = document.createTextNode(displayTotal);
  let totalNode = document.getElementById("total-income-node");
  totalNode.appendChild(textTotal);
}

async function getExpensesPerDate(date){
  const token = localStorage.getItem('token');
  const {data:expenses} = await axios.post(`${apiBaseUrl}:3000/expenses`,{date:date, isIncome:false}, {
    headers : {
      'Authorization' : `Bearer ${token}`
    }
  });
  //displaying expenses list
  let totalEx = 0
  expenses.forEach((expense) => {
    displayExpenseRecord(expense);
    totalEx += expense.amount;
  });

  let displayTotal = totalEx;
  let textTotal = document.createTextNode(displayTotal);
  let totalNode = document.getElementById("total-expense-node");
  totalNode.appendChild(textTotal);
}

async function setupForPremium(){
  const token = localStorage.getItem('token');
  const {data:isUserPremium} = await axios.get(`${apiBaseUrl}:3000/isPremium`, {
    headers : {
      'Authorization' : `Bearer ${token}`
    }
  });
  const premiumDiv = document.getElementById('premium-div');
  const youArePremium = document.getElementById('you-are-premium');
  if(isUserPremium){
    premiumDiv.style.display = 'none';
    youArePremium.style.display = 'flex';
  }
}

function displayIncomeRecord(object){
  const expensesList = document.getElementById("incomes-list");
  const listElement = document.createElement('div');
  listElement.className = 'list-element';

  const amountDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');
  const categoryDiv = document.createElement('div');
  const deleteBtnDiv = document.createElement('div');
  const deleteBtn = document.createElement('button');
  amountDiv.textContent = object.amount;
  descriptionDiv.textContent = object.description;
  categoryDiv.textContent = object.category;
  deleteBtn.textContent = "Delete";
  amountDiv.className = 'list-element-sub-20';
  descriptionDiv.className = 'list-element-sub-30';
  categoryDiv.className = 'list-element-sub-30';
  deleteBtnDiv.className = 'list-element-sub-20';
  deleteBtn.className = 'delete-btn';
  expensesList.appendChild(listElement);
  listElement.appendChild(descriptionDiv);
  listElement.appendChild(categoryDiv);
  listElement.appendChild(amountDiv);
  deleteBtnDiv.appendChild(deleteBtn);
  listElement.appendChild(deleteBtnDiv);
  deleteBtn.addEventListener("click", deleteIncome);

  async function deleteIncome() {
    const token = localStorage.getItem('token');
    await axios.delete(`${apiBaseUrl}:3000/incomes/${object.id}`, {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
    window.location.reload();
  }
}

function displayExpenseRecord(object) {
  const expensesList = document.getElementById("expenses-list");
  const listElement = document.createElement('div');
  listElement.className = 'list-element';

  const amountDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');
  const categoryDiv = document.createElement('div');
  const deleteBtnDiv = document.createElement('div');
  const deleteBtn = document.createElement('button');
  amountDiv.textContent = object.amount;
  descriptionDiv.textContent = object.description;
  categoryDiv.textContent = object.category;
  deleteBtn.textContent = "Delete";
  amountDiv.className = 'list-element-sub-20';
  descriptionDiv.className = 'list-element-sub-30';
  categoryDiv.className = 'list-element-sub-30';
  deleteBtnDiv.className = 'list-element-sub-20';
  deleteBtn.className = 'delete-btn';
  expensesList.appendChild(listElement);
  listElement.appendChild(descriptionDiv);
  listElement.appendChild(categoryDiv);
  listElement.appendChild(amountDiv);
  deleteBtnDiv.appendChild(deleteBtn);
  listElement.appendChild(deleteBtnDiv);
  deleteBtn.addEventListener("click", deleteExpense);

  async function deleteExpense() {
    const token = localStorage.getItem('token');
    await axios.delete(`${apiBaseUrl}:3000/expenses/${object.id}`, {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
    window.location.reload();
  }
}

async function postNewExpense() {
  const token = localStorage.getItem('token');
  let amount = document.getElementById("amount").value;
  let description = document.getElementById("description").value;
  let category = document.getElementById("dropdown").value;
  let date = document.getElementById("date-pick").value;

  const obj = { amount, description, category, date, isIncome : false};

  await axios.post(
    `${apiBaseUrl}:3000/new-expense`, obj, {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    }
  );
  localStorage.setItem('lastEnteredDate', date);
  window.location.reload();
}

async function postNewIncome(){
  const token = localStorage.getItem('token');
  let amount = document.getElementById("income-amount").value;
  let description = document.getElementById("income-description").value;
  let category = document.getElementById("income-dropdown").value;
  let date = document.getElementById("date-pick").value;

  const obj = { amount, description, category, date, isIncome: true};

  await axios.post(
    `${apiBaseUrl}:3000/new-expense`, obj, {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    }
  );
  window.location.reload();
}

document.getElementById("rzp-button1").onclick = async function (event) {
   const token = localStorage.getItem('token');
   const response = await axios.get(`${apiBaseUrl}:3000/purchase/premium-membership`, {
    headers : {
      "Authorization" : `Bearer ${token}`
    }
   })
   let options = {
    "key" : response.data.key_id,
    "order_id" : response.data.order.id,
    //handler function is called when payment is successful
    "handler" : async function (response) {
      await axios.post(`${apiBaseUrl}:3000/purchase/update-transaction-status`, {
        order_id : options.order_id,
        payment_id : response.razorpay_payment_id
      }, {
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      alert("You are a premium user now!!");
    }
   };
   const rzp1 = new Razorpay(options);
   rzp1.open();
   event.preventDefault();

   rzp1.on('Payment failed', (response)=>{
    console.log(response);
    alert("Something went wrong");
   })
}

const showLeaderBoardButton = document.getElementById('show-leaderboard-btn');
showLeaderBoardButton.addEventListener('click', goToLeaderBoard);
const showReportButton = document.getElementById('show-report-btn');
showReportButton.addEventListener('click', goToReport);

function goToLeaderBoard(){
  window.location.href = "../leaderboard/leaderboard.html"
}
function goToReport(){
  window.location.href = "../reportGeneration/report.html"
}

function switchToIncome(){
  const switchIncome = document.getElementById('switch-to-income');
  const switchExpense = document.getElementById('switch-to-expense');
  const expenseExclusive = document.getElementById('expense-exclusive');
  const incomeExclusive = document.getElementById('income-exclusive');

  switchIncome.style.display = 'none';
  switchExpense.style.display = 'flex';
  expenseExclusive.style.display = 'none';
  incomeExclusive.style.display = 'block';
}
function switchToExpense(){
  const switchIncome = document.getElementById('switch-to-income');
  const switchExpense = document.getElementById('switch-to-expense');
  const expenseExclusive = document.getElementById('expense-exclusive');
  const incomeExclusive = document.getElementById('income-exclusive');

  switchIncome.style.display = 'flex';
  switchExpense.style.display = 'none';
  expenseExclusive.style.display = 'block';
  incomeExclusive.style.display = 'none';
}