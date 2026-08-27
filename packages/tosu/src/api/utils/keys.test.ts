import assert from 'node:assert/strict';
import test from 'node:test';

import { buildKeys } from '@/api/utils/buildKeys';
import {
    MAX_KEY_OVERLAY_BUTTONS,
    lazerKeyName,
    stableKeyName
} from '@/memory/keyOverlay';
import type { KeyOverlayButton, KeypressButton } from '@/states/types';

test('adds every ordered key to the legacy keys object', () => {
    const legacy: KeyOverlayButton[] = Array.from(
        { length: 4 },
        (_, index) => ({
            name: `K${index + 1}`,
            isPressed: index % 2 === 0,
            count: index + 1
        })
    );
    const keypresses: KeypressButton[] = Array.from(
        { length: MAX_KEY_OVERLAY_BUTTONS },
        (_, index) => ({
            name: `K${index + 1}`,
            isPressed: index % 2 === 0,
            count: index + 10,
            pressedAt: index,
            releasedAt: index + 0.5
        })
    );

    const result = buildKeys(legacy, keypresses);

    assert.deepEqual(result.k1, { isPressed: true, count: 1 });
    assert.deepEqual(result.m2, { isPressed: false, count: 4 });
    assert.equal(result.all.length, MAX_KEY_OVERLAY_BUTTONS);
    assert.deepEqual(result.all.at(0), {
        name: 'K1',
        isPressed: true,
        count: 10,
        pressedAt: 0,
        releasedAt: 0.5
    });
    assert.deepEqual(result.all.at(-1), {
        name: 'K18',
        isPressed: false,
        count: 27,
        pressedAt: 17,
        releasedAt: 17.5
    });

    legacy[0].count = 98;
    keypresses[0].count = 99;
    assert.equal(result.k1.count, 1);
    assert.equal(result.all[0].count, 10);
});

test('defaults missing legacy controls without dropping ordered keys', () => {
    const keypress: KeypressButton = {
        name: 'B1',
        isPressed: true,
        count: 7,
        pressedAt: 1234.5,
        releasedAt: null
    };

    assert.deepEqual(buildKeys([], [keypress]), {
        k1: { isPressed: false, count: 0 },
        k2: { isPressed: false, count: 0 },
        m1: { isPressed: false, count: 0 },
        m2: { isPressed: false, count: 0 },
        all: [keypress]
    });
});

test('names stable and lazer controls in source order', () => {
    assert.deepEqual(
        Array.from({ length: 4 }, (_, index) => stableKeyName(0, index)),
        ['K1', 'K2', 'M1', 'M2']
    );
    assert.deepEqual(
        Array.from({ length: 3 }, (_, index) => stableKeyName(2, index)),
        ['L', 'R', 'D']
    );
    assert.deepEqual(
        Array.from({ length: 4 }, (_, index) => stableKeyName(1, index)),
        ['K1', 'K2', 'M1', 'M2']
    );
    assert.deepEqual(
        Array.from({ length: MAX_KEY_OVERLAY_BUTTONS }, (_, index) =>
            stableKeyName(3, index)
        ),
        Array.from(
            { length: MAX_KEY_OVERLAY_BUTTONS },
            (_, index) => `K${index + 1}`
        )
    );
    assert.deepEqual(
        Array.from({ length: MAX_KEY_OVERLAY_BUTTONS }, (_, index) =>
            lazerKeyName(index)
        ),
        Array.from(
            { length: MAX_KEY_OVERLAY_BUTTONS },
            (_, index) => `B${index + 1}`
        )
    );
});
