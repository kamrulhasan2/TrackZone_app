import { useEffect, useState } from "react"
import { getOffset } from "../../../utils/timezone";
import { ALL_TIMEZONE_OFFSET, TIMEZONE_OFFSET } from "../../../constants/timezone";
import classes from './index.module.css'
import SelectComonent from "../../../ui/select/SelectComonent";
import InputComponent from "../../../ui/input/InputComponent";
import { clockSchema } from "../../../utils/validation";


const ClockForm = ({
    values = { title: '', timezone: 'UTC', offset: 0 },
    handleClock,
    title = true,
    edit = false,
}) => {

    const [formValues, setFormValues] = useState({...values});
    const [errors, setErrors] = useState({});

    useEffect(()=>{
        if(TIMEZONE_OFFSET[formValues.timezone]){
            setFormValues((prev) =>({
                ...prev,
                offset: TIMEZONE_OFFSET[formValues.timezone],
            }));
        }
    },[formValues.timezone]);

    const handleChange = (e)=>{
        let {name , value} = e.target;

        if(name === 'offset'){
            value = Number(value) * 60;
        }


        setFormValues((prev)=>({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = (e)=>{
        e.preventDefault();

        try {
            clockSchema.validateSync(formValues, { abortEarly: false });
            handleClock(formValues);
            setErrors({});
        } catch (e) {
            const newErrors = {};
            e.inner.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    };


  return (
    <form onSubmit={handleSubmit}>
        <InputComponent 
            text={"Enter Title"}
            type={'text'}
            name={'title'}
            value={formValues.title}
            handleChange={handleChange}
            disabled={!title} 

        />
        {errors.title && <p style={{color: 'red'}}>{errors.title}</p>}

        <div>
            <SelectComonent 
                formValues={formValues} 
                text={'Enter Timezone'}
                name={"timezone"}
                value={formValues.timezone}
                handleChange={handleChange} 
                maped={ALL_TIMEZONE_OFFSET}
            />
        </div>
        {errors.timezone && <p style={{color: 'red'}}>{errors.timezone}</p>}


        {(formValues.timezone === 'GMT' || formValues.timezone === 'UTC') && (
            <div>
                <SelectComonent 
                    formValues={formValues} 
                    handleChange={handleChange} 
                    text={'Enter Offset'}
                    name={"offset"}
                    value={formValues.offset / 60}
                    maped={getOffset()}
                />
             </div>

        )}
        {errors.offset && <p style={{color: 'red'}}>{errors.offset}</p>}

        <button className={classes.btn}>{edit ? 'Update' : 'Create'}</button>
        
    </form>
  )
}

export default ClockForm;