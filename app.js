const studentName = document.querySelector("#studentName")
const studentid = document.querySelector("#studentId")
const studentEmailid = document.querySelector("#Emailid")
const studentContractNo = document.querySelector("#contactNo")



const buttonSubmit = document.querySelector("#submit");
const tableBody = document.querySelector("tbody")




// Other functions (addStudentToTable, loadStudentData, etc.) remain unchanged

buttonSubmit.addEventListener("click", submitOnclick);


function submitOnclick(event) {
    event.preventDefault(); // Prevent form submission
    
    // Validate each field
    let isValid = true;

    // Clear previous error messages
    clearErrorMessages();

    // Check each field's validity
    if (!studentName.checkValidity()) {
        showError(studentName, "Please enter a valid student name.");
        isValid = false;
    }
    if (!studentid.checkValidity()) {
        showError(studentid, studentid.title);
        isValid = false;
    }
    if (!studentEmailid.checkValidity()) {
        showError(studentEmailid, studentEmailid.title); // Display email-specific validation message
        isValid = false;
    }
    if (!studentContractNo.checkValidity()) {
        showError(studentContractNo, studentContractNo.title); // Display contact-specific validation message
        isValid = false;
    }

    // If all fields are valid, proceed with adding to table
    if (isValid) {
        const student = {
            Name: studentName.value,
            id: studentid.value,
            Emailid: studentEmailid.value,
            ContractNo: studentContractNo.value,
        };

        addStudentToTable(student);
        addStudentToLocalStorage(student);

        // Clear form fields
        studentName.value = '';
        studentid.value = '';
        studentEmailid.value = '';
        studentContractNo.value = '';

        // Smooth scroll to the secondary page
        window.scrollTo({
            top: document.getElementById('secondayPage').offsetTop,
            behavior: 'smooth',
           

        });
    }
}

// Function to show error messages
function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

// Function to clear all error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}


// Your existing functions (addStudentToTable, addStudentToLocalStorage, etc.) remain unchanged.




function addStudentToLocalStorage(student) {
    // Check if local storage is supported
    if (localStorage.getItem('students') === null) {
        let students = [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
    } else {
        let students = JSON.parse(localStorage.getItem('students'));
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
    }
}


function addStudentToTable(student) {

    const Row = document.createElement("tr");

    const student1 = document.createElement("td");
    student1.innerText = student.Name.trim('');
    student1.classList.add("student-name")

    Row.appendChild(student1);

    const student2 = document.createElement("td");
    student2.innerText = student.id.trim('');
    student2.classList.add("student-id")
    Row.appendChild(student2);

    const student3 = document.createElement("td");
    student3.innerText = student.Emailid.trim('');
    student3.classList.add("student-Emailid")
    Row.appendChild(student3);

    const student4 = document.createElement("td");
    student4.innerText = student.ContractNo.trim('');
    student4.classList.add("student-ContractNo")
    Row.appendChild(student4);

    const student5 = document.createElement("td");
    student5.classList.add("editbutton");

    // Use addEventListener instead of inline onclick
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editButton.addEventListener("click", handleeditButtonClick);
    student5.appendChild(editButton);
    Row.appendChild(student5);

    const student6 = document.createElement("td");
    student6.classList.add("Trashbutton");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener("click", handletrashButtonClick);
    student6.appendChild(deleteButton);
    Row.classList.add("student-item")
    Row.appendChild(student6);

    tableBody.appendChild(Row);
}

function loadStudentData() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.forEach(addStudentToTable); // Add each student to the table
}

loadStudentData(); // Load student data when the page loads



function handleeditButtonClick(e) {
    const item = e.target.closest("button");
    const itemElement = item.closest(".student-item");

    // Get the current values from the table row
    const studentName = itemElement.querySelector(".student-name").textContent;
    const studentId = itemElement.querySelector(".student-id").textContent;
    const studentEmailId = itemElement.querySelector(".student-Emailid").textContent;
    const studentContactNo = itemElement.querySelector(".student-ContractNo").textContent;

    // Create input fields for editing
    itemElement.querySelector(".student-name").innerHTML = `<input type="text" value="${studentName}" class="edit-name">`;
    itemElement.querySelector(".student-Emailid").innerHTML = `<input type="email" value="${studentEmailId}" class="edit-emailid" title="Please enter a valid email address (e.g., example@domain.com)">`;
    itemElement.querySelector(".student-ContractNo").innerHTML = `<input type="text" value="${studentContactNo}" class="edit-contactno" pattern="\\d{10}" maxlength="10" title="Contact number should be exactly 10 digits.">`;

    // Change the edit button to a save button
    item.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
    item.classList.add("save-button");

    // Remove edit event and add save event
    item.removeEventListener("click", handleeditButtonClick);
    item.addEventListener("click", function handleSaveClick() {
        if (saveEdit(itemElement, item)) { // Only remove listener if saveEdit returns true (successful save)
            item.removeEventListener("click", handleSaveClick);
        }
    });
}

function saveEdit(itemElement, saveButton) {
    clearErrorMessages();

    const studentId = itemElement.querySelector(".student-id").textContent.trim();

    // Get the edited values from input fields
    const editedName = itemElement.querySelector(".edit-name").value;
    const editedEmailId = itemElement.querySelector(".edit-emailid").value;
    const editedContactNo = itemElement.querySelector(".edit-contactno").value;

    // Validate fields before saving
    let isValid = true;

    if (!editedName) {
        showError(itemElement.querySelector(".edit-name"), "Name cannot be empty.");
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editedEmailId)) {
        showError(itemElement.querySelector(".edit-emailid"), "Please enter a valid email address.");
        isValid = false;
    }

    const contactPattern = /^\d{10}$/;
    if (!contactPattern.test(editedContactNo)) {
        showError(itemElement.querySelector(".edit-contactno"), "Contact number should be exactly 10 digits.");
        isValid = false;
    }

    if (!isValid) {
        return false; // Exit the function if there are validation errors, retaining the save button listener
    }

    // Update the table row with the new values
    itemElement.querySelector(".student-name").textContent = editedName;
    itemElement.querySelector(".student-Emailid").textContent = editedEmailId;
    itemElement.querySelector(".student-ContractNo").textContent = editedContactNo;

    // Retrieve and update student data in localStorage
    const students = JSON.parse(localStorage.getItem("students")) || [];
    let studentFound = false;

    for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {  // Match by student ID
            students[i].Name = editedName;
            students[i].Emailid = editedEmailId;
            students[i].ContractNo = editedContactNo;
            studentFound = true;
            break;
        }
    }

    if (!studentFound) {
        console.error(`Student with ID ${studentId} not found in local storage.`);
        alert("Student not found. Please refresh and try again.");
        return false;
    }

    // Save updated data back to local storage
    localStorage.setItem("students", JSON.stringify(students));

    // Change the save button back to an edit button
    saveButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    saveButton.classList.remove("save-button");
    saveButton.classList.add("edit-button");

    // Re-add the edit event
    saveButton.addEventListener("click", handleeditButtonClick);

    alert("Student data updated successfully.");
    return true; // Indicate successful save
}







function handletrashButtonClick(e) {
    const item = e.target;  // The clicked trash button
    const itemElement = item.closest(".student-item");  // The parent element containing the student data

    // Debugging log to check the targeted element

    // Get the student  unique identifier from the DOM
    const studentid = itemElement.querySelector(".student-id").textContent;  // Assuming this structure, adjust accordingly

    const students = JSON.parse(localStorage.getItem("students")) || [];

    // Iterate over the students in localStorage and remove the one that matches
    for (let i = 0; i < students.length; i++) {
        let student = students[i];


        // Compare based on the student's name (or other unique identifier)
        if (student.id === studentid) {
            // Remove the student from the array
            students.splice(i, 1);

            // Update localStorage
            localStorage.setItem("students", JSON.stringify(students));

            // Debugging log to confirm the student was removed
            console.log("Student removed:", student);
            break;  // Exit the loop after removing the student
        }
    }

    // Remove the student item from the DOM
    itemElement.remove();  // Remove the DOM element for the student

    // Debugging log to confirm the updated list
    console.log("Updated students list:", students);

    alert("Student removed!");
}
