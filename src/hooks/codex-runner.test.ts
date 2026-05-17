import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PENDING_GATES,
  detectWorkflow,
  parseExplicitGatePasses,
  updateWorkflowState,
  type RunnerState,
} from './codex-runner.js';

function makeState(): RunnerState {
  return {
    runnerVersion: 2,
    eventCounts: {},
    lastEvent: '',
    lastEventAt: '',
    lastCwd: '',
    stateDir: '.codex/brainbrew',
  };
}

function startWorkflow(state: RunnerState, now = '2026-01-01T00:00:00.000Z'): void {
  updateWorkflowState(state, 'UserPromptSubmit', { prompt: '/brainbrew:workflow develop' }, now);
}

describe('detectWorkflow', () => {
  it('matches the explicit /brainbrew:workflow slash form', () => {
    expect(detectWorkflow('/brainbrew:workflow develop')).toBe('develop');
  });

  it('matches the /brainbrew_workflow underscore form', () => {
    expect(detectWorkflow('please run /brainbrew_chain-run review now')).toBe('review');
  });

  it('matches the CLI-like brainbrew workflow form', () => {
    expect(detectWorkflow('brainbrew codex workflow docs')).toBe('docs');
  });

  it('matches the template-name form', () => {
    expect(detectWorkflow('start the devops workflow please')).toBe('devops');
  });

  it('falls back to "unspecified" when brainbrew + workflow keyword appear without a name', () => {
    expect(detectWorkflow('can we kick off a brainbrew workflow?')).toBe('unspecified');
  });

  it('returns null when no marker is present', () => {
    expect(detectWorkflow('hello world, please refactor this file')).toBeNull();
  });
});

describe('parseExplicitGatePasses', () => {
  it('parses the /brainbrew:gate-pass slash form', () => {
    const passes = parseExplicitGatePasses('/brainbrew:gate-pass plan-review');
    expect([...passes]).toEqual(['plan-review']);
  });

  it('parses the brainbrew gate-pass CLI-like form', () => {
    const passes = parseExplicitGatePasses('brainbrew gate-pass code-review');
    expect([...passes]).toEqual(['code-review']);
  });

  it('parses multiple gate-passes in one prompt', () => {
    const passes = parseExplicitGatePasses('/brainbrew:gate-pass plan-review and /brainbrew:gate-pass test');
    expect(passes.has('plan-review')).toBe(true);
    expect(passes.has('test')).toBe(true);
    expect(passes.size).toBe(2);
  });

  it('ignores unknown gate names', () => {
    const passes = parseExplicitGatePasses('/brainbrew:gate-pass bogus-gate');
    expect(passes.size).toBe(0);
  });

  it('returns an empty set for an empty prompt', () => {
    expect(parseExplicitGatePasses('').size).toBe(0);
  });
});

describe('updateWorkflowState — gate handling', () => {
  it('clears a gate when an explicit /brainbrew:gate-pass is sent', () => {
    const state = makeState();
    startWorkflow(state);
    updateWorkflowState(state, 'UserPromptSubmit', { prompt: '/brainbrew:gate-pass plan-review' }, '2026-01-01T00:01:00.000Z');
    expect(state.activeWorkflow?.pendingGates).not.toContain('plan-review');
    expect(state.activeWorkflow?.pendingGates).toContain('test');
  });

  it('ignores an unknown gate name in /brainbrew:gate-pass', () => {
    const state = makeState();
    startWorkflow(state);
    const before = [...(state.activeWorkflow?.pendingGates ?? [])];
    updateWorkflowState(state, 'UserPromptSubmit', { prompt: '/brainbrew:gate-pass mystery' }, '2026-01-01T00:02:00.000Z');
    expect(state.activeWorkflow?.pendingGates).toEqual(before);
  });

  it('keeps the English-marker fallback working ("tests pass" clears test gate)', () => {
    const state = makeState();
    startWorkflow(state);
    updateWorkflowState(state, 'UserPromptSubmit', { prompt: 'great, tests pass on main' }, '2026-01-01T00:03:00.000Z');
    expect(state.activeWorkflow?.pendingGates).not.toContain('test');
    expect(state.activeWorkflow?.pendingGates).toContain('plan-review');
  });

  it('false-positive guard: /brainbrew:gate-pass test clears only test, not other gates', () => {
    const state = makeState();
    startWorkflow(state);
    updateWorkflowState(state, 'UserPromptSubmit', { prompt: '/brainbrew:gate-pass test' }, '2026-01-01T00:04:00.000Z');
    const pending = state.activeWorkflow?.pendingGates ?? [];
    expect(pending).not.toContain('test');
    // Every other default gate is still pending.
    for (const gate of DEFAULT_PENDING_GATES) {
      if (gate !== 'test') expect(pending).toContain(gate);
    }
  });

  it('does not run English-marker heuristics when explicit gate-pass syntax is present', () => {
    const state = makeState();
    startWorkflow(state);
    updateWorkflowState(
      state,
      'UserPromptSubmit',
      { prompt: '/brainbrew:gate-pass test plan approved code review passed security scan passed' },
      '2026-01-01T00:04:30.000Z',
    );
    expect(state.activeWorkflow?.pendingGates).toEqual(['plan-review', 'code-review', 'security-review']);
  });

  it('clears all four gates one by one and marks the workflow completed', () => {
    const state = makeState();
    startWorkflow(state);
    for (const gate of DEFAULT_PENDING_GATES) {
      updateWorkflowState(state, 'UserPromptSubmit', { prompt: `/brainbrew:gate-pass ${gate}` }, '2026-01-01T00:05:00.000Z');
    }
    expect(state.activeWorkflow?.status).toBe('completed');
    expect(state.activeWorkflow?.pendingGates).toEqual([]);
  });
});
