// utils/updateURL.ts
export const updateURLParameter = (key: string, value: string | null, goToFirstPage: boolean | null) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (value) {
        urlParams.set(key, value);
    } else {
        urlParams.delete(key);
    }

    if(key === 'page' && value === '1') return window.history.pushState(null, '', '/');
    if (goToFirstPage) urlParams.delete('page'); // Remove the 'page' parameter
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState(null, '', newUrl);
};
