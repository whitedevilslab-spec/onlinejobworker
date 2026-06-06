// Main JavaScript File

// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// Utility Functions
const api = {
  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      options.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request('GET', endpoint);
  },

  post(endpoint, data) {
    return this.request('POST', endpoint, data);
  },

  put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  },

  delete(endpoint) {
    return this.request('DELETE', endpoint);
  },
};

// Authentication Functions
function handleLogin(email, password) {
  api
    .post('/auth/login', { email, password })
    .then((result) => {
      localStorage.setItem('authToken', result.token);
      authToken = result.token;
      window.location.href = '/dashboard.html';
    })
    .catch((error) => {
      showAlert(error.message, 'error');
    });
}

function handleRegister(name, email, password, phone) {
  api
    .post('/auth/register', { name, email, password, confirmPassword: password, phone })
    .then((result) => {
      localStorage.setItem('authToken', result.token);
      authToken = result.token;
      showAlert('Registration successful!', 'success');
      window.location.href = '/dashboard.html';
    })
    .catch((error) => {
      showAlert(error.message, 'error');
    });
}

function logout() {
  localStorage.removeItem('authToken');
  authToken = null;
  window.location.href = '/index.html';
}

// UI Functions
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  document.body.insertBefore(alertDiv, document.body.firstChild);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Worker Listing
async function loadWorkers(filters = {}) {
  try {
    const query = new URLSearchParams(filters);
    const result = await api.get(`/workers?${query}`);

    const container = document.getElementById('workers-container');
    if (!container) return;

    container.innerHTML = result.workers
      .map(
        (worker) => `
        <div class="card worker-card">
          <img src="${worker.userId.profileImage || '/images/default-avatar.png'}" alt="${worker.userId.name}" class="worker-image">
          <h3>${worker.userId.name}</h3>
          <p><strong>${worker.serviceType}</strong></p>
          <p>Experience: ${worker.experience} years</p>
          <p>Hourly Rate: $${worker.hourlyRate}</p>
          <div class="rating">⭐ ${worker.rating} (${worker.totalReviews} reviews)</div>
          <button class="btn" onclick="viewWorkerDetails('${worker._id}')">View Profile</button>
        </div>
      `
      )
      .join('');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function viewWorkerDetails(workerId) {
  window.location.href = `/worker-details.html?id=${workerId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load workers on page load if workers container exists
  if (document.getElementById('workers-container')) {
    loadWorkers();
  }
});
