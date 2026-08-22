export const TIMEZONE_OFFSET = {
    PST: -7 * 60,
    EST: -4 * 60,
    EDT: -4 * 60,
    BST: 1 * 60,
    MST: -6 * 60,
    IST: 330,        // India Standard Time (UTC+5.5)
    JST: 9 * 60,     // Japan Standard Time (UTC+9)
    CET: 1 * 60,     // Central European Time (UTC+1)
    CEST: 2 * 60,    // Central European Summer Time (UTC+2)
    SGT: 8 * 60,     // Singapore Standard Time (UTC+8)
    AEST: 10 * 60,   // Australian Eastern Standard Time (UTC+10)
    NZST: 12 * 60,   // New Zealand Standard Time (UTC+12)
    GST: 4 * 60,     // Gulf Standard Time (UTC+4)
    HKT: 8 * 60      // Hong Kong Time (UTC+8)
};

export const ALL_TIMEZONE_OFFSET = ['UTC','GMT',...Object.keys(TIMEZONE_OFFSET)]