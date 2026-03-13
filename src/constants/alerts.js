export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const ALERT_EVENT_TYPES = {
  TAB_SWITCH: 'tab_switch',
  WINDOW_BLUR: 'window_blur',
  FULLSCREEN_EXIT: 'fullscreen_exit',
  DUPLICATE_SESSION: 'duplicate_session',
  SUSPICIOUS_INACTIVITY: 'suspicious_inactivity',
  CONNECTION_LOSS: 'connection_loss',
  REJOIN: 'rejoin',
  REPEATED_WARNING: 'repeated_warning',
  COPY_ATTEMPT: 'copy_attempt',
  PASTE_ATTEMPT: 'paste_attempt',
  RIGHT_CLICK: 'right_click',
  EXAM_LEAVE_ATTEMPT: 'exam_leave_attempt',
};

export const ALERT_EVENT_LABELS = {
  [ALERT_EVENT_TYPES.TAB_SWITCH]: 'Tab switch',
  [ALERT_EVENT_TYPES.WINDOW_BLUR]: 'Window blur',
  [ALERT_EVENT_TYPES.FULLSCREEN_EXIT]: 'Fullscreen exit',
  [ALERT_EVENT_TYPES.DUPLICATE_SESSION]: 'Duplicate session',
  [ALERT_EVENT_TYPES.SUSPICIOUS_INACTIVITY]: 'Suspicious inactivity',
  [ALERT_EVENT_TYPES.CONNECTION_LOSS]: 'Connection loss',
  [ALERT_EVENT_TYPES.REJOIN]: 'Rejoin',
  [ALERT_EVENT_TYPES.REPEATED_WARNING]: 'Repeated warning',
  [ALERT_EVENT_TYPES.COPY_ATTEMPT]: 'Copy attempt',
  [ALERT_EVENT_TYPES.PASTE_ATTEMPT]: 'Paste attempt',
  [ALERT_EVENT_TYPES.RIGHT_CLICK]: 'Right-click',
  [ALERT_EVENT_TYPES.EXAM_LEAVE_ATTEMPT]: 'Exam leave attempt',
};
