// js/logger.js

/**
 * Logs an error to the console with module and function context.
 * @param {string} moduleName - The name of the module where the error occurred.
 * @param {string} functionName - The name of the function where the error occurred.
 * @param {Error} error - The error object.
 */
export function logError(moduleName, functionName, error) {
  const timestamp = new Date().toISOString();
  console.error(
    `[${timestamp}] [${moduleName}] in ${functionName}():`,
    error.message,
    error.stack ? `\nStack: ${error.stack}` : ''
  );
  // Future: Could send this to a server or a more sophisticated client-side logging mechanism.
}

/**
 * Logs a general message to the console.
 * @param {string} message - The message to log.
 * @param {'info' | 'warn' | 'debug'} level - Log level.
 * @param {string} [moduleName] - Optional module name.
 */
export function logMessage(message, level = 'info', moduleName) {
  const timestamp = new Date().toISOString();
  const prefix = moduleName ? `[${timestamp}] [${moduleName}]` : `[${timestamp}]`;
  
  switch (level) {
    case 'warn':
      console.warn(`${prefix} WARN: ${message}`);
      break;
    case 'debug':
      console.debug(`${prefix} DEBUG: ${message}`);
      break;
    case 'info':
    default:
      console.log(`${prefix} INFO: ${message}`);
      break;
  }
}
