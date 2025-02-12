import { TIMEZONE_OFFSET } from "../constants/timezone";

export const getOffset = (start= -11.5, ending = 12)=>{
    const offsets = [];

    for(let i = -11.5; i<=12; i+= 0.5){
        offsets.push(i);
    }

    return offsets;
};

export const getTimezone = ()=>{
    return ['UTC','GMT', ...Object.key(TIMEZONE_OFFSET)];
};