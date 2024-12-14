const apiKey = 'AIzaSyBLOOYaN0zUBPUkA0FyPot1QL-LFWCpEzc'; // Replace with your Google API key
const spreadsheetId = '1a4JmwnRPvVHOh5BNOZ-F_sqspasdcowRB7uF-qScd48'; // Replace with your spreadsheet ID
const mainRange = 'Sheet2!A1:I500'; // Adjust the main sheet range as needed
const secondaryRange = 'Sheet3!A1:I500'; // Adjust the second sheet range as needed

// Global variable to hold the full table data
let allRowsData = [];

// Fetch data from Google Sheets and display the main table
async function fetchTableData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${mainRange}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 0) {
            const [headers, ...rows] = data.values;
            displayHeaders(headers);
            allRowsData = rows;  // Store all rows data globally
            displayTableData(rows);
        } else {
            console.error('No data found in the spreadsheet.');
            alert('No data found in the spreadsheet.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check your API key or spreadsheet ID.');
    }
}

// Function to filter rows based on the search input
function filterTable() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase(); // Corrected the ID reference
    const filteredRows = allRowsData.filter(row => 
        row.some(cell => cell.toLowerCase().includes(searchQuery)) // Filter by checking if any cell includes the query
    );
    displayTableData(filteredRows);
}

// Dynamically display table rows based on the filtered data
function displayTableData(rows) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the existing rows
    rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData || '';
            tr.appendChild(td);
        });
        tr.onclick = () => fetchSecondarySheetData(rowIndex); // Fetch secondary sheet data on row click
        tableBody.appendChild(tr);
    });
}

// Dynamically display table headers with sorting symbols for all columns
function displayHeaders(headers) {
    const tableHeaders = document.getElementById('table-headers');
    tableHeaders.innerHTML = '';
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.innerHTML = `${header} <span class="sort-symbol"></span>`;
        th.onclick = () => sortTable(index, th);
        tableHeaders.appendChild(th);
    });
}

// Fetch data for the secondary sheet (for the popup)
async function fetchSecondarySheetData(rowId) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${secondaryRange}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 0) {
            const [headers, ...rows] = data.values;
            const relevantData = rows[rowId] || rows[0]; // Retrieve the corresponding data from the secondary sheet
            showPopupWithSecondaryData(headers, relevantData);
        } else {
            console.error('No data found in the secondary sheet.');
            alert('No data found in the secondary sheet.');
        }
    } catch (error) {
        console.error('Error fetching secondary sheet data:', error);
        alert('Error fetching secondary sheet data.');
    }
}

// Show popup with details from the secondary sheet
function showPopupWithSecondaryData(headers, rowData) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');

    // Create a vertical table structure with the first column as the heading
    const verticalTable = headers.map((header, index) => {
        return `
            <tr>
                <th>${header}</th>
                <td>${rowData[index] || ''}</td>
            </tr>
        `;
    }).join('');

    // Populate the popup with the new table
    popupContent.innerHTML = `
        <span class="close-btn" onclick="closePopup()">&times;</span>
        <h2>${rowData[1]}</h2>
        <table>
            <tbody>
                ${verticalTable}
            </tbody>
        </table>
    `;

    popup.classList.remove('hidden');
}

// Close popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}

// Fetchd and display data on page load
fetchTableData();
