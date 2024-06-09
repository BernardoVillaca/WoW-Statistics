export const updateURL = (key: string, value: string | null, goToFirstPage: boolean | null) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if the region, bracket, or version has changed
    const currentRegion = urlParams.get('region');
    const currentBracket = urlParams.get('bracket');
    const currentVersion = urlParams.get('version');
    const isRegionChanged = key === 'region' && value !== currentRegion;
    const isBracketChanged = key === 'bracket' && value !== currentBracket;
    const isVersionChanged = key === 'version' && value !== currentVersion;

    if (value) {
        urlParams.set(key, value);
    } else {
        urlParams.delete(key);
    }

    // If the region, bracket, or version has changed, remove minRating and maxRating
    // if (isRegionChanged || isBracketChanged || isVersionChanged) {
    //     urlParams.delete('minRating');
    //     urlParams.delete('maxRating');
    // }

    if (goToFirstPage) urlParams.delete('page'); // Remove the 'page' parameter

    const newUrl = `${urlParams.size === 0 ? window.location.pathname : `${window.location.pathname}?${urlParams.toString()}`}`;
   
    window.history.replaceState(null, '', newUrl); // Use replaceState instead of pushState
};
