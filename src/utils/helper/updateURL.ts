export const updateURL = (key: string, value: string | null, goToFirstPage: boolean | null) => {
    const urlParams = new URLSearchParams(window.location.search);

    const currentVersion = urlParams.get('version');
    const isVersionChanged = key === 'version' && value !== currentVersion;

    if (value) {
        urlParams.set(key, value);
    } else {
        urlParams.delete(key);
    }

    if (isVersionChanged) {
        urlParams.delete('search');
        
    }

    if (goToFirstPage) urlParams.delete('page');

    const newUrl = urlParams.size === 0 ? window.location.pathname : `${window.location.pathname}?${urlParams.toString()}`;

    window.history.replaceState(null, '', newUrl);
};