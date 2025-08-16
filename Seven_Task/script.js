document.addEventListener('DOMContentLoaded', () => {
    const usersContainer = document.getElementById('usersContainer');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const reloadBtn = document.getElementById('reloadBtn');
    const searchInput = document.getElementById('searchInput');

    let usersData = []; // Store fetched data for searching

    // Initial fetch
    fetchUserData();

    // Set up reload button
    reloadBtn.addEventListener('click', () => {
        fetchUserData();
        searchInput.value = ''; // Clear search on reload
    });

    // Set up search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterUsers(searchTerm);
    });

    function fetchUserData() {
        // Show loading, clear previous data and errors
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        usersContainer.innerHTML = '';

        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(users => {
                usersData = users; // Store for searching
                displayUsers(users);
                loadingElement.classList.add('hidden');
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loadingElement.classList.add('hidden');
                errorMessage.textContent = error.message;
                errorElement.classList.remove('hidden');
            });
    }

    function displayUsers(users) {
        if (!users || users.length === 0) {
            errorMessage.textContent = 'No user data available.';
            errorElement.classList.remove('hidden');
            return;
        }

        usersContainer.innerHTML = ''; // Clear previous results

        users.forEach((user, index) => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.style.animationDelay = `${index * 0.1}s`;

            userCard.innerHTML = `
                <h2>${user.name}</h2>
                <div class="user-info">
                    <strong>Username:</strong>
                    <span>${user.username}</span>
                </div>
                
                <div class="contact-section">
                    <div class="section-title">
                        <i class="fas fa-address-card"></i>
                        <h3>Contact</h3>
                    </div>
                    <div class="user-info">
                        <strong>Email:</strong>
                        <a href="mailto:${user.email}">${user.email}</a>
                    </div>
                    <div class="user-info">
                        <strong>Phone:</strong>
                        <a href="tel:${user.phone}">${user.phone}</a>
                    </div>
                    <div class="user-info">
                        <strong>Website:</strong>
                        <a href="https://${user.website}" target="_blank">${user.website}</a>
                    </div>
                </div>
                
                <div class="address-section">
                    <div class="section-title">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Address</h3>
                    </div>
                    <div class="address-line">
                        <span>${user.address.street},</span>
                        <span>${user.address.suite}</span>
                    </div>
                    <div class="address-line">
                        <span>${user.address.city},</span>
                        <span>${user.address.zipcode}</span>
                    </div>
                    <div class="user-info">
                        <strong>Geo:</strong>
                        <span>${user.address.geo.lat}, ${user.address.geo.lng}</span>
                    </div>
                </div>
                
                <div class="user-info">
                    <strong>Company:</strong>
                    <span>${user.company.name}</span>
                </div>
                <div class="user-info">
                    <strong>Catchphrase:</strong>
                    <span>"${user.company.catchPhrase}"</span>
                </div>
            `;

            usersContainer.appendChild(userCard);
        });
    }

    function filterUsers(searchTerm) {
        if (!searchTerm) {
            displayUsers(usersData);
            return;
        }

        const filteredUsers = usersData.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.phone.toLowerCase().includes(searchTerm) ||
            user.address.city.toLowerCase().includes(searchTerm) ||
            user.company.name.toLowerCase().includes(searchTerm)
        );

        displayUsers(filteredUsers);
    }
});