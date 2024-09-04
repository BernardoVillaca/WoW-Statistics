export const capitalizeFirstLetter = (string: string) => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
};