import { SnapshotManager } from './SnapshotManager';
import { AudioEngine } from '../core/AudioEngine';
import { FilterEffect } from '../effects/FilterEffect';

describe('SnapshotManager', () => {
  let manager: SnapshotManager;
  let engine: AudioEngine;

  beforeEach(() => {
    engine = new AudioEngine(44100);
    manager = new SnapshotManager(engine);
  });

  test('should capture snapshot', () => {
    const effect = new FilterEffect('filter1');
    effect.setParameter('cutoff', 5000);
    engine.addEffect(effect);

    const snapshot = manager.captureSnapshot('Test Snapshot');
    expect(snapshot.name).toBe('Test Snapshot');
    expect(snapshot.state['filter1'].parameters.cutoff).toBe(5000);
  });

  test('should recall snapshot immediately', () => {
    const effect = new FilterEffect('filter1');
    effect.setParameter('cutoff', 1000);
    engine.addEffect(effect);

    const snapshot = manager.captureSnapshot('Test');
    effect.setParameter('cutoff', 5000);

    manager.recallSnapshot(snapshot.id);
    expect(effect.getParameter('cutoff')).toBe(1000);
  });

  test('should delete snapshot', () => {
    const snapshot = manager.captureSnapshot('Test');
    const deleted = manager.deleteSnapshot(snapshot.id);
    expect(deleted).toBe(true);
  });

  test('should rename snapshot', () => {
    const snapshot = manager.captureSnapshot('Original');
    manager.renameSnapshot(snapshot.id, 'Renamed');

    const list = manager.listSnapshots();
    expect(list[0].name).toBe('Renamed');
  });

  test('should list snapshots sorted by timestamp', () => {
    manager.captureSnapshot('First');
    setTimeout(() => {
      manager.captureSnapshot('Second');
    }, 10);

    const list = manager.listSnapshots();
    expect(list.length).toBe(2);
  });

  test('should export snapshot', () => {
    const snapshot = manager.captureSnapshot('Export Test');
    const exported = manager.exportSnapshot(snapshot.id);
    expect(exported).toContain('Export Test');
  });

  test('should import snapshot', () => {
    const effect = new FilterEffect('filter1');
    effect.setParameter('cutoff', 3000);
    engine.addEffect(effect);

    const snapshot = manager.captureSnapshot('Original');
    const exported = manager.exportSnapshot(snapshot.id);

    const imported = manager.importSnapshot(exported);
    expect(imported.name).toBe('Original');
    expect(imported.id).not.toBe(snapshot.id);
  });

  test('should preserve effect enabled state', () => {
    const effect = new FilterEffect('filter1');
    effect.enabled = false;
    engine.addEffect(effect);

    const snapshot = manager.captureSnapshot('Test');
    expect(snapshot.state['filter1'].enabled).toBe(false);
  });
});
