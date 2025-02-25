
export const TIMEZONE_OFFSET = {
    PST: -7 * 60,
    EST: -4 * 60,
    EDT: -4 * 60,
    BST: 1 * 60,
    MST: -6 * 60
};

export const ALL_TIMEZONE_OFFSET = ['UTC','GMT',...Object.keys(TIMEZONE_OFFSET)]