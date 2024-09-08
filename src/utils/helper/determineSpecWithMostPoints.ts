

interface SpecData {
    specialization_groups: {
        specializations: {
            spent_points?: number;
            specialization_name: string;
        }[];
    }[];
}


export const determineSpecWithMostPoints = (specData: SpecData | null): string => {
    if (!specData?.specialization_groups) {
        return '';
    }

    let maxPoints = 0;
    let mainSpecName = '';

    for (const group of specData.specialization_groups) {
        if (Array.isArray(group.specializations)) {
            for (const specialization of group.specializations) {
                const points = specialization.spent_points ?? 0;
                if (points > maxPoints) {
                    maxPoints = points;
                    mainSpecName = specialization.specialization_name;
                }
            }
        }
    }
    
    return mainSpecName;
};