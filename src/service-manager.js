const { ipcMain, BrowserWindow } = require('electron');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

// Initialize the configuration store
const store = new Store({
  name: 'micromanager-config'
});

// Map to store running processes
const runningServices = new Map();

// Find Git branch for a given path
function findGitBranch(binPath) {
  try {
    let currentPath = binPath;
    const rootPath = path.parse(currentPath).root;
    
    // Navigate up to find .git directory
    while (currentPath !== rootPath) {
      const gitDir = path.join(currentPath, '.git');
      
      // Check if .git directory exists
      if (fs.existsSync(gitDir) && fs.statSync(gitDir).isDirectory()) {
        try {
          // Execute git command
          const stdout = execSync('git branch --show-current', {
            cwd: currentPath,
            encoding: 'utf8'
          });
          return stdout.trim();
        } catch (error) {
          console.error('Git command failed:', error);
          return null;
        }
      }
      
      // Go up one directory
      currentPath = path.dirname(currentPath);
    }
    
    // No Git repository found
    return null;
  } catch (error) {
    console.error('Error finding Git branch:', error);
    return null;
  }
}

// Get all registered services
function getServices() {
  return store.get('services') || [];
}

// Add a new service
function addService(service) {
  const services = getServices();
  
  // Generate a unique ID for the service
  service.id = Date.now().toString();
  service.status = 'stopped';
  
  // Validate the service path
  if (!fs.existsSync(service.path)) {
    throw new Error(`Path does not exist: ${service.path}`);
  }
  
  // Find executable files in the directory
  const files = fs.readdirSync(service.path);
  const exeFiles = files.filter(file => file.endsWith('.exe'));
  
  if (exeFiles.length === 0) {
    throw new Error('No executable (.exe) files found in the specified directory');
  }
  
  // If no specific executable is specified, use the first one found
  if (!service.executable) {
    service.executable = exeFiles[0];
  } else if (!exeFiles.includes(service.executable)) {
    throw new Error(`Specified executable ${service.executable} not found in directory`);
  }
  
  // Find Git branch
  service.gitBranch = findGitBranch(service.path);
  
  // Add the service to the list
  services.push(service);
  store.set('services', services);
  
  return service;
}

// Remove a service
function removeService(id) {
  const services = getServices();
  const updatedServices = services.filter(service => service.id !== id);
  
  // Stop the service if it's running
  if (runningServices.has(id)) {
    stopService(id);
  }
  
  store.set('services', updatedServices);
  return updatedServices;
}

// Start a service
function startService(id) {
  try {
    const services = getServices();
    const service = services.find(s => s.id === id);
    
    if (!service) {
      throw new Error(`Service with ID ${id} not found`);
    }
    
    if (runningServices.has(id)) {
      throw new Error(`Service ${service.name} is already running`);
    }
    
    // Update Git branch information
    const gitBranch = findGitBranch(service.path);
    if (gitBranch !== service.gitBranch) {
      service.gitBranch = gitBranch;
      
      // Update service in the store
      const updatedServices = services.map(s => s.id === id ? service : s);
      store.set('services', updatedServices);
      
      // Log branch change
      const branchLogData = {
        id,
        type: 'system',
        timestamp: new Date().toISOString(),
        message: gitBranch ? `Git branch: ${gitBranch}` : 'Not a Git repository'
      };
      sendLogUpdate(branchLogData);
    }
    
    // Full path to the executable
    const executablePath = path.join(service.path, service.executable);
    
    // Check if the executable exists
    if (!fs.existsSync(executablePath)) {
      throw new Error(`Executable not found: ${executablePath}`);
    }
    
    // Log starting service
    const startingLogData = {
      id,
      type: 'system',
      timestamp: new Date().toISOString(),
      message: `Starting service: ${service.name} (${executablePath})`
    };
    sendLogUpdate(startingLogData);
    
    try {
      // Set environment variables for the process
      const env = { ...process.env };
      
      // Set ASPNETCORE_ENVIRONMENT if devMode is enabled
      if (service.devMode) {
        env.ASPNETCORE_ENVIRONMENT = 'Development';
        
        // Log that we're running in development mode
        const logData = {
          id,
          type: 'system',
          timestamp: new Date().toISOString(),
          message: 'Running in Development mode'
        };
        sendLogUpdate(logData);
      }
      
      // Spawn the process
      const childProcess = spawn(executablePath, [], {
        cwd: service.path,
        windowsHide: true,
        env: env
      });
      
      // Store the process
      runningServices.set(id, childProcess);
      
      // Update service status
      updateServiceStatus(id, 'running');
      
      // Handle process output
      childProcess.stdout.on('data', (data) => {
        const logData = {
          id,
          type: 'stdout',
          timestamp: new Date().toISOString(),
          message: data.toString()
        };
        
        // Send log to renderer
        sendLogUpdate(logData);
      });
      
      childProcess.stderr.on('data', (data) => {
        const logData = {
          id,
          type: 'stderr',
          timestamp: new Date().toISOString(),
          message: data.toString()
        };
        
        // Send log to renderer
        sendLogUpdate(logData);
      });
      
      // Handle process exit
      childProcess.on('exit', (code) => {
        runningServices.delete(id);
        updateServiceStatus(id, 'stopped');
        
        const logData = {
          id,
          type: 'system',
          timestamp: new Date().toISOString(),
          message: `Process exited with code ${code}`
        };
        
        sendLogUpdate(logData);
      });
      
      // Handle process error
      childProcess.on('error', (err) => {
        runningServices.delete(id);
        updateServiceStatus(id, 'error');
        
        const logData = {
          id,
          type: 'error',
          timestamp: new Date().toISOString(),
          message: `Error: ${err.message}`
        };
        
        sendLogUpdate(logData);
      });
      
      return { success: true, id };
    } catch (error) {
      updateServiceStatus(id, 'error');
      
      const logData = {
        id,
        type: 'error',
        timestamp: new Date().toISOString(),
        message: `Failed to start process: ${error.message}`
      };
      sendLogUpdate(logData);
      
      throw error;
    }
  } catch (error) {
    console.error('Error in startService:', error);
    throw error;
  }
}

// Stop a service
function stopService(id) {
  try {
    if (!runningServices.has(id)) {
      throw new Error(`Service with ID ${id} is not running`);
    }
    
    const childProcess = runningServices.get(id);
    
    // Log stopping service
    const services = getServices();
    const service = services.find(s => s.id === id);
    const serviceName = service ? service.name : id;
    
    const stoppingLogData = {
      id,
      type: 'system',
      timestamp: new Date().toISOString(),
      message: `Stopping service: ${serviceName}`
    };
    sendLogUpdate(stoppingLogData);
    
    try {
      // Try to gracefully terminate the process
      childProcess.kill();
      
      // Remove from running services map
      runningServices.delete(id);
      
      // Update service status
      updateServiceStatus(id, 'stopped');
      
      return { success: true, id };
    } catch (error) {
      console.error(`Error stopping service ${id}:`, error);
      
      // Still remove from running services and update status
      runningServices.delete(id);
      updateServiceStatus(id, 'error');
      
      const logData = {
        id,
        type: 'error',
        timestamp: new Date().toISOString(),
        message: `Error stopping service: ${error.message}`
      };
      sendLogUpdate(logData);
      
      throw error;
    }
  } catch (error) {
    console.error('Error in stopService:', error);
    throw error;
  }
}

// Update service status in the store
function updateServiceStatus(id, status) {
  const services = getServices();
  const updatedServices = services.map(service => {
    if (service.id === id) {
      return { ...service, status };
    }
    return service;
  });
  
  store.set('services', updatedServices);
  
  // Notify renderer about status change
  sendStatusUpdate(id, status);
}

// Send log update to renderer
function sendLogUpdate(logData) {
  try {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].webContents.send('log-update', logData);
    }
  } catch (error) {
    console.error('Error sending log update:', error);
  }
}

// Send status update to renderer
function sendStatusUpdate(id, status) {
  try {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].webContents.send('service-status-change', { id, status });
    }
  } catch (error) {
    console.error('Error sending status update:', error);
  }
}

// Register IPC handlers
ipcMain.handle('get-services', () => getServices());
ipcMain.handle('add-service', (event, service) => addService(service));
ipcMain.handle('remove-service', (event, id) => removeService(id));
ipcMain.handle('start-service', (event, id) => startService(id));
ipcMain.handle('stop-service', (event, id) => stopService(id));
ipcMain.handle('update-services-order', (event, services) => updateServicesOrder(services));

// Update services order
function updateServicesOrder(updatedServices) {
  try {
    // Validate that we have the same services, just in different order
    const currentServices = getServices();
    
    if (currentServices.length !== updatedServices.length) {
      throw new Error('Service count mismatch');
    }
    
    // Check that all services exist
    const currentIds = new Set(currentServices.map(s => s.id));
    const updatedIds = new Set(updatedServices.map(s => s.id));
    
    if (currentIds.size !== updatedIds.size) {
      throw new Error('Service ID mismatch');
    }
    
    for (const id of updatedIds) {
      if (!currentIds.has(id)) {
        throw new Error(`Service ID ${id} not found in current services`);
      }
    }
    
    // Update the store with the new order
    store.set('services', updatedServices);
    return updatedServices;
  } catch (error) {
    console.error('Error updating services order:', error);
    throw error;
  }
}

// Export functions for testing
module.exports = {
  getServices,
  addService,
  removeService,
  startService,
  stopService
}; 