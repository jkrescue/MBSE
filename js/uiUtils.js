// js/uiUtils.js

const GENERIC_MODAL_ID = 'genericModal';
const LOADING_OVERLAY_ID = 'loadingOverlay';
const NOTIFICATION_CONTAINER_ID = 'notificationContainer';

/**
 * Shows a generic modal with the given title, body content (HTML string or Node), and footer buttons.
 * @param {string} title - The title of the modal.
 * @param {HTMLElement | string} bodyContent - HTML string or DOM Node for the modal body.
 * @param {Array<{text: string, class: string, onClick: function}>} buttons - Array of button objects for the footer.
 */
export function showGenericModal(title, bodyContent, buttons = []) {
  const modal = document.getElementById(GENERIC_MODAL_ID);
  const modalTitle = document.getElementById('genericModalTitle');
  const modalBody = document.getElementById('genericModalBody');
  const modalFooter = document.getElementById('genericModalFooter');
  const closeButton = document.getElementById('genericModalCloseButton');

  if (!modal || !modalTitle || !modalBody || !modalFooter) {
    console.error('Generic modal elements not found in DOM.');
    return;
  }

  modalTitle.textContent = title;

  modalBody.innerHTML = ''; // Clear previous content
  if (typeof bodyContent === 'string') {
    modalBody.innerHTML = bodyContent;
  } else if (bodyContent instanceof Node) {
    modalBody.appendChild(bodyContent);
  }

  modalFooter.innerHTML = ''; // Clear previous buttons
  buttons.forEach(btnInfo => {
    const button = document.createElement('button');
    button.textContent = btnInfo.text;
    button.className = btnInfo.class || 'px-4 py-2 rounded transition-colors';
    if (btnInfo.type === 'submit') button.type = 'submit';
    if (btnInfo.form) button.setAttribute('form', btnInfo.form); // For submitting a specific form
    button.addEventListener('click', (e) => {
      if (btnInfo.onClick) btnInfo.onClick(e);
      // if (!btnInfo.preventClose) hideGenericModal(); // Optional: auto-close unless specified
    });
    modalFooter.appendChild(button);
  });
  
  const closeModalHandler = () => hideGenericModal();
  closeButton.onclick = closeModalHandler; // Re-assign to ensure it's fresh

  // Close modal when clicking outside
  modal.onclick = (event) => {
    if (event.target === modal) {
       closeModalHandler();
    }
  };
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function hideGenericModal() {
  const modal = document.getElementById(GENERIC_MODAL_ID);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    // Clean up to prevent event listener buildup if elements inside are recreated often
    document.getElementById('genericModalBody').innerHTML = '';
    document.getElementById('genericModalFooter').innerHTML = '';
  }
}

/**
 * Creates a confirmation dialog.
 * @param {string} title - The title of the confirmation.
 * @param {string} message - The confirmation message.
 * @param {function} onConfirm - Callback function if confirmed.
 * @param {function} [onCancel] - Callback function if cancelled.
 */
export function createConfirmationModal(title, message, onConfirm, onCancel) {
  const body = document.createElement('p');
  body.textContent = message;

  const buttons = [
    {
      text: '取消',
      class: 'bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors',
      onClick: () => {
        if (onCancel) onCancel();
        hideGenericModal();
      }
    },
    {
      text: '确定',
      class: 'bg-danger hover:bg-red-700 text-white px-4 py-2 rounded transition-colors',
      onClick: () => {
        onConfirm();
        hideGenericModal();
      }
    }
  ];
  showGenericModal(title, body, buttons);
}

/**
 * Creates a prompt dialog.
 * @param {string} title - The title of the prompt.
 * @param {string} labelText - Label for the input field.
 * @param {string} initialValue - Initial value for the input.
 * @param {function(string)} onSave - Callback with the input value.
 * @param {function} [onCancel] - Callback if cancelled.
 * @param {string} inputType - Type of input (e.g. 'text', 'number').
 */
export function createPromptModal(title, labelText, initialValue, onSave, onCancel, inputType = 'text') {
  const formId = `promptForm-${Date.now()}`;
  const inputId = `promptInput-${Date.now()}`;

  const bodyFragment = document.createDocumentFragment();
  
  const form = document.createElement('form');
  form.id = formId;
  form.addEventListener('submit', (e) => e.preventDefault()); // Prevent actual form submission

  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.className = 'block text-sm font-medium text-gray-700 mb-1';
  label.textContent = labelText;
  form.appendChild(label);

  const input = document.createElement('input');
  input.type = inputType;
  input.id = inputId;
  input.className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary';
  input.value = initialValue;
  form.appendChild(input);
  
  bodyFragment.appendChild(form);

  const buttons = [
    {
      text: '取消',
      class: 'bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors',
      onClick: () => {
        if (onCancel) onCancel();
        hideGenericModal();
      }
    },
    {
      text: '保存',
      class: 'bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors',
      onClick: () => {
        onSave(document.getElementById(inputId).value);
        hideGenericModal();
      }
    }
  ];
  showGenericModal(title, bodyFragment, buttons);
  document.getElementById(inputId).focus(); // Focus the input field
}


export function showLoading() {
  const overlay = document.getElementById(LOADING_OVERLAY_ID);
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }
}

export function hideLoading() {
  const overlay = document.getElementById(LOADING_OVERLAY_ID);
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }
}

/**
 * Shows a notification message.
 * @param {string} message - The message to display.
 * @param {'success' | 'error' | 'info' | 'warning'} type - Type of notification.
 * @param {number} duration - Duration in ms before auto-hiding.
 */
export function showNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById(NOTIFICATION_CONTAINER_ID);
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification notification-${type} notification-enter`;
  notification.textContent = message;

  container.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.classList.add('notification-enter-active');
  });

  setTimeout(() => {
    notification.classList.remove('notification-enter', 'notification-enter-active');
    notification.classList.add('notification-exit');
    requestAnimationFrame(() => {
        notification.classList.add('notification-exit-active');
    });
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification);
      }
    }, 500); // Corresponds to animation duration
  }, duration);
}

export function displayFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

export function clearFieldError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}
