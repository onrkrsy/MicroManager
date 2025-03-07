// DOM Elements
const servicesList = document.getElementById('services-list');
const logContainer = document.getElementById('log-container');
const logServiceSelector = document.getElementById('log-service-selector');
const clearLogsBtn = document.getElementById('clear-logs-btn');
const addServiceBtn = document.getElementById('add-service-btn');
const addServiceModal = document.getElementById('add-service-modal');
const closeModalBtn = document.querySelector('.close-modal');
const addServiceForm = document.getElementById('add-service-form');
const cancelAddServiceBtn = document.getElementById('cancel-add-service');
const browseBtn = document.getElementById('browse-btn');

// Store logs in memory
const logs = [];
let selectedServiceForLogs = 'all';
let services = [];
let draggedItem = null;

// Initialize the application
async function init() {
  try {
    // Load services from the main process
    services = await window.api.getServices();
    renderServices();
    
    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    showError('Failed to initialize application', error);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Add service button
  addServiceBtn.addEventListener('click', () => {
    addServiceModal.classList.add('show');
  });
  
  // Close modal button
  closeModalBtn.addEventListener('click', () => {
    addServiceModal.classList.remove('show');
  });
  
  // Cancel add service button
  cancelAddServiceBtn.addEventListener('click', () => {
    addServiceModal.classList.remove('show');
    addServiceForm.reset();
  });
  
  // Add service form submission
  addServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('service-name').value;
    const path = document.getElementById('service-path').value;
    const executable = document.getElementById('service-executable').value || null;
    const devMode = document.getElementById('service-dev-mode').checked;
    
    try {
      await window.api.addService({ name, path, executable, devMode });
      services = await window.api.getServices();
      renderServices();
      addServiceModal.classList.remove('show');
      addServiceForm.reset();
    } catch (error) {
      showError('Failed to add service', error);
    }
  });
  
  // Clear logs button
  clearLogsBtn.addEventListener('click', () => {
    logs.length = 0;
    renderLogs();
  });
  
  // Log service selector
  logServiceSelector.addEventListener('change', (e) => {
    selectedServiceForLogs = e.target.value;
    renderLogs();
  });
  
  // Listen for log updates from the main process
  window.api.onLogUpdate((logData) => {
    logs.push(logData);
    if (logs.length > 1000) {
      logs.shift(); // Remove oldest log if we have too many
    }
    renderLogs();
  });
  
  // Listen for service status changes
  window.api.onServiceStatusChange(({ id, status }) => {
    services = services.map(service => {
      if (service.id === id) {
        return { ...service, status };
      }
      return service;
    });
    renderServices();
  });
  
  // Browse button for file path
  browseBtn.addEventListener('click', async () => {
    try {
      const path = await window.api.openDirectoryDialog();
      if (path) {
        document.getElementById('service-path').value = path;
      }
    } catch (error) {
      showError('Failed to open directory dialog', error);
    }
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === addServiceModal) {
      addServiceModal.classList.remove('show');
    }
  });
}

// Render the services list
function renderServices() {
  // Clear the services list
  servicesList.innerHTML = '';
  
  // Update the log service selector
  updateLogServiceSelector();
  
  // If no services, show empty state
  if (services.length === 0) {
    servicesList.innerHTML = `
      <div class="empty-state">
        <p>No services added yet</p>
        <p>Click "Add Service" to get started</p>
      </div>
    `;
    return;
  }
  
  // Render each service
  services.forEach(service => {
    const serviceItem = document.createElement('div');
    serviceItem.className = `service-item ${service.status || 'stopped'}`;
    serviceItem.setAttribute('draggable', 'true');
    serviceItem.setAttribute('data-id', service.id);
    
    serviceItem.innerHTML = `
      <div class="service-header">
        <div class="service-title">
          <span class="service-name">${service.name}</span>
          ${service.devMode ? '<span class="dev-badge">DEV</span>' : ''}
        </div>
        <span class="service-status ${service.status || 'stopped'}">${service.status || 'stopped'}</span>
      </div>
      <div class="service-details">
        <div class="detail-row">
          <span class="detail-label">Path:</span>
          <span class="detail-value" title="${service.path}\\${service.executable}">${service.path}\\${service.executable}</span>
        </div>
        ${service.gitBranch ? `
        <div class="detail-row">
          <span class="detail-label">Branch:</span>
          <span class="detail-value" title="${service.gitBranch}">${service.gitBranch}</span>
        </div>
        ` : ''}
      </div>
      <div class="service-actions">
        ${service.status === 'running' 
          ? `<button class="btn danger stop-service" data-id="${service.id}">Stop</button>` 
          : `<button class="btn success start-service" data-id="${service.id}">Start</button>`
        }
        <button class="btn secondary remove-service" data-id="${service.id}">Remove</button>
      </div>
    `;
    
    // Add drag and drop event listeners
    serviceItem.addEventListener('dragstart', handleDragStart);
    serviceItem.addEventListener('dragover', handleDragOver);
    serviceItem.addEventListener('dragenter', handleDragEnter);
    serviceItem.addEventListener('dragleave', handleDragLeave);
    serviceItem.addEventListener('drop', handleDrop);
    serviceItem.addEventListener('dragend', handleDragEnd);
    
    servicesList.appendChild(serviceItem);
  });
  
  // Add event listeners to the buttons
  document.querySelectorAll('.start-service').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      try {
        btn.disabled = true;
        btn.textContent = 'Starting...';
        await window.api.startService(id);
      } catch (error) {
        showError('Failed to start service', error);
        // Reset button state
        btn.disabled = false;
        btn.textContent = 'Start';
        // Refresh services to ensure UI is in sync
        services = await window.api.getServices();
        renderServices();
      }
    });
  });
  
  document.querySelectorAll('.stop-service').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      try {
        btn.disabled = true;
        btn.textContent = 'Stopping...';
        await window.api.stopService(id);
      } catch (error) {
        showError('Failed to stop service', error);
        // Reset button state
        btn.disabled = false;
        btn.textContent = 'Stop';
        // Refresh services to ensure UI is in sync
        services = await window.api.getServices();
        renderServices();
      }
    });
  });
  
  document.querySelectorAll('.remove-service').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to remove this service?')) {
        try {
          services = await window.api.removeService(id);
          renderServices();
        } catch (error) {
          showError('Failed to remove service', error);
        }
      }
    });
  });
}

// Update the log service selector
function updateLogServiceSelector() {
  // Save the current selection
  const currentSelection = logServiceSelector.value;
  
  // Clear the selector
  logServiceSelector.innerHTML = '';
  
  // Add the "All Services" option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Services';
  logServiceSelector.appendChild(allOption);
  
  // Add an option for each service
  services.forEach(service => {
    const option = document.createElement('option');
    option.value = service.id;
    option.textContent = service.name;
    logServiceSelector.appendChild(option);
  });
  
  // Restore the selection if it still exists
  if (Array.from(logServiceSelector.options).some(option => option.value === currentSelection)) {
    logServiceSelector.value = currentSelection;
  } else {
    logServiceSelector.value = 'all';
    selectedServiceForLogs = 'all';
  }
}

// Render the logs
function renderLogs() {
  // Clear the log container
  logContainer.innerHTML = '';
  
  // Filter logs based on selected service
  const filteredLogs = selectedServiceForLogs === 'all' 
    ? logs 
    : logs.filter(log => log.id === selectedServiceForLogs);
  
  // If no logs, show empty state
  if (filteredLogs.length === 0) {
    logContainer.innerHTML = `
      <div class="empty-state">
        <p>No logs to display</p>
        <p>Start a service to see logs</p>
      </div>
    `;
    return;
  }
  
  // Render each log entry
  filteredLogs.forEach(log => {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-type-${log.type}`;
    
    // Find the service name
    const service = services.find(s => s.id === log.id);
    const serviceName = service ? service.name : log.id;
    
    // Format timestamp
    const timestamp = new Date(log.timestamp).toLocaleTimeString();
    
    logEntry.innerHTML = `
      <span class="log-timestamp">${timestamp}</span>
      <span class="log-service">[${serviceName}]</span>
      <span class="log-message">${log.message}</span>
    `;
    
    logContainer.appendChild(logEntry);
  });
  
  // Scroll to bottom
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Show an error message
function showError(title, error) {
  console.error(title, error);
  alert(`${title}: ${error.message}`);
}

// Drag and Drop handlers
function handleDragStart(e) {
  this.classList.add('dragging');
  draggedItem = this;
  
  // Set the data being dragged
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  
  // Remove drag-over class
  this.classList.remove('drag-over');
  
  // Don't do anything if dropping on the same item
  if (draggedItem === this) {
    return false;
  }
  
  // Get the dragged and target service IDs
  const draggedId = draggedItem.getAttribute('data-id');
  const targetId = this.getAttribute('data-id');
  
  // Reorder services array
  const draggedIndex = services.findIndex(s => s.id === draggedId);
  const targetIndex = services.findIndex(s => s.id === targetId);
  
  if (draggedIndex !== -1 && targetIndex !== -1) {
    // Remove the dragged item
    const [draggedService] = services.splice(draggedIndex, 1);
    
    // Insert at the new position
    services.splice(targetIndex, 0, draggedService);
    
    // Save the new order to store
    window.api.updateServicesOrder(services).then(() => {
      // Re-render the services list
      renderServices();
    });
  }
  
  return false;
}

function handleDragEnd(e) {
  // Remove dragging class
  this.classList.remove('dragging');
  
  // Reset all items
  document.querySelectorAll('.service-item').forEach(item => {
    item.classList.remove('drag-over');
  });
  
  draggedItem = null;
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 