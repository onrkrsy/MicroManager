const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Service management
    getServices: () => ipcRenderer.invoke('get-services'),
    addService: (service) => ipcRenderer.invoke('add-service', service),
    removeService: (id) => ipcRenderer.invoke('remove-service', id),
    startService: (id) => ipcRenderer.invoke('start-service', id),
    stopService: (id) => ipcRenderer.invoke('stop-service', id),
    updateServicesOrder: (services) => ipcRenderer.invoke('update-services-order', services),
    
    // File dialog
    openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
    
    // Log handling
    onLogUpdate: (callback) => {
      // Remove any existing listeners to avoid duplicates
      ipcRenderer.removeAllListeners('log-update');
      // Add the new listener
      ipcRenderer.on('log-update', (event, ...args) => callback(...args));
    },
    
    // Service status updates
    onServiceStatusChange: (callback) => {
      ipcRenderer.removeAllListeners('service-status-change');
      ipcRenderer.on('service-status-change', (event, ...args) => callback(...args));
    }
  }
); 