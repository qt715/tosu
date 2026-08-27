import type { Keys } from '@/api/types/v2';
import type { KeyOverlayButton, KeypressButton } from '@/states/types';

export const buildKeys = (
    legacy: readonly KeyOverlayButton[],
    keypresses: readonly KeypressButton[]
): Keys => {
    const [k1, k2, m1, m2] = legacy;

    return {
        k1: {
            isPressed: k1?.isPressed ?? false,
            count: k1?.count ?? 0
        },
        k2: {
            isPressed: k2?.isPressed ?? false,
            count: k2?.count ?? 0
        },
        m1: {
            isPressed: m1?.isPressed ?? false,
            count: m1?.count ?? 0
        },
        m2: {
            isPressed: m2?.isPressed ?? false,
            count: m2?.count ?? 0
        },
        all: keypresses.map(
            ({ name, isPressed, count, pressedAt, releasedAt }) => ({
                name,
                isPressed,
                count,
                pressedAt,
                releasedAt
            })
        )
    };
};
