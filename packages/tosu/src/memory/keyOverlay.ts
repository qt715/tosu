export const MAX_KEY_OVERLAY_BUTTONS = 18;

const KEY_NAMES = Array.from(
    { length: MAX_KEY_OVERLAY_BUTTONS },
    (_, index) => `K${index + 1}`
);
const BUTTON_NAMES = Array.from(
    { length: MAX_KEY_OVERLAY_BUTTONS },
    (_, index) => `B${index + 1}`
);
const STANDARD_NAMES = ['K1', 'K2', 'M1', 'M2'] as const;
const CATCH_NAMES = ['L', 'R', 'D', 'M2'] as const;

export const stableKeyName = (mode: number, index: number): string => {
    if (mode === 3 || index >= 4) {
        return KEY_NAMES[index];
    }

    if (mode === 2) {
        return CATCH_NAMES[index] ?? KEY_NAMES[index];
    }

    return STANDARD_NAMES[index] ?? KEY_NAMES[index];
};

export const lazerKeyName = (index: number): string => BUTTON_NAMES[index];
