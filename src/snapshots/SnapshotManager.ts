import { EffectSnapshot, EffectState } from '../types';
import { AudioEngine } from '../core/AudioEngine';

export class SnapshotManager {
  private snapshots: Map<string, EffectSnapshot> = new Map();
  private engine: AudioEngine;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  captureSnapshot(name: string): EffectSnapshot {
    const state: Record<string, EffectState> = {};

    this.engine['effectChain'].forEach(effect => {
      const parameters: Record<string, number> = {};
      effect.getParameters().forEach((param, name) => {
        parameters[name] = param.value;
      });

      state[effect.id] = {
        effectId: effect.id,
        effectType: effect.name,
        enabled: effect.enabled,
        parameters
      };
    });

    const snapshot: EffectSnapshot = {
      id: this.generateId(),
      name,
      timestamp: new Date(),
      state
    };

    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  recallSnapshot(id: string, crossfadeTime: number = 0): void {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) return;

    if (crossfadeTime > 0) {
      this.crossfadeToSnapshot(snapshot, crossfadeTime);
    } else {
      this.applySnapshotImmediately(snapshot);
    }
  }

  private applySnapshotImmediately(snapshot: EffectSnapshot): void {
    Object.entries(snapshot.state).forEach(([effectId, effectState]) => {
      const effect = this.engine.getEffect(effectId);
      if (!effect) return;

      effect.enabled = effectState.enabled;

      Object.entries(effectState.parameters).forEach(([paramName, value]) => {
        effect.setParameter(paramName, value);
      });
    });
  }

  private crossfadeToSnapshot(snapshot: EffectSnapshot, duration: number): void {
    const startStates = new Map<string, Record<string, number>>();

    this.engine['effectChain'].forEach(effect => {
      const params: Record<string, number> = {};
      effect.getParameters().forEach((param, name) => {
        params[name] = param.value;
      });
      startStates.set(effect.id, params);
    });

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / (duration * 1000));

      Object.entries(snapshot.state).forEach(([effectId, targetState]) => {
        const effect = this.engine.getEffect(effectId);
        if (!effect) return;

        const startParams = startStates.get(effectId);
        if (!startParams) return;

        Object.entries(targetState.parameters).forEach(([paramName, targetValue]) => {
          const startValue = startParams[paramName] || 0;
          const currentValue = startValue + (targetValue - startValue) * progress;
          effect.setParameter(paramName, currentValue);
        });
      });

      if (progress >= 1) {
        clearInterval(interval);
        this.applySnapshotImmediately(snapshot);
      }
    }, 16);
  }

  deleteSnapshot(id: string): boolean {
    return this.snapshots.delete(id);
  }

  renameSnapshot(id: string, newName: string): void {
    const snapshot = this.snapshots.get(id);
    if (snapshot) {
      snapshot.name = newName;
    }
  }

  listSnapshots(): EffectSnapshot[] {
    return Array.from(this.snapshots.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  exportSnapshot(id: string): string {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) throw new Error(`Snapshot ${id} not found`);
    return JSON.stringify(snapshot, null, 2);
  }

  importSnapshot(data: string): EffectSnapshot {
    const snapshot = JSON.parse(data) as EffectSnapshot;
    snapshot.id = this.generateId();
    snapshot.timestamp = new Date();
    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  private generateId(): string {
    return `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
