const apiKey = 'AIzaSyBLOOYaN0zUBPUkA0FyPot1QL-LFWCpEzc';  // Replace with your Google API key
const spreadsheetId = '1a4JmwnRPvVHOh5BNOZ-F_sqspasdcowRB7uF-qScd48';  // Replace with your spreadsheet ID
const range = 'Sheet2!A1:I500';
// Sample employee data
const employees = [
    {
        name: "John Doe",
        department: "IT",
        position: "Software Engineer",
        photo: "john_doe.jpg",
        details: "John has 5 years of experience in software development."
    },
    {
        name: "Jane Smith",
        department: "HR",
        position: "HR Manager",
        photo: "jane_smith.jpg",
        details: "Jane specializes in employee relations and recruitment."
    },
    {
        name: "David Brown",
        department: "Finance",
        position: "Accountant",
        photo: "david_brown.jpg",
        details: "David is skilled in financial analysis and budgeting."
    }
];

// Populate table with employee data
const tableBody = document.getElementById("table-body");

employees.forEach((employee, index) => {
    const row = document.createElement("tr");
    row.setAttribute("data-index", index);
    row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.department}</td>
        <td>${employee.position}</td>
    `;
    row.addEventListener("click", () => showPopup(index));
    tableBody.appendChild(row);
});

// Show popup with employee details
function showPopup(index) {
    const employee = employees[index];
    document.getElementById("popup-photo").src = employee.photo;
    document.getElementById("popup-name").textContent = employee.name;
    document.getElementById("popup-details").textContent = employee.details;
    document.getElementById("popup").classList.remove("hidden");
}

// Close popup
function closePopup() {
    document.getElementById("popup").classList.add("hidden");
}

// Filter employees
function filterable() {
    const query = document.getElementById("searching").value.toLowerCase();
    const rows = document.querySelectorAll("#table-body tr");
    rows.forEach((row) => {
        const name = row.children[0].textContent.toLowerCase();
        const department = row.children[1].textContent.toLowerCase();
        const position = row.children[2].textContent.toLowerCase();
        if (name.includes(query) || department.includes(query) || position.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
