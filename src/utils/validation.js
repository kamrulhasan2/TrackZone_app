
import * as yup from 'yup';

export const clockSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    timezone: yup.string().required('Timezone is required'),
    offset: yup.number().required('Offset is required'),
});
