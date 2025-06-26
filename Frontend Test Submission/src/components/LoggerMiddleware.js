import { logMessage } from '../api';

// stack: 'frontend' | 'backend'
// level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
// package: 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
// message: string
export const logEvent = async (stack, level, pkg, message) => {
  const log = {
    stack,
    level,
    package: pkg,
    message,
  };
  try {
    await logMessage(log);
  } catch (e) {
    // Optionally handle logging errors silently
  }
};
