import { gameConfig } from '../../Util/GameConfig';
type MonsterProbabilities = {
    DOG?: number;
    WOLF?: number;
    BOSS?: number;
};

type MonsterTypeCounts = {
    [key: string]: number;
};

export const WaveCalculator = {
    calculateMonsterCountForLevel(level: number): number {
        const waveCount = gameConfig.MONSTER.WAVE_COUNT;
        return Math.min(waveCount + level, 50);
    },

    calculateMonsterTypeProbabilities(level: number): MonsterProbabilities {
        const probabilities: MonsterProbabilities = {};

        let dogProb = Math.max(0.4, 0.8 - (level * 0.008));
        let wolfProb = Math.min(0.4, 0.15 + (level * 0.005));
        let bossProb = 0;

        if (level >= 10) {
            bossProb = Math.min(0.2, (level - 10) * 0.004 + 0.05);

            const totalOthers = dogProb + wolfProb;
            const adjustment = bossProb / totalOthers;

            dogProb *= (1 - adjustment);
            wolfProb *= (1 - adjustment);
        }

        const total = dogProb + wolfProb + bossProb;

        probabilities.DOG = dogProb / total;
        probabilities.WOLF = wolfProb / total;

        if (level >= 10) {
            probabilities.BOSS = bossProb / total;
        }

        return probabilities;
    },

    calculateMonsterTypeCounts(level: number, totalMonsters: number): MonsterTypeCounts {
        const probabilities = this.calculateMonsterTypeProbabilities(level);

        const monsterTypeCounts: MonsterTypeCounts = {};

        const sortedTypes = Object.keys(probabilities)
            .map(key => [key, probabilities[key as keyof typeof probabilities]!] as [string, number])
            .sort((a, b) => b[1] - a[1]);

        let assignedTotal = 0;

        for (let i = 0; i < sortedTypes.length - 1; i++) {
            const [type, prob] = sortedTypes[i];

            const count = Math.floor(totalMonsters * prob);
            monsterTypeCounts[type] = count;
            assignedTotal += count;
        }

        const [lastType] = sortedTypes[sortedTypes.length - 1];
        monsterTypeCounts[lastType] = totalMonsters - assignedTotal;

        return monsterTypeCounts;
    }
};


