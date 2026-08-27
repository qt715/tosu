import { ClientType } from '@tosu/common';
import assert from 'node:assert/strict';
import test from 'node:test';

import type { AbstractInstance } from '@/instances';
import { Gameplay } from '@/states/gameplay';
import type { KeyOverlayButton } from '@/states/types';

test('tracks press and release edges at the sampled play time', () => {
    const global = { playTime: 160 };
    let buttons: KeyOverlayButton[] = [
        { name: 'K1', isPressed: false, count: 0 }
    ];
    const game = {
        client: ClientType.stable,
        pid: 1,
        memory: {
            keyOverlay: () => buttons.map((button) => ({ ...button }))
        },
        get: (service: string) => (service === 'global' ? global : null),
        resetReportCount: () => undefined,
        reportError: () => undefined
    } as unknown as AbstractInstance;
    const gameplay = new Gameplay(game);
    gameplay.mode = 3;

    gameplay.updateKeyOverlay();
    assert.deepEqual(gameplay.keypresses, [
        {
            name: 'K1',
            isPressed: false,
            count: 0,
            pressedAt: null,
            releasedAt: null
        }
    ]);

    global.playTime = 200;
    buttons = [{ name: 'K1', isPressed: true, count: 1 }];
    gameplay.updateKeyOverlay();
    assert.equal(gameplay.keypresses[0].pressedAt, 200);
    assert.equal(gameplay.keypresses[0].releasedAt, null);

    global.playTime = 210;
    buttons = [{ name: 'K1', isPressed: true, count: 2 }];
    gameplay.updateKeyOverlay();
    assert.equal(gameplay.keypresses[0].pressedAt, 200);
    assert.equal(gameplay.keypresses[0].releasedAt, null);

    global.playTime = 220;
    buttons = [{ name: 'K1', isPressed: false, count: 2 }];
    gameplay.updateKeyOverlay();
    assert.equal(gameplay.keypresses[0].pressedAt, 200);
    assert.equal(gameplay.keypresses[0].releasedAt, 220);
});

test('resets edges when the mode identity changes and sanitizes bad counts', () => {
    const global = { playTime: 300 };
    let buttons: KeyOverlayButton[] = [
        { name: 'K1', isPressed: true, count: 1 }
    ];
    const game = {
        client: ClientType.stable,
        pid: 1,
        memory: {
            keyOverlay: () => buttons.map((button) => ({ ...button }))
        },
        get: (service: string) => (service === 'global' ? global : null),
        resetReportCount: () => undefined,
        reportError: () => undefined
    } as unknown as AbstractInstance;
    const gameplay = new Gameplay(game);
    gameplay.mode = 3;

    gameplay.updateKeyOverlay();
    assert.equal(gameplay.keypresses[0].pressedAt, 300);

    global.playTime = 400;
    gameplay.mode = 1;
    buttons = [{ name: 'K1', isPressed: true, count: 1_000_001 }];
    gameplay.updateKeyOverlay();

    assert.deepEqual(gameplay.keypresses, [
        {
            name: 'K1',
            isPressed: false,
            count: 0,
            pressedAt: null,
            releasedAt: null
        }
    ]);
});
