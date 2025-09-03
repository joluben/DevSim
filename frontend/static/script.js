/**
 * Main Application Controller - Actualizado para la nueva estructura
 */

class DeviceSimulatorApp {
    constructor() {
        this.currentView = 'devices';
        this.currentDevice = null;
        this.currentConnection = null;
        this.currentProject = null;
        this.devices = [];
        this.connections = [];
        this.projects = [];
        
        // Mock data for development
        this.initMockData();
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.showView('devices');
        this.loadDevices();
        this.updateHeaderForView('devices');
    }
    
    initMockData() {
        // Sample devices data
        this.devices = [
            {
                id: 'DEV-2025-001',
                name: 'Sensor Temperatura #001',
                description: 'Sensor de temperatura para monitoreo ambiental',
                type: 'sensor',
                status: 'transmitting',
                project: 'Alpha',
                lastTransmission: '2 min',
                hasData: true,
                transmissionEnabled: true
            },
            {
                id: 'DEV-2025-002',
                name: 'Gateway Principal',
                description: 'Gateway principal para comunicaciones',
                type: 'gateway',
                status: 'disconnected',
                project: 'Beta',
                lastTransmission: '1 hora',
                hasData: false,
                transmissionEnabled: false
            },
            {
                id: 'DEV-2025-003',
                name: 'Cámara Seguridad #003',
                description: 'Cámara de seguridad con visión nocturna',
                type: 'camera',
                status: 'configuring',
                project: 'Alpha',
                lastTransmission: '5 min',
                hasData: true,
                transmissionEnabled: true
            },
            {
                id: 'DEV-2025-004',
                name: 'Monitor Ambiental',
                description: 'Monitor de condiciones ambientales',
                type: 'monitor',
                status: 'transmitting',
                project: 'Gamma',
                lastTransmission: '30 seg',
                hasData: true,
                transmissionEnabled: true
            }
        ];
        
        // Sample connections data
        this.connections = [
            {
                id: 'CONN-001',
                name: 'MQTT Producción',
                type: 'MQTT',
                host: 'mqtt.example.com',
                port: 1883,
                endpoint: '/sensors/data',
                description: 'Conexión MQTT para ambiente de producción',
                status: 'active',
                lastTest: '2024-01-15 10:30:00'
            },
            {
                id: 'CONN-002',
                name: 'API REST Principal',
                type: 'HTTPS',
                host: 'api.example.com',
                port: 443,
                endpoint: '/api/v1/devices',
                description: 'API REST para sincronización de datos',
                status: 'active',
                lastTest: '2024-01-15 09:15:00'
            },
            {
                id: 'CONN-003',
                name: 'MQTT Desarrollo',
                type: 'MQTT',
                host: 'dev-mqtt.example.com',
                port: 1883,
                endpoint: '/dev/sensors',
                description: 'Conexión MQTT para ambiente de desarrollo',
                status: 'inactive',
                lastTest: '2024-01-14 16:45:00'
            }
        ];
        
        // Sample projects data
        this.projects = [
            {
                id: 'PROJ-001',
                name: 'Proyecto Alpha',
                description: 'Sistema de monitoreo ambiental inteligente',
                devices: ['DEV-2025-001', 'DEV-2025-003'],
                status: 'active',
                created: '2024-01-01',
                transmissionEnabled: true
            },
            {
                id: 'PROJ-002',
                name: 'Proyecto Beta',
                description: 'Red de sensores IoT para agricultura',
                devices: ['DEV-2025-002'],
                status: 'active',
                created: '2024-01-10',
                transmissionEnabled: false
            },
            {
                id: 'PROJ-003',
                name: 'Proyecto Gamma',
                description: 'Sistema de seguridad perimetral',
                devices: ['DEV-2025-004'],
                status: 'active',
                created: '2024-01-05',
                transmissionEnabled: true
            }
        ];
    }
    
    setupNavigation() {
        // Setup sidebar navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const navId = e.currentTarget.id;
                let viewName = '';
                
                switch(navId) {
                    case 'nav-devices':
                        viewName = 'devices';
                        break;
                    case 'nav-connections':
                        viewName = 'connections';
                        break;
                    case 'nav-projects':
                        viewName = 'projects';
                        break;
                }
                
                if (viewName) {
                    this.showView(viewName);
                }
            });
        });
    }
    
    setupEventListeners() {
        // Device list events
        const btnNewDevice = document.getElementById('btn-new-device');
        if (btnNewDevice) {
            btnNewDevice.addEventListener('click', () => this.showCreateDeviceForm());
        }
        
        // Connection list events
        const btnNewConnection = document.getElementById('btn-new-connection');
        if (btnNewConnection) {
            btnNewConnection.addEventListener('click', () => this.showCreateConnectionForm());
        }
        
        // Project list events
        const btnNewProject = document.getElementById('btn-new-project');
        if (btnNewProject) {
            btnNewProject.addEventListener('click', () => this.showCreateProjectForm());
        }
        
        // Back buttons
        const backButtons = document.querySelectorAll('[id^="btn-back"]');
        backButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBackNavigation(e.target.id);
            });
        });
        
        // Search functionality
        this.setupSearchAndFilters();
        
        // Form submissions
        this.setupForms();
    }
    
    setupSearchAndFilters() {
        // Device search
        const deviceSearch = document.getElementById('device-search-input');
        if (deviceSearch) {
            deviceSearch.addEventListener('input', (e) => {
                this.filterDevices(e.target.value);
            });
        }
        
        // Connection search
        const connectionSearch = document.getElementById('connection-search-input');
        if (connectionSearch) {
            connectionSearch.addEventListener('input', (e) => {
                this.filterConnections(e.target.value);
            });
        }
        
        // Project search
        const projectSearch = document.getElementById('project-search-input');
        if (projectSearch) {
            projectSearch.addEventListener('input', (e) => {
                this.filterProjects(e.target.value);
            });
        }
        
        // Filters
        const filters = document.querySelectorAll('.filter-select');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }
    
    setupForms() {
        // Device form
        const deviceForm = document.getElementById('create-device-form');
        if (deviceForm) {
            deviceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateDevice();
            });
        }
        
        // Connection form
        const connectionForm = document.getElementById('connection-form');
        if (connectionForm) {
            connectionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateConnection();
            });
        }
        
        // Project form
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateProject();
            });
        }
    }
    
    showView(viewName) {
        // Update navigation state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById(`nav-${viewName}`).classList.add('active');
        
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(`${viewName}-list-view`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Update header
        this.updateHeaderForView(viewName);
        
        // Load data for the view
        switch(viewName) {
            case 'devices':
                this.loadDevices();
                break;
            case 'connections':
                this.loadConnections();
                break;
            case 'projects':
                this.loadProjects();
                break;
        }
        
        this.currentView = viewName;
    }
    
    updateHeaderForView(viewName) {
        const title = document.getElementById('main-title');
        const subtitle = document.getElementById('main-subtitle');
        
        const viewConfig = {
            devices: {
                title: 'Dispositivos',
                subtitle: 'Gestiona y configura tus dispositivos conectados'
            },
            connections: {
                title: 'Conexiones',
                subtitle: 'Gestiona las conexiones externas para transmisión de datos'
            },
            projects: {
                title: 'Proyectos',
                subtitle: 'Organiza y gestiona tus proyectos de IoT'
            }
        };
        
        const config = viewConfig[viewName] || viewConfig.devices;
        if (title) title.textContent = config.title;
        if (subtitle) subtitle.textContent = config.subtitle;
    }
    
    loadDevices() {
        const grid = document.getElementById('devices-grid');
        if (!grid) return;
        
        grid.innerHTML = this.devices.map(device => this.createDeviceCard(device)).join('');
        this.setupDeviceCardEvents();
    }
    
    loadConnections() {
        const grid = document.getElementById('connections-grid');
        if (!grid) return;
        
        grid.innerHTML = this.connections.map(conn => this.createConnectionCard(conn)).join('');
        this.setupConnectionCardEvents();
    }
    
    loadProjects() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        
        grid.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');
        this.setupProjectCardEvents();
    }
    
    createDeviceCard(device) {
        const iconMap = {
            sensor: '🌡️',
            gateway: '📶',
            camera: '🔒',
            monitor: '📊'
        };
        
        const statusMap = {
            transmitting: { text: 'Transmitiendo', class: 'transmitting' },
            disconnected: { text: 'Desconectado', class: 'disconnected' },
            configuring: { text: 'Configurando', class: 'configuring' }
        };
        
        const status = statusMap[device.status] || statusMap.disconnected;
        
        return `
            <div class="device-card" data-device-id="${device.id}">
                <div class="device-header">
                    <div class="device-icon ${device.type}">
                        ${iconMap[device.type] || '📱'}
                    </div>
                    <div class="device-actions">
                        <button class="action-btn" onclick="app.viewDevice('${device.id}')" title="Ver">📋</button>
                        <button class="action-btn" onclick="app.editDevice('${device.id}')" title="Editar">⚙️</button>
                        <button class="action-btn" onclick="app.deleteDevice('${device.id}')" title="Eliminar">🗑️</button>
                    </div>
                </div>
                
                <div class="device-info">
                    <h3>${device.name}</h3>
                    <div class="device-id">ID: ${device.id}</div>
                    
                    <div class="device-status">
                        <span class="status-dot ${status.class}"></span>
                        <span>${status.text}</span>
                    </div>
                    
                    <div class="project-tag">Proyecto ${device.project}</div>
                    
                    <div class="last-transmission">
                        Última transmisión: hace ${device.lastTransmission}
                    </div>
                </div>
            </div>
        `;
    }
    
    createConnectionCard(connection) {
        return `
            <div class="connection-card" data-connection-id="${connection.id}">
                <div class="connection-header">
                    <div class="connection-info">
                        <div class="connection-title">${connection.name}</div>
                        <div class="connection-type ${connection.type.toLowerCase()}">${connection.type}</div>
                        <div class="connection-info">${connection.host}:${connection.port}${connection.endpoint}</div>
                    </div>
                    <div class="connection-status ${connection.status}"></div>
                </div>
                
                <div class="connection-description">
                    ${connection.description || 'Sin descripción'}
                </div>
                
                <div class="connection-actions">
                    <button class="btn btn-sm btn-info" onclick="app.viewConnection('${connection.id}')">Ver</button>
                    <button class="btn btn-sm btn-secondary" onclick="app.editConnection('${connection.id}')">Editar</button>
                    <button class="btn btn-sm btn-success" onclick="app.testConnection('${connection.id}')">Probar</button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteConnection('${connection.id}')">Eliminar</button>
                </div>
            </div>
        `;
    }
    
    createProjectCard(project) {
        return `
            <div class="project-card" data-project-id="${project.id}">              
                <div class="device-info">
                    <h3>${project.name}</h3>
                    <div class="device-id">ID: ${project.id}</div>
                    
                    <div class="device-status">
                        <span class="status-dot ${project.status === 'active' ? 'transmitting' : 'disconnected'}"></span>
                        <span>${project.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    
                    <div class="project-tag">${project.devices.length} dispositivos</div>
                    
                    <div class="last-transmission">
                        Creado: ${project.created}
                    </div>
                    
                    <div class="device-description" style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                        ${project.description || 'Sin descripción'}
                    </div>
                    <div class="device-actions">
                        <button class="action-btn" onclick="app.viewProject('${project.id}')" title="Ver">📋</button>
                        <button class="action-btn" onclick="app.editProject('${project.id}')" title="Editar">⚙️</button>
                        <button class="action-btn" onclick="app.deleteProject('${project.id}')" title="Eliminar">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupDeviceCardEvents() {
        // Events are handled by onclick attributes in HTML
    }
    
    setupConnectionCardEvents() {
        // Events are handled by onclick attributes in HTML
    }
    
    setupProjectCardEvents() {
        // Events are handled by onclick attributes in HTML
    }
    
    // Device operations
    showCreateDeviceForm() {
        this.hideAllViews();
        document.getElementById('create-device-view').classList.add('active');
        this.updateHeaderForView('create-device');
    }
    
    viewDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;
        
        this.currentDevice = device;
        this.hideAllViews();
        document.getElementById('device-detail-view').classList.add('active');
        
        // Update device detail view
        document.getElementById('device-detail-title').textContent = device.name;
        this.populateDeviceInfo(device);
    }
    
    editDevice(deviceId) {
        this.showNotification('Función de edición en desarrollo', 'info');
    }
    
    deleteDevice(deviceId) {
        if (confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
            this.devices = this.devices.filter(d => d.id !== deviceId);
            this.loadDevices();
            this.showNotification('Dispositivo eliminado correctamente', 'success');
        }
    }
    
    handleCreateDevice() {
        const form = document.getElementById('create-device-form');
        const formData = new FormData(form);
        
        const newDevice = {
            id: `DEV-2025-${String(this.devices.length + 1).padStart(3, '0')}`,
            name: formData.get('name'),
            description: formData.get('description') || '',
            type: 'sensor',
            status: 'disconnected',
            project: 'Sin asignar',
            lastTransmission: 'Nunca',
            hasData: false,
            transmissionEnabled: false
        };
        
        this.devices.push(newDevice);
        this.showNotification('Dispositivo creado correctamente', 'success');
        this.showView('devices');
        form.reset();
    }
    
    // Connection operations
    showCreateConnectionForm() {
        this.hideAllViews();
        document.getElementById('connection-form-view').classList.add('active');
    }
    
    viewConnection(connectionId) {
        const connection = this.connections.find(c => c.id === connectionId);
        if (!connection) return;
        
        this.currentConnection = connection;
        this.hideAllViews();
        document.getElementById('connection-detail-view').classList.add('active');
        document.getElementById('connection-detail-title').textContent = connection.name;
    }
    
    editConnection(connectionId) {
        this.showNotification('Función de edición en desarrollo', 'info');
    }
    
    testConnection(connectionId) {
        this.showNotification('Probando conexión...', 'info');
        setTimeout(() => {
            this.showNotification('Conexión probada exitosamente', 'success');
        }, 2000);
    }
    
    deleteConnection(connectionId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta conexión?')) {
            this.connections = this.connections.filter(c => c.id !== connectionId);
            this.loadConnections();
            this.showNotification('Conexión eliminada correctamente', 'success');
        }
    }
    
    handleCreateConnection() {
        const form = document.getElementById('connection-form');
        const formData = new FormData(form);
        
        const newConnection = {
            id: `CONN-${String(this.connections.length + 1).padStart(3, '0')}`,
            name: formData.get('name'),
            type: formData.get('type'),
            host: formData.get('host'),
            port: formData.get('port') || (formData.get('type') === 'MQTT' ? 1883 : 443),
            endpoint: formData.get('endpoint') || '',
            description: formData.get('description') || '',
            status: 'active',
            lastTest: new Date().toLocaleString()
        };
        
        this.connections.push(newConnection);
        this.showNotification('Conexión creada correctamente', 'success');
        this.showView('connections');
        form.reset();
    }
    
    // Project operations
    showCreateProjectForm() {
        this.hideAllViews();
        document.getElementById('project-form-view').classList.add('active');
    }
    
    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        this.currentProject = project;
        this.hideAllViews();
        document.getElementById('project-detail-view').classList.add('active');
        document.getElementById('project-detail-title').textContent = project.name;
    }
    
    editProject(projectId) {
        this.showNotification('Función de edición en desarrollo', 'info');
    }
    
    deleteProject(projectId) {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.loadProjects();
            this.showNotification('Proyecto eliminado correctamente', 'success');
        }
    }
    
    handleCreateProject() {
        const form = document.getElementById('project-form');
        const formData = new FormData(form);
        
        const newProject = {
            id: `PROJ-${String(this.projects.length + 1).padStart(3, '0')}`,
            name: formData.get('name'),
            description: formData.get('description') || '',
            devices: [],
            status: 'active',
            created: new Date().toISOString().split('T')[0],
            transmissionEnabled: false
        };
        
        this.projects.push(newProject);
        this.showNotification('Proyecto creado correctamente', 'success');
        this.showView('projects');
        form.reset();
    }
    
    // Utility methods
    hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
    }
    
    handleBackNavigation(buttonId) {
        switch(buttonId) {
            case 'btn-back-to-list':
            case 'btn-back-from-detail':
                this.showView('devices');
                break;
            case 'btn-back-to-connections':
            case 'btn-back-from-connection-detail':
                this.showView('connections');
                break;
            case 'btn-back-to-projects':
            case 'btn-back-from-project-detail':
                this.showView('projects');
                break;
        }
    }
    
    populateDeviceInfo(device) {
        const infoContainer = document.getElementById('device-info');
        if (!infoContainer) return;
        
        infoContainer.innerHTML = `
            <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${device.name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ID:</span>
                <span class="info-value">${device.id}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tipo:</span>
                <span class="info-value">${device.type}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Estado:</span>
                <span class="info-value">${device.status}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Proyecto:</span>
                <span class="info-value">${device.project}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Descripción:</span>
                <span class="info-value">${device.description || 'Sin descripción'}</span>
            </div>
        `;
    }
    
    filterDevices(searchTerm) {
        const filteredDevices = this.devices.filter(device =>
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const grid = document.getElementById('devices-grid');
        if (grid) {
            grid.innerHTML = filteredDevices.map(device => this.createDeviceCard(device)).join('');
        }
    }
    
    filterConnections(searchTerm) {
        const filteredConnections = this.connections.filter(conn =>
            conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conn.host.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const grid = document.getElementById('connections-grid');
        if (grid) {
            grid.innerHTML = filteredConnections.map(conn => this.createConnectionCard(conn)).join('');
        }
    }
    
    filterProjects(searchTerm) {
        const filteredProjects = this.projects.filter(project =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const grid = document.getElementById('projects-grid');
        if (grid) {
            grid.innerHTML = filteredProjects.map(project => this.createProjectCard(project)).join('');
        }
    }
    
    applyFilters() {
        // Implementation for filter functionality
        console.log('Applying filters...');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const container = document.getElementById('notifications') || document.body;
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global functions for compatibility
function toggleView(view) {
    console.log('Toggle view:', view);
}

function showNotification(message, type) {
    if (window.app) {
        window.app.showNotification(message, type);
    }
}

// Initialize the application
let app = null;

document.addEventListener('DOMContentLoaded', function() {
    app = new DeviceSimulatorApp();
    window.app = app; // Make it globally accessible
    
    console.log('Device Simulator App initialized');
});
