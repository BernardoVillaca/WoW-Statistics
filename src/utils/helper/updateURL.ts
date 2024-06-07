export const updateURLParameter = (key: string, value: string | null, goToFirstPage: boolean, isInitialLoad: boolean | null) => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if the region has changed
    const currentRegion = urlParams.get('region');
    const currentBracket = urlParams.get('bracket');
    const currentVersion = urlParams.get('version');
    const isRegionChanged = key === 'region' && value !== currentRegion;
    const isBracketChanged = key === 'bracket' && value !== currentBracket
    const isVersionChanged = key === 'version' && value !== currentVersion
    
    if (value) {
        urlParams.set(key, value);
    } else {
        urlParams.delete(key);
    }

    // If the region has changed, remove minRating and maxRating
    if (isRegionChanged || isBracketChanged || isVersionChanged ) {
        urlParams.delete('minRating');
        urlParams.delete('maxRating');
    }

    if (key === 'page' && value === '1' && isInitialLoad) return;
    if (goToFirstPage) urlParams.delete('page'); // Remove the 'page' parameter

    if (goToFirstPage) {
        urlParams.delete('page'); // Remove the 'page' parameter
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState(null, '', newUrl);
};
