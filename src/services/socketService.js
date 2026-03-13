/**
 * Socket service abstraction.
 * In this phase: mock implementation with no real server.
 * Structure ready for future backend socket.io integration.
 */

let mockListeners = {};
let connectionStatus = 'disconnected';
let connectionStatusListeners = new Set();

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ALERT: 'alert',
  SESSION_UPDATE: 'session_update',
  STUDENT_STATUS: 'student_status',
  DASHBOARD_STATS: 'dashboard_stats',
};

function getConnectionStatus() {
  return connectionStatus;
}

function setConnectionStatus(status) {
  if (connectionStatus === status) return;
  connectionStatus = status;
  connectionStatusListeners.forEach((fn) => fn(status));
}

function emitMock(event, data) {
  (mockListeners[event] || []).forEach((fn) => fn(data));
}

export const socketService = {
  connect() {
    setConnectionStatus('connecting');
    setTimeout(() => setConnectionStatus('connected'), 500);
    return this;
  },

  disconnect() {
    setConnectionStatus('disconnected');
    return this;
  },

  on(event, callback) {
    if (!mockListeners[event]) mockListeners[event] = [];
    mockListeners[event].push(callback);
    return () => this.off(event, callback);
  },

  off(event, callback) {
    if (!mockListeners[event]) return this;
    mockListeners[event] = mockListeners[event].filter((fn) => fn !== callback);
    return this;
  },

  emit(event, data) {
    emitMock(event, data);
    return this;
  },

  getConnectionStatus,
  onConnectionStatusChange(callback) {
    connectionStatusListeners.add(callback);
    callback(connectionStatus);
    return () => connectionStatusListeners.delete(callback);
  },
};

/**
 * Mock helper: publish a mock event (for simulating real-time updates in UI).
 */
export function publishMockEvent(event, data) {
  emitMock(event, data);
}
