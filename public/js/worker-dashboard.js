// Worker Dashboard JavaScript

let currentWorker = null;
let workerData = null;

// Initialize worker dashboard
document.addEventListener('DOMContentLoaded', async () => {
  if (!authToken) {
    window.location.href = '/';
    return;
  }
  loadWorkerProfile();
  loadWorkerDashboard();
});

// Load worker profile
async function loadWorkerProfile() {
  try {
    const userResult = await api.get('/users/profile');
    currentUser = userResult.user;
    
    const workerResult = await api.get('/workers/profile');
    workerData = workerResult.worker;

    document.getElementById('worker-name').textContent = currentUser.name;
    document.getElementById('worker-service').textContent = workerData.serviceType;
    document.getElementById('worker-rating').textContent = '⭐ ' + (workerData.rating || 0).toFixed(1);
    if (currentUser.profileImage) {
      document.getElementById('worker-profile-img').src = currentUser.profileImage;
    }

    // Update profile form
    document.getElementById('worker-profile-name').value = currentUser.name;
    document.getElementById('worker-profile-phone').value = currentUser.phone;
    document.getElementById('worker-profile-service').value = workerData.serviceType;
    document.getElementById('worker-profile-experience').value = workerData.experience;
    document.getElementById('worker-profile-rate').value = workerData.hourlyRate;
    document.getElementById('worker-profile-about').value = workerData.about;
    document.getElementById('worker-profile-skills').value = (workerData.skills || []).join(', ');
  } catch (error) {
    showAlert('Failed to load worker profile', 'error');
  }
}

// Load worker dashboard
async function loadWorkerDashboard() {
  try {
    const result = await api.get('/workers/profile/stats');
    
    document.getElementById('today-bookings').textContent = result.todayBookings || 0;
    document.getElementById('total-earnings').textContent = '$' + (result.totalEarnings || 0).toFixed(2);
    document.getElementById('monthly-earnings').textContent = '$' + (result.monthlyEarnings || 0).toFixed(2);
    document.getElementById('completion-rate').textContent = (result.completionRate || 0) + '%';
    document.getElementById('account-balance').textContent = '$' + (result.balance || 0).toFixed(2);
    document.getElementById('lifetime-earnings').textContent = '$' + (result.totalEarnings || 0).toFixed(2);
    document.getElementById('pending-payout').textContent = '$' + (result.pendingPayout || 0).toFixed(2);
    document.getElementById('completed-jobs').textContent = result.completedBookings || 0;

    // Load upcoming bookings
    loadUpcomingBookings();
    loadWorkerBookings();
    loadEarningsHistory();
    loadWorkerReviews();
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

// Load upcoming bookings
async function loadUpcomingBookings() {
  try {
    const result = await api.get('/workers/bookings?status=confirmed&upcoming=true');
    const container = document.getElementById('upcoming-bookings');

    if (!result.bookings || result.bookings.length === 0) {
      container.innerHTML = '<p>No upcoming bookings</p>';
      return;
    }

    container.innerHTML = result.bookings.slice(0, 5).map(booking => `
      <div class="booking-item">
        <div class="booking-info">
          <h4>${booking.userId.name} - ${booking.serviceType}</h4>
          <p>Date: ${new Date(booking.bookingDate).toLocaleString()}</p>
          <p>Duration: ${booking.duration} hours</p>
          <p>Location: ${booking.serviceLocation.address}</p>
        </div>
        <div class="booking-status confirmed">CONFIRMED</div>
        <button class="btn" onclick="openBookingDetailsModal('${booking._id}')">View</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading upcoming bookings:', error);
  }
}

// Load worker bookings
async function loadWorkerBookings(status = 'all') {
  try {
    const endpoint = status === 'all' ? '/workers/bookings' : `/workers/bookings?status=${status}`;
    const result = await api.get(endpoint);
    const container = document.getElementById('worker-bookings-list');

    if (!result.bookings || result.bookings.length === 0) {
      container.innerHTML = '<p>No bookings found</p>';
      return;
    }

    container.innerHTML = result.bookings.map(booking => `
      <div class="booking-item">
        <div class="booking-info">
          <h4>${booking.userId.name} - ${booking.serviceType}</h4>
          <p>Date: ${new Date(booking.bookingDate).toLocaleString()}</p>
          <p>Duration: ${booking.duration} hours | Amount: $${booking.totalAmount}</p>
          <p>Location: ${booking.serviceLocation.address}</p>
        </div>
        <div class="booking-status ${booking.status}">${booking.status.toUpperCase()}</div>
        <button class="btn" onclick="openBookingDetailsModal('${booking._id}')">Manage</button>
      </div>
    `).join('');
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

// Filter worker bookings
function filterWorkerBookings(status) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  loadWorkerBookings(status);
}

// Load earnings history
async function loadEarningsHistory() {
  try {
    const result = await api.get('/workers/earnings');
    const container = document.getElementById('earnings-list');

    if (!result.earnings || result.earnings.length === 0) {
      container.innerHTML = '<p>No earnings history</p>';
      return;
    }

    container.innerHTML = result.earnings.map(earning => `
      <div class="booking-item">
        <div class="booking-info">
          <h4>Booking from ${earning.userId.name}</h4>
          <p>Service: ${earning.serviceType}</p>
          <p>Date: ${new Date(earning.bookingDate).toLocaleDateString()}</p>
        </div>
        <div class="booking-status confirmed">$${earning.amount}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading earnings:', error);
  }
}

// Load worker reviews
async function loadWorkerReviews() {
  try {
    const result = await api.get('/reviews/worker/' + workerData._id);
    const container = document.getElementById('worker-reviews-list');

    if (!result.reviews || result.reviews.length === 0) {
      container.innerHTML = '<p>No reviews yet</p>';
      return;
    }

    container.innerHTML = result.reviews.map(review => `
      <div class="review-item">
        <div class="review-header">
          <div>
            <h4>${review.title}</h4>
            <p>${review.userId.name}</p>
          </div>
          <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
        </div>
        <p>${review.comment}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

// Open booking details modal
async function openBookingDetailsModal(bookingId) {
  try {
    const result = await api.get(`/bookings/${bookingId}`);
    const booking = result.booking;
    
    const content = document.getElementById('booking-details-content');
    content.innerHTML = `
      <div style="background: white; padding: 1.5rem; border-radius: 8px;">
        <h3>Customer: ${booking.userId.name}</h3>
        <p><strong>Phone:</strong> ${booking.userId.phone}</p>
        <p><strong>Address:</strong> ${booking.serviceLocation.address}</p>
        <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleString()}</p>
        <p><strong>Duration:</strong> ${booking.duration} hours</p>
        <p><strong>Service:</strong> ${booking.serviceType}</p>
        <p><strong>Amount:</strong> $${booking.totalAmount}</p>
        <p><strong>Notes:</strong> ${booking.notes}</p>
        <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
      </div>
    `;

    // Show action buttons based on status
    const buttons = document.getElementById('booking-action-buttons');
    if (booking.status === 'confirmed') {
      buttons.innerHTML = `
        <button class="btn" onclick="updateBookingStatus('${bookingId}', 'in-progress')">Start Service</button>
      `;
    } else if (booking.status === 'in-progress') {
      buttons.innerHTML = `
        <button class="btn" onclick="updateBookingStatus('${bookingId}', 'completed')">Complete Service</button>
      `;
    }

    document.getElementById('bookingDetailsModal').style.display = 'block';
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function closeBookingDetailsModal() {
  document.getElementById('bookingDetailsModal').style.display = 'none';
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
  try {
    const result = await api.put(`/bookings/${bookingId}`, { status });
    showAlert('Booking status updated', 'success');
    closeBookingDetailsModal();
    loadWorkerBookings();
    loadUpcomingBookings();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

// Update worker profile
async function updateWorkerProfile(event) {
  event.preventDefault();
  try {
    const profileData = {
      experience: document.getElementById('worker-profile-experience').value,
      hourlyRate: document.getElementById('worker-profile-rate').value,
      about: document.getElementById('worker-profile-about').value,
      skills: document.getElementById('worker-profile-skills').value.split(',').map(s => s.trim())
    };

    const result = await api.put('/workers/profile/' + workerData._id, profileData);
    showAlert('Profile updated successfully', 'success');
    loadWorkerProfile();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

// Request payout
function requestPayout() {
  document.getElementById('payoutModal').style.display = 'block';
}

function closePayoutModal() {
  document.getElementById('payoutModal').style.display = 'none';
}

// Submit payout request
async function submitPayoutRequest(event) {
  event.preventDefault();
  try {
    const payoutData = {
      amount: document.getElementById('payout-amount').value,
      bankAccount: document.getElementById('payout-account').value,
      routingNumber: document.getElementById('payout-routing').value
    };

    const result = await api.post('/workers/payout-request', payoutData);
    showAlert('Payout request submitted', 'success');
    closePayoutModal();
    loadWorkerDashboard();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

// Navigate sections
function workerNavigateTo(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(section + '-section').classList.add('active');
  event.target.classList.add('active');
}

// Logout
function workerLogout() {
  localStorage.removeItem('authToken');
  window.location.href = '/';
}
