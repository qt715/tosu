import type {
    ApiAnswerPrecise as ApiAnswer,
    PreciseTourney
} from '@/api/types/v2';
import { buildKeys } from '@/api/utils/buildKeys';
import { InstanceManager } from '@/instances/manager';

const buildTourneyData = (
    instanceManager: InstanceManager
): PreciseTourney[] => {
    const osuTourneyManager = Object.values(
        instanceManager.osuInstances
    ).filter((instance) => instance.isTourneyManager);
    if (osuTourneyManager.length < 1) {
        return [];
    }

    const osuTourneyClients = Object.values(
        instanceManager.osuInstances
    ).filter((instance) => instance.isTourneySpectator);

    const mappedOsuTourneyClients = osuTourneyClients
        .sort((a, b) => a.ipcId - b.ipcId)
        .map((instance): PreciseTourney => {
            const { gameplay } = instance.getServices(['gameplay']);

            return {
                ipcId: instance.ipcId,
                keys: buildKeys(gameplay.keyOverlay, gameplay.keypresses),
                hitErrors: gameplay.hitErrors
            };
        });

    return mappedOsuTourneyClients;
};

export const buildResult = (instanceManager: InstanceManager): ApiAnswer => {
    const osuInstance = instanceManager.getInstance(
        instanceManager.focusedClient
    );
    if (!osuInstance) {
        return { error: 'not_ready' };
    }

    const { gameplay } = osuInstance.getServices(['gameplay']);

    return {
        keys: buildKeys(gameplay.keyOverlay, gameplay.keypresses),
        hitErrors: gameplay.hitErrors,
        tourney: buildTourneyData(instanceManager)
    };
};
