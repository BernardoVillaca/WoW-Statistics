type HistoryEntry = {
    updated_at: string;
    rating?: number;
    rank?: number;
    played?: number;
};

export const calculateDifference = (history: HistoryEntry[], cell: string, text: string) => {
    if (!['rating', 'rank', 'played'].includes(cell)) return 0;

    if (history && history.length > 0) {
        const lastHistoryEntry = history[history.length - 1];
        if (!lastHistoryEntry) return 0; // Additional check to handle undefined

        const lastUpdate = new Date(lastHistoryEntry.updated_at);
        const currentDate = new Date();
        const diffTime = currentDate.getTime() - lastUpdate.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);

        //   if (diffHours < 24) {
        let previousValue = lastHistoryEntry[cell as keyof HistoryEntry];
        if (typeof previousValue === 'string') {
            previousValue = parseInt(previousValue, 10);
        }
        const currentValue = parseInt(text, 10);
        if (previousValue !== undefined) {
            const difference = cell === 'rank' ? previousValue - currentValue : currentValue - previousValue;
            return difference;
        }
    }
    // }
    return 0;
};
