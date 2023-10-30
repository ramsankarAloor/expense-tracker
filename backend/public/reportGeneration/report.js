const apiBaseUrl = `http://13.48.1.93`;

document.addEventListener('DOMContentLoaded', function () {
  getDefaultMonth();
  getDownloadsList();
});

function getDefaultMonth() {
  const today = new Date();
  // Get the current year and month
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  // Set the default value to the current year and month
  document.getElementById('month-input').value = `${year}-${month}`;
}

function displaySingleRowExpense(object) {
  const monthlyReportTableList = document.getElementById(
    'monthly-report-table-list'
  );
  const monthlyReportTableListRow = document.createElement('div');

  monthlyReportTableListRow.className = 'monthly-report-table-list-row';
  const dateDiv = document.createElement('div');
  const expenseDiv = document.createElement('div');
  const incomeDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');
  const categoryDiv = document.createElement('div');

  descriptionDiv.className = 'monthly-report-table-cell-description';
  [dateDiv, expenseDiv, incomeDiv, categoryDiv].forEach(
    div => (div.className = 'monthly-report-table-cell')
  );

  dateDiv.textContent = object.date;
  descriptionDiv.textContent = object.description;
  categoryDiv.textContent = object.category;
  if (object.isIncome === false) {
    incomeDiv.textContent = null;
    expenseDiv.textContent = object.amount;
  } else {
    incomeDiv.textContent = object.amount;
    expenseDiv.textContent = null;
  }

  const divOrder = [
    dateDiv,
    descriptionDiv,
    categoryDiv,
    incomeDiv,
    expenseDiv
  ];
  divOrder.forEach(div => monthlyReportTableListRow.appendChild(div));

  monthlyReportTableList.appendChild(monthlyReportTableListRow);
}

async function downloadReport() {
  // axios /report/download
  const token = localStorage.getItem('token');
  const selectedMonth = document.getElementById('month-input').value;
  const {
    data: { fileUrl }
  } = await axios.post(
    `${apiBaseUrl}:3000/report/download-monthly-list`,
    { selectedMonth },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  document.getElementById(
    'fileUrl-div'
  ).innerHTML = `<h4 style="display: inline;">Download link</h4> : <a href="${fileUrl}">Click here</a>`;
  addToDownloads(fileUrl, selectedMonth);
}

async function addToDownloads(fileUrl, selectedMonth) {
  const token = localStorage.getItem('token');
  const dateTime = new Date();
  const { data: newDownload } = await axios.post(
    `${apiBaseUrl}:3000/report/add-to-downloads`,
    { fileUrl, selectedMonth, dateTime },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

let page_download = 1
const perPage_download = 10

async function getDownloadsList() {
  const token = localStorage.getItem('token');
  const { data: downloadsList } = await axios.get(
    `${apiBaseUrl}:3000/report/list-downloads?page=${page_download}&perPage=${perPage_download}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  downloadsList.forEach(download => displayDownloadRow(download));
}

// Event listener for Previous Page button
document.getElementById('prevPage_downloads').addEventListener('click', () => {
  if (page_download > 1) {
    document.getElementById('downloads-list-body').innerHTML = '';
    page_download--;
    getDownloadsList(page_download);
  }
});

// Event listener for Next Page button
document.getElementById('nextPage_downloads').addEventListener('click', () => {
  document.getElementById('downloads-list-body').innerHTML = '';
  page_download++;
  getDownloadsList(page_download);
});

function displayDownloadRow(download) {
  const downloadsListBody = document.getElementById('downloads-list-body');
  const downloadsListBodyRow = document.createElement('div');
  downloadsListBodyRow.className = "downloads-list-body-row";
  const dateOfDownload = document.createElement('div');
  dateOfDownload.className = 'downloads-list-cell width-50 heading';
  const reportOfMonth = document.createElement('div');
  reportOfMonth.className = 'downloads-list-cell width-25 heading';
  const downloadLink = document.createElement('div');
  downloadLink.className = 'downloads-list-cell width-25 heading';

  const timeAndDate = new Date(download.dateTime);
  dateOfDownload.innerHTML = `${timeAndDate.getHours()}:${timeAndDate.getMinutes()}:${timeAndDate.getSeconds()}    ${timeAndDate.getDate()}-${timeAndDate.getMonth()+1}-${timeAndDate.getFullYear()}`
  reportOfMonth.innerHTML = download.reportOfMonth;
  downloadLink.innerHTML = `<a href="${download.link}">click here</a>`;

  downloadsListBodyRow.appendChild(dateOfDownload);
  downloadsListBodyRow.appendChild(reportOfMonth);
  downloadsListBodyRow.appendChild(downloadLink);

  downloadsListBody.appendChild(downloadsListBodyRow);
}

let page = 1;

const rowsPerPageDropdown = document.getElementById('rows-per-page-dropdown');
rowsPerPageDropdown.value = localStorage.getItem('rowsPerPage');
rowsPerPageDropdown.addEventListener('change', handleChange);

function handleChange() {
  const selectedValue = rowsPerPageDropdown.value;
  localStorage.setItem('rowsPerPage', selectedValue);
}

async function displayMonthlyReport(page) {
  const token = localStorage.getItem('token');
  const selectedMonth = document.getElementById('month-input').value;
  const perPage = localStorage.getItem('rowsPerPage');
  const {
    data: { expensesForSelectedMonth, totalRecords }
  } = await axios.post(
    `${apiBaseUrl}:3000/report/monthlyList?page=${page}&perPage=${perPage}`,
    { selectedMonth },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const totalPages = Math.ceil(totalRecords / perPage);
  updatePagination(totalPages);
  expensesForSelectedMonth.forEach(expense => displaySingleRowExpense(expense));
}

// Function to update pagination controls
function updatePagination(totalPages) {
  const pageNumbersContainer = document.getElementById('pageNumbers');
  pageNumbersContainer.innerHTML = '';

  // Generate and display page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageNumberButton = document.createElement('button');
    pageNumberButton.className = 'page-number-button';
    pageNumberButton.textContent = i;
    pageNumberButton.addEventListener('click', () => goToPage(i));
    pageNumbersContainer.appendChild(pageNumberButton);

    // Check if this button corresponds to the current page
    if (i === page) {
      pageNumberButton.classList.add('active'); // Add the "active" class
    }
  }

  // Update the navigation buttons based on currentPage and totalPages
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  prevPageButton.disabled = page === 1;
  nextPageButton.disabled = page === totalPages;
}

// Function to navigate to a specific page
function goToPage(newPage) {
  document.getElementById('monthly-report-table-list').innerHTML = '';
  // Remove the "active" class from the previously selected button
  const previouslySelectedButton = document.querySelector(
    '.page-numbers button.active'
  );
  if (previouslySelectedButton) {
    previouslySelectedButton.classList.remove('active');
  }
  page = newPage;
  displayMonthlyReport(page);
  // Add the "active" class to the newly clicked button
  const newlyClickedButton = document.querySelector(
    `.page-numbers button:nth-child(${page})`
  );
  if (newlyClickedButton) {
    newlyClickedButton.classList.add('active');
  }
}

// Event listener for Previous Page button
document.getElementById('prevPage').addEventListener('click', () => {
  if (page > 1) {
    document.getElementById('monthly-report-table-list').innerHTML = '';
    page--;
    displayMonthlyReport(page);
  }
});

// Event listener for Next Page button
document.getElementById('nextPage').addEventListener('click', () => {
  document.getElementById('monthly-report-table-list').innerHTML = '';
  page++;
  displayMonthlyReport(page);
});
