/**
 * Context Menu Handler
 */

export class ContextMenuHandler {
  constructor(pedalboard, connectionManager) {
    this.pedalboard = pedalboard;
    this.connectionManager = connectionManager;
    this.contextMenu = document.getElementById('contextMenu');
    this.currentTarget = null;

    this.setupHandlers();
  }

  setupHandlers() {
    // Right-click on effects
    document.getElementById('pedalboard').addEventListener('contextmenu', (e) => {
      if (e.target.closest('.effect-pedal')) {
        e.preventDefault();
        this.showMenu(e, e.target.closest('.effect-pedal'));
      }
    });

    // Click menu items
    this.contextMenu.addEventListener('click', (e) => {
      const action = e.target.closest('.context-menu-item')?.dataset.action;
      if (action) {
        this.handleAction(action);
      }
    });

    // Close menu on click outside
    document.addEventListener('click', () => {
      this.hideMenu();
    });
  }

  showMenu(e, target) {
    this.currentTarget = target;
    this.contextMenu.style.left = `${e.clientX}px`;
    this.contextMenu.style.top = `${e.clientY}px`;
    this.contextMenu.classList.remove('hidden');
  }

  hideMenu() {
    this.contextMenu.classList.add('hidden');
    this.currentTarget = null;
  }

  handleAction(action) {
    if (!this.currentTarget) return;

    const effectId = this.currentTarget.id;

    switch (action) {
      case 'delete':
        this.connectionManager.removeEffect(effectId);
        break;

      case 'disconnect':
        // Disconnect all connections for this effect
        const connections = this.connectionManager.connections.filter(
          conn => conn.source === effectId || conn.target === effectId
        );
        connections.forEach(conn => {
          this.connectionManager.disconnectEffects(conn.source, conn.target);
        });
        break;
    }

    this.hideMenu();
  }
}
