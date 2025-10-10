
import * as yup from 'yup';

export const clockSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    timezone: yup.string().required('Timezone is required'),
    offset: yup.number().required('Offset is required'),
});

export const eventSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    date: yup.string().required('Date is required'),
    time: yup.string().required('Time is required'),
});
