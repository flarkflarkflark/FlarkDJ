/**
 * Connection Manager - Manages audio routing between effects
 */

export class ConnectionManager {
  constructor(pedalboard, audioEngine) {
    this.pedalboard = pedalboard;
    this.audioEngine = audioEngine;

    this.connections = [];
    this.cableElements = new Map();

    this.isDrawingCable = false;
    this.tempCable = null;
    this.sourceConnector = null;

    this.setupConnectorHandlers();
  }

  setupConnectorHandlers() {
    // Use event delegation
    const pedalboardElement = document.getElementById('pedalboard');

    pedalboardElement.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('connector')) {
        this.onConnectorMouseDown(e);
      }
    });

    pedalboardElement.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });

    pedalboardElement.addEventListener('mouseup', (e) => {
      this.onMouseUp(e);
    });

    // Listen for effect moves to update cables
    pedalboardElement.addEventListener('effect-move', (e) => {
      this.updateCablesForEffect(e.detail.id);
    });

    // Listen for effect deletions
    pedalboardElement.addEventListener('effect-delete', (e) => {
      this.removeEffect(e.detail.id);
    });
  }

  onConnectorMouseDown(e) {
    e.stopPropagation();

    const connector = e.target;
    const effectId = connector.dataset.effectId;
    const connectorType = connector.dataset.connectorType;

    // Only allow starting from output connectors
    if (connectorType !== 'output') {
      return;
    }

    this.isDrawingCable = true;
    this.sourceConnector = { effectId, connector };

    // Create temporary cable
    const svg = document.getElementById('cableLayer');
    const effectPedal = this.pedalboard.getEffect(effectId);
    const startPos = effectPedal.getConnectorPosition('output');

    this.tempCable = this.createCableElement(startPos.x, startPos.y, startPos.x, startPos.y);
    svg.appendChild(this.tempCable);

    // Highlight valid targets
    this.highlightValidTargets(effectId);
  }

  onMouseMove(e) {
    if (!this.isDrawingCable || !this.tempCable) return;

    const rect = document.getElementById('pedalboard').getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const effectPedal = this.pedalboard.getEffect(this.sourceConnector.effectId);
    const startPos = effectPedal.getConnectorPosition('output');

    this.updateCablePosition(this.tempCable, startPos.x, startPos.y, x, y);
  }

  onMouseUp(e) {
    if (!this.isDrawingCable) return;

    // Check if dropped on a valid input connector
    const target = e.target;

    if (target.classList.contains('connector') && target.dataset.connectorType === 'input') {
      const targetEffectId = target.dataset.effectId;

      // Don't allow self-connection
      if (targetEffectId !== this.sourceConnector.effectId) {
        this.createConnection(this.sourceConnector.effectId, targetEffectId);
      }
    }

    // Clean up
    if (this.tempCable) {
      this.tempCable.remove();
      this.tempCable = null;
    }

    this.isDrawingCable = false;
    this.sourceConnector = null;

    // Remove highlights
    this.removeHighlights();
  }

  createConnection(sourceId, targetId) {
    // Check if connection already exists
    const exists = this.connections.some(
      conn => conn.source === sourceId && conn.target === targetId
    );

    if (exists) {
      console.log('Connection already exists');
      return;
    }

    // Create audio connection
    const sourceEffect = this.audioEngine.getEffect(sourceId);
    const targetEffect = this.audioEngine.getEffect(targetId);

    if (!sourceEffect || !targetEffect) {
      console.error('Effect not found');
      return;
    }

    sourceEffect.getOutputNode().connect(targetEffect.getInputNode());

    // Create visual cable
    const sourcePedal = this.pedalboard.getEffect(sourceId);
    const targetPedal = this.pedalboard.getEffect(targetId);

    const startPos = sourcePedal.getConnectorPosition('output');
    const endPos = targetPedal.getConnectorPosition('input');

    const cable = this.createCableElement(startPos.x, startPos.y, endPos.x, endPos.y);
    document.getElementById('cableLayer').appendChild(cable);

    // Store connection
    const connectionId = `${sourceId}->${targetId}`;
    this.connections.push({ source: sourceId, target: targetId, id: connectionId });
    this.cableElements.set(connectionId, cable);

    // Mark connectors as connected
    sourcePedal.getElement().querySelector('.connector.output').classList.add('connected');
    targetPedal.getElement().querySelector('.connector.input').classList.add('connected');

    console.log(`✅ Connected: ${sourceId} -> ${targetId}`);
  }

  createCableElement(x1, y1, x2, y2) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    const dx = x2 - x1;
    const tension = Math.abs(dx) * 0.5;

    const pathData = `M ${x1},${y1} C ${x1 + tension},${y1} ${x2 - tension},${y2} ${x2},${y2}`;

    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#ff8c42');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('fill', 'none');
    path.setAttribute('filter', 'url(#cableShadow)');
    path.style.pointerEvents = 'none';

    return path;
  }

  updateCablePosition(cable, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const tension = Math.abs(dx) * 0.5;

    const pathData = `M ${x1},${y1} C ${x1 + tension},${y1} ${x2 - tension},${y2} ${x2},${y2}`;
    cable.setAttribute('d', pathData);
  }

  updateCablesForEffect(effectId) {
    // Update all cables connected to this effect
    this.connections.forEach(conn => {
      if (conn.source === effectId || conn.target === targetId) {
        const cable = this.cableElements.get(conn.id);
        if (cable) {
          const sourcePedal = this.pedalboard.getEffect(conn.source);
          const targetPedal = this.pedalboard.getEffect(conn.target);

          const startPos = sourcePedal.getConnectorPosition('output');
          const endPos = targetPedal.getConnectorPosition('input');

          this.updateCablePosition(cable, startPos.x, startPos.y, endPos.x, endPos.y);
        }
      }
    });
  }

  updateAllCables() {
    this.connections.forEach(conn => {
      const cable = this.cableElements.get(conn.id);
      if (cable) {
        const sourcePedal = this.pedalboard.getEffect(conn.source);
        const targetPedal = this.pedalboard.getEffect(conn.target);

        if (sourcePedal && targetPedal) {
          const startPos = sourcePedal.getConnectorPosition('output');
          const endPos = targetPedal.getConnectorPosition('input');

          this.updateCablePosition(cable, startPos.x, startPos.y, endPos.x, endPos.y);
        }
      }
    });
  }

  highlightValidTargets(sourceId) {
    const allEffects = this.pedalboard.getAllEffects();

    allEffects.forEach(effect => {
      if (effect.id !== sourceId) {
        effect.getElement().querySelector('.connector.input').classList.add('highlight');
      }
    });
  }

  removeHighlights() {
    document.querySelectorAll('.connector.highlight').forEach(connector => {
      connector.classList.remove('highlight');
    });
  }

  removeEffect(effectId) {
    // Remove all connections involving this effect
    const connectionsToRemove = this.connections.filter(
      conn => conn.source === effectId || conn.target === effectId
    );

    connectionsToRemove.forEach(conn => {
      this.disconnectEffects(conn.source, conn.target);
    });

    // Remove the effect from pedalboard
    this.pedalboard.removeEffect(effectId);

    // Unregister from audio engine
    this.audioEngine.unregisterEffect(effectId);
  }

  disconnectEffects(sourceId, targetId) {
    // Disconnect audio
    const sourceEffect = this.audioEngine.getEffect(sourceId);
    const targetEffect = this.audioEngine.getEffect(targetId);

    if (sourceEffect && targetEffect) {
      try {
        sourceEffect.getOutputNode().disconnect(targetEffect.getInputNode());
      } catch (e) {
        // Already disconnected
      }
    }

    // Remove visual cable
    const connectionId = `${sourceId}->${targetId}`;
    const cable = this.cableElements.get(connectionId);
    if (cable) {
      cable.remove();
      this.cableElements.delete(connectionId);
    }

    // Remove from connections array
    this.connections = this.connections.filter(conn => conn.id !== connectionId);
  }

  clearAll() {
    // Disconnect all audio
    this.connections.forEach(conn => {
      const sourceEffect = this.audioEngine.getEffect(conn.source);
      const targetEffect = this.audioEngine.getEffect(conn.target);

      if (sourceEffect && targetEffect) {
        try {
          sourceEffect.getOutputNode().disconnect(targetEffect.getInputNode());
        } catch (e) {}
      }
    });

    // Remove all cables
    this.cableElements.forEach(cable => cable.remove());
    this.cableElements.clear();
    this.connections = [];
  }

  serialize() {
    return this.connections.map(conn => ({
      source: conn.source,
      target: conn.target
    }));
  }

  deserialize(data) {
    data.forEach(conn => {
      this.createConnection(conn.source, conn.target);
    });
  }
}
