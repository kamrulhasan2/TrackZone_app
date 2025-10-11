import { useEffect, useState } from "react"
import { getOffset } from "../../../utils/timezone";
import { ALL_TIMEZONE_OFFSET, TIMEZONE_OFFSET } from "../../../constants/timezone";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="title">Enter Title</Label>
            <Input 
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                disabled={!title} 
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="timezone">Enter Timezone</Label>
            <Select
                name="timezone"
                value={formValues.timezone}
                onValueChange={(value) => handleChange({ target: { name: "timezone", value } })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(ALL_TIMEZONE_OFFSET).map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                            {timezone}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.timezone && <p className="text-red-500 text-sm">{errors.timezone}</p>}
        </div>

        {(formValues.timezone === 'GMT' || formValues.timezone === 'UTC') && (
            <div className="space-y-2">
                <Label htmlFor="offset">Enter Offset</Label>
                <Select
                    name="offset"
                    value={formValues.offset / 60}
                    onValueChange={(value) => handleChange({ target: { name: "offset", value } })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an offset" />
                    </SelectTrigger>
                    <SelectContent>
                        {getOffset().map((offset) => (
                            <SelectItem key={offset} value={offset}>
                                {offset}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
        )}
        {errors.offset && <p className="text-red-500 text-sm">{errors.offset}</p>}

        <Button type="submit" className="w-full">
            {edit ? 'Update' : 'Create'}
        </Button>
    </form>
  )
}