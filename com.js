// In a real application, you would use a backend for authentication and storing complaints.
// For simplicity, we'll use local storage for this example.

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate the login (this should be done on the server in a real application)
    if (username === 'user' && password === 'password') {
        // Hide login form and show complaint form
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('complaintForm').style.display = 'block';
        document.getElementById('complaintList').style.display = 'block';
        loadComplaints();
    } else {
        alert('Invalid login credentials. Please try again.');
    }
}

function submitComplaint() {
    const title = document.getElementById('complaintTitle').value;
    const description = document.getElementById('complaintDescription').value;
    const photo = document.getElementById('complaintPhoto').value; // In a real app, you'd handle file uploads differently

    // Save the complaint to local storage (in a real app, you'd send this to the server)
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    complaints.push({ title, description, photo });
    localStorage.setItem('complaints', JSON.stringify(complaints));

    // Clear the form
    document.getElementById('complaintTitle').value = '';
    document.getElementById('complaintDescription').value = '';
    document.getElementById('complaintPhoto').value = '';

    // Reload the complaints list
    loadComplaints();
}

function loadComplaints() {
    const complaintsList = document.getElementById('complaintsList');
    complaintsList.innerHTML = '';

    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    complaints.forEach((complaint, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${complaint.title}</strong><br>${complaint.description}<br>`;
        if (complaint.photo) {
            li.innerHTML += `<img src="${complaint.photo}" alt="Complaint Photo" style="max-width: 100%;">`;
        }
        complaintsList.appendChild(li);
    });
}
