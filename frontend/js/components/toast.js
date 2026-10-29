/**
 * CodeRoyale — Toast Notification Component
 */

export class Toast {
  static show(title, message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '⚡',
      error: '⚠️',
      warning: '🔱',
      info: '💠'
    };

    toast.innerHTML = `
      <div style="font-size: 1.25rem;">${icons[type] || '💠'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static success(title, msg) { this.show(title, msg, 'success'); }
  static error(title, msg) { this.show(title, msg, 'error'); }
  static warning(title, msg) { this.show(title, msg, 'warning'); }
  static info(title, msg) { this.show(title, msg, 'info'); }
}
