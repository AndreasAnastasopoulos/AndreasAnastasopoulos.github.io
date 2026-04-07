
// ============================================
// DATA & STATE
// ============================================
const services = [
    { id: 'haircut', name: 'Classic Haircut', duration: 30, price: 15, category: 'Hair' },
    { id: 'haircut_beard', name: 'Haircut + Beard Trim', duration: 45, price: 18, category: 'Hair' },
    { id: 'personal_workout', name: 'Solo Workout', duration: 90, price: 10, category: 'Gym' },
    { id: 'free_workout', name: 'Zumba Class', duration: 60, price: 15, category: 'Gym' },
    { id: 'massage', name: 'Relaxing Massage', duration: 60, price: 45, category: 'Wellness' },
];

const businessHours = {
    0: null,
    1: { start: '09:00', end: '18:00' },
    2: { start: '09:00', end: '18:00' },
    3: { start: '09:00', end: '18:00' },
    4: { start: '09:00', end: '18:00' },
    5: { start: '09:00', end: '18:00' },
    6: null,
};

let currentMonth = new Date();
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentStep = 1;
let currentTableView = 'upcoming'; // Track which table view is active

function getPastDateFormatted(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return formatDate(date);
}

let bookings = [
    // Past completed bookings (History)
    { id: 1, client: 'Sofia M.', email: 'sofia@email.com', phone: '+30 694 000 0001', service: 'Classic Haircut', date: getPastDateFormatted(15), time: '10:00', status: 'completed' },
    { id: 2, client: 'Dimitris K.', email: 'dimitris@email.com', phone: '+30 694 000 0002', service: 'Haircut + Beard Trim', date: getPastDateFormatted(14), time: '14:30', status: 'completed' },
    { id: 3, client: 'Katerina P.', email: 'katerina@email.com', phone: '+30 694 000 0003', service: 'Relaxing Massage', date: getPastDateFormatted(12), time: '11:00', status: 'completed' },
    { id: 4, client: 'Vasilis T.', email: 'vasilis@email.com', phone: '+30 694 000 0004', service: 'Solo Workout', date: getPastDateFormatted(10), time: '09:00', status: 'completed' },
    { id: 5, client: 'Maria S.', email: 'maria@email.com', phone: '+30 694 000 0005', service: 'Zumba Class', date: getPastDateFormatted(8), time: '18:00', status: 'cancelled' },
    { id: 6, client: 'Panagiotis L.', email: 'panagiotis@email.com', phone: '+30 694 000 0006', service: 'Classic Haircut', date: getPastDateFormatted(5), time: '15:00', status: 'completed' },
    // Upcoming bookings
    { id: 7, client: 'Maria K.', email: 'maria@email.com', phone: '+30 694 111 2222', service: 'Classic Haircut', date: getTodayFormatted(), time: '10:00', status: 'confirmed' },
    { id: 8, client: 'George P.', email: 'george@email.com', phone: '+30 694 333 4444', service: 'Haircut + Beard Trim', date: getTodayFormatted(), time: '11:30', status: 'confirmed' },
    { id: 9, client: 'Anna S.', email: 'anna@email.com', phone: '+30 694 555 6666', service: 'Relaxing Massage', date: getTodayFormatted(), time: '14:00', status: 'confirmed' },
    { id: 10, client: 'Nikos M.', email: 'nikos@email.com', phone: '+30 694 777 8888', service: 'Solo Workout', date: getTomorrowFormatted(), time: '09:30', status: 'confirmed' },
    { id: 11, client: 'Elena T.', email: 'elena@email.com', phone: '+30 694 999 0000', service: 'Zumba Class', date: getTomorrowFormatted(), time: '12:00', status: 'confirmed' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function getTodayFormatted() {
    const today = new Date();
    return formatDate(today);
}

function getTomorrowFormatted() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

// ============================================
// VIEW SWITCHING
// ============================================
function showView(view, event) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const customerView = document.getElementById('customerView');
    const adminView = document.getElementById('adminView');
    const browserUrl = document.getElementById('browserUrl');

    if (view === 'customer') {
        customerView.style.display = 'block';
        adminView.style.display = 'none';
        browserUrl.textContent = 'yourbusiness.com/booking';
        populateServices();
    } else {
        customerView.style.display = 'none';
        adminView.style.display = 'block';
        browserUrl.textContent = 'yourbusiness.com/admin_dashboard';
        renderBookingsTable();
        updateStats();
    }
}

// ============================================
// CUSTOMER BOOKING FLOW
// ============================================
function populateServices() {
    const grid = document.getElementById('svcGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let currentCategory = '';

    services.forEach(service => {
        if (service.category !== currentCategory) {
            currentCategory = service.category;
            const categoryLabel = document.createElement('div');
            categoryLabel.className = 'cat-label';
            categoryLabel.textContent = currentCategory;
            grid.appendChild(categoryLabel);
        }

        const item = document.createElement('div');
        item.className = 'svc-item';
        item.innerHTML = `
                    <span class="svc-name">${service.name}</span>
                    <div class="svc-meta">
                        <span>
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${service.duration}m
                        </span>
                        <span>€${service.price}</span>
                    </div>
                `;
        item.onclick = () => selectService(service, item);
        grid.appendChild(item);
    });
}

function selectService(service, element) {
    selectedService = service;

    document.querySelectorAll('.svc-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');

    setTimeout(() => goStep(2), 300);
}

function goStep(step) {
    currentStep = step;

    // Update progress
    for (let i = 1; i <= 3; i++) {
        const stepNum = document.getElementById(`s${i}`);
        const line = document.getElementById(`l${i - 1}`);

        if (i < step) {
            stepNum.classList.add('done');
            stepNum.classList.remove('active');
            stepNum.innerHTML = '✓';
        } else if (i === step) {
            stepNum.classList.add('active');
            stepNum.classList.remove('done');
            stepNum.innerHTML = i;
        } else {
            stepNum.classList.remove('active', 'done');
            stepNum.innerHTML = i;
        }

        if (line && i < step) {
            line.classList.add('active');
        } else if (line) {
            line.classList.remove('active');
        }
    }

    // Show/hide steps
    document.getElementById('step1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('step2').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('step3').style.display = step === 3 ? 'block' : 'none';
    document.getElementById('successState').style.display = 'none';

    // Update description
    const descriptions = {
        1: 'Choose your service',
        2: 'Select date & time',
        3: 'Enter your details'
    };
    document.getElementById('stepDesc').textContent = descriptions[step];

    if (step === 2) {
        renderCalendar();
    }

    if (step === 3) {
        updateBookingSummary();
    }
}

function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    document.getElementById('curMonth').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const daysContainer = document.getElementById('calDays');
    daysContainer.innerHTML = '';

    // Empty cells
    for (let i = 0; i < startingDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day empty';
        daysContainer.appendChild(empty);
    }

    // Days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay();
        const dateStr = formatDate(dateObj);
        const hours = businessHours[dayOfWeek];

        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = day;

        const isPast = dateObj < today;
        const isClosed = !hours;

        if (isPast || isClosed) {
            dayEl.classList.add('off');
        } else {
            dayEl.onclick = () => selectDate(dateObj, dayEl);
            dayEl.classList.add('has');
        }

        if (selectedDate && dateStr === formatDate(selectedDate)) {
            dayEl.classList.add('sel');
        }

        daysContainer.appendChild(dayEl);
    }
}

function chgMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    renderCalendar();
    document.getElementById('timesWrap').classList.remove('active');
}

function selectDate(date, element) {
    selectedDate = date;
    selectedTime = null;

    document.querySelectorAll('.day').forEach(d => d.classList.remove('sel'));
    element.classList.add('sel');

    renderTimeSlots();

    // Hide calendar, show times full view
    document.querySelector('.cal-head').style.display = 'none';
    document.querySelector('.weekdays').style.display = 'none';
    document.getElementById('calDays').style.display = 'none';

    const timesWrap = document.getElementById('timesWrap');
    timesWrap.style.display = 'block';
    timesWrap.style.marginTop = '1.5rem';
}

function backToCalendar() {
    selectedDate = null;
    selectedTime = null;

    // Show calendar, hide times
    document.querySelector('.cal-head').style.display = 'flex';
    document.querySelector('.weekdays').style.display = 'grid';
    document.getElementById('calDays').style.display = 'grid';
    document.getElementById('timesWrap').style.display = 'none';

    // Clear selection
    document.querySelectorAll('.day').forEach(d => d.classList.remove('sel'));
}

function renderTimeSlots() {
    const wrapper = document.getElementById('timesWrap');
    const grid = document.getElementById('timesGrid');
    const display = document.getElementById('dateDisp');

    display.textContent = `Available times for ${formatDateDisplay(formatDate(selectedDate))}:`;

    const dayOfWeek = selectedDate.getDay();
    const hours = businessHours[dayOfWeek];

    if (!hours) {
        grid.innerHTML = '<p>Closed on this day</p>';
        wrapper.classList.add('active');
        return;
    }

    grid.innerHTML = '';

    const [startH, startM] = hours.start.split(':').map(Number);
    const [endH, endM] = hours.end.split(':').map(Number);

    let current = new Date(selectedDate);
    current.setHours(startH, startM, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(endH, endM, 0, 0);

    // Get booked times for this date
    const dateStr = formatDate(selectedDate);
    const bookedTimes = bookings
        .filter(b => b.date === dateStr && b.status !== 'cancelled')
        .map(b => b.time);

    while (current < end) {
        const timeStr = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
        const isBooked = bookedTimes.includes(timeStr);

        const slot = document.createElement('div');
        slot.className = 'time-btn';
        slot.textContent = timeStr;

        if (isBooked) {
            slot.classList.add('booked');
        } else {
            slot.onclick = () => selectTime(timeStr, slot);
        }

        if (selectedTime === timeStr) {
            slot.classList.add('sel');
        }

        grid.appendChild(slot);

        current.setMinutes(current.getMinutes() + 30);
    }

    wrapper.classList.add('active');
}

function selectTime(time, element) {
    selectedTime = time;

    document.querySelectorAll('.time-btn').forEach(s => s.classList.remove('sel'));
    element.classList.add('sel');

    setTimeout(() => goStep(3), 300);
}

function updateBookingSummary() {
    if (selectedService && selectedDate && selectedTime) {
        const summary = `${selectedService.name} - ${formatDateDisplay(formatDate(selectedDate))} at ${selectedTime} (€${selectedService.price})`;
        document.getElementById('bookSum').textContent = summary;
    }
}

// ── Security helpers ─────────────────────────────────────────────────────

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// localStorage-based rate limiting: max 10 submissions per hour
function checkRateLimit() {
    const MAX = 10;
    const WINDOW_MS = 60 * 60 * 1000; // 1 hour
    const KEY = 'itb_ts'; // booking timestamps
    const now = Date.now();
    let timestamps = JSON.parse(localStorage.getItem(KEY) || '[]');
    timestamps = timestamps.filter(t => now - t < WINDOW_MS);
    if (timestamps.length >= MAX) return false;
    timestamps.push(now);
    localStorage.setItem(KEY, JSON.stringify(timestamps));
    return true;
}

// ─────────────────────────────────────────────────────────────────────

function submitBook() {
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const phone = document.getElementById('cPhone').value.trim();

    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('rateError').style.display = 'none';
    document.getElementById('cName').classList.remove('error');
    document.getElementById('cEmail').classList.remove('error');
    document.getElementById('cPhone').classList.remove('error');

    // Rate limit check
    if (!checkRateLimit()) {
        const el = document.getElementById('rateError');
        el.textContent = 'Too many bookings submitted. Please try again in an hour.';
        el.style.display = 'block';
        return;
    }

    let hasError = false;

    // Validate name
    if (!name) {
        document.getElementById('nameError').textContent = 'Please enter your name';
        document.getElementById('cName').classList.add('error');
        hasError = true;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('emailError').textContent = 'Please enter your email';
        document.getElementById('cEmail').classList.add('error');
        hasError = true;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('cEmail').classList.add('error');
        hasError = true;
    }

    // Validate phone format
    const phoneRegex = /^[\d\s\-\+]{10,}$/;
    if (!phone) {
        document.getElementById('phoneError').textContent = 'Please enter your phone number';
        document.getElementById('cPhone').classList.add('error');
        hasError = true;
    } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number (at least 10 digits)';
        document.getElementById('cPhone').classList.add('error');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Add booking to demo data (inputs escaped before touching the DOM)
    const newBooking = {
        id: bookings.length + 1,
        client: escapeHtml(name),
        email: escapeHtml(email),
        phone: escapeHtml(phone),
        service: selectedService.name,
        date: formatDate(selectedDate),
        time: selectedTime,
        status: 'confirmed'
    };

    bookings.push(newBooking);
    updateStats();

    // Show success
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('successState').style.display = 'block';

    document.getElementById('stepDesc').textContent = 'Booking confirmed!';

    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const stepNum = document.getElementById(`s${i}`);
        stepNum.classList.add('done');
        stepNum.classList.remove('active');
        stepNum.innerHTML = '✓';
    }
}

function resetBook() {
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    currentStep = 1;

    document.getElementById('cName').value = '';
    document.getElementById('cEmail').value = '';
    document.getElementById('cPhone').value = '';

    document.querySelectorAll('.svc-item').forEach(i => i.classList.remove('selected'));
    document.querySelectorAll('.day').forEach(d => d.classList.remove('sel'));

    // Reset calendar display
    document.querySelector('.cal-head').style.display = 'flex';
    document.querySelector('.weekdays').style.display = 'grid';
    document.getElementById('calDays').style.display = 'grid';
    document.getElementById('timesWrap').style.display = 'none';

    goStep(1);
}

function viewAdminDashboard() {
    const adminBtn = document.querySelector('.view-buttons .view-btn:nth-child(2)');
    const customerBtn = document.querySelector('.view-buttons .view-btn:nth-child(1)');

    customerBtn.classList.remove('active');
    adminBtn.classList.add('active');

    document.getElementById('customerView').style.display = 'none';
    document.getElementById('adminView').style.display = 'block';
    document.getElementById('browserUrl').textContent = 'yourbusiness.com/admin_dashboard';

    renderBookingsTable();
    updateStats();
}

// ============================================
// ADMIN DASHBOARD
// ============================================
function switchTableView(view, event) {
    currentTableView = view;
    
    // Update active tab
    document.querySelectorAll('.panel-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reset filter to 'all'
    document.querySelectorAll('.filter').forEach(filter => filter.classList.remove('active'));
    document.querySelectorAll('.filter')[0].classList.add('active');
    
    renderBookingsTable('all');
}

function renderBookingsTable(filter = 'all') {
    const tbody = document.getElementById('bookBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let filtered = bookings;
    
    // Filter by upcoming vs history
    const today = getTodayFormatted();
    if (currentTableView === 'upcoming') {
        filtered = filtered.filter(b => b.date >= today);
    } else if (currentTableView === 'history') {
        filtered = filtered.filter(b => b.date < today);
    }
    
    if (filter !== 'all') {
        filtered = filtered.filter(b => b.status === filter);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });

    filtered.forEach(booking => {
        const row = document.createElement('tr');
        const statusClass = booking.status === 'confirmed' ? 'confirmed' : (booking.status === 'completed' ? 'completed' : booking.status);
        row.innerHTML = `
                    <td>
                        <div class="client-info">
                            <span class="client-name">${booking.client}</span>
                            <span class="client-email">${booking.email}</span>
                        </div>
                    </td>
                    <td>${booking.service}</td>
                    <td>${formatDateDisplay(booking.date)} at ${booking.time}</td>
                    <td><span class="status ${statusClass}">${capitalizeFirst(booking.status)}</span></td>
                    <td>
                        <div class="actions">
                            ${currentTableView === 'upcoming' && booking.status === 'confirmed' ? `<button class="act complete" onclick="updateBookStatus(${booking.id}, 'completed')">Complete</button>` : ''}
                            ${currentTableView === 'upcoming' && booking.status !== 'completed' && booking.status !== 'cancelled' ? `<button class="act cancel" onclick="updateBookStatus(${booking.id}, 'cancelled')">Cancel</button>` : ''}
                        </div>
                    </td>
                `;
        tbody.appendChild(row);
    });
}

function filterBook(status, event) {
    document.querySelectorAll('.filter').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    renderBookingsTable(status);
}

function filterBookFromSelect(select) {
    renderBookingsTable(select.value);
}

function updateBookStatus(id, newStatus) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = newStatus;
        renderBookingsTable();
        updateStats();
    }
}

function updateStats() {
    const today = getTodayFormatted();
    const todayBookings = bookings.filter(b => b.date === today && b.status === 'confirmed');

    document.getElementById('todayCnt').textContent = todayBookings.length;

    // Calculate week bookings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekBookings = bookings.filter(b => {
        const d = new Date(b.date);
        return d >= weekStart && d <= weekEnd && b.status === 'confirmed';
    });

    document.getElementById('weekCnt').textContent = weekBookings.length;

    // Calculate total revenue (excluding cancelled bookings)
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    let totalRevenue = 0;
    confirmedBookings.forEach(booking => {
        const service = services.find(s => s.name === booking.service);
        if (service) {
            totalRevenue += service.price;
        }
    });

    document.getElementById('revenueCnt').textContent = `€${totalRevenue}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// ACCORDION & UI INTERACTIONS
// ============================================
let expandedService = null;

function toggleService(element) {
    const allCards = document.querySelectorAll('.service-card');

    // If clicking on the already expanded service, contract it
    if (element === expandedService) {
        element.classList.remove('expanded', 'active');
        allCards.forEach(card => card.classList.remove('hidden-by-expansion'));
        expandedService = null;
        return;
    }

    // Close previously expanded service
    if (expandedService) {
        expandedService.classList.remove('expanded', 'active');
    }

    // Expand the clicked service and hide others
    element.classList.add('expanded', 'active');
    allCards.forEach(card => {
        if (card !== element) {
            card.classList.add('hidden-by-expansion');
        }
    });
    expandedService = element;
}

// Close expanded service when clicking outside
document.addEventListener('click', function (event) {
    if (expandedService && !expandedService.contains(event.target)) {
        // Check if click is outside the services grid
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid && !servicesGrid.contains(event.target)) {
            const allCards = document.querySelectorAll('.service-card');
            expandedService.classList.remove('expanded', 'active');
            allCards.forEach(card => card.classList.remove('hidden-by-expansion'));
            expandedService = null;
        }
    }
});

// ============================================
// MOBILE MENU & VIDEO LOADING
// ============================================
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Video loading
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('loadstart', function () {
        const ph = document.getElementById(this.dataset.ph);
        if (ph) ph.classList.add('loaded');
    });
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    populateServices();
    renderCalendar();
    updateStats();
});