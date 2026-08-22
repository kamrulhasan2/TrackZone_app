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
        if(TIMEZONE_OFFSET[formValues.timezone] !== undefined){
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
    <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title Input */}
        <div className="space-y-1.5 text-left">
            <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Clock Title
            </Label>
            <Input 
                type="text"
                id="title"
                name="title"
                placeholder="e.g. London Office, Tokyo Ops"
                value={formValues.title}
                onChange={handleChange}
                disabled={!title} 
                className="w-full bg-background border border-border/80 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition duration-200"
            />
            {errors.title && (
              <p className="text-destructive text-xs font-medium mt-1">{errors.title}</p>
            )}
        </div>

        {/* Timezone Select */}
        <div className="space-y-1.5 text-left">
            <Label htmlFor="timezone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Timezone
            </Label>
            <Select
                name="timezone"
                value={formValues.timezone}
                onValueChange={(value) => handleChange({ target: { name: "timezone", value } })}
            >
                <SelectTrigger className="w-full bg-background border border-border/80 rounded-md">
                    <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                    {ALL_TIMEZONE_OFFSET.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                            {timezone}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-destructive text-xs font-medium mt-1">{errors.timezone}</p>
            )}
        </div>

        {/* Custom Offset (for GMT or UTC) */}
        {(formValues.timezone === 'GMT' || formValues.timezone === 'UTC') && (
            <div className="space-y-1.5 text-left">
                <Label htmlFor="offset" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Offset Hours
                </Label>
                <Select
                    name="offset"
                    value={String(formValues.offset / 60)}
                    onValueChange={(value) => handleChange({ target: { name: "offset", value } })}
                >
                    <SelectTrigger className="w-full bg-background border border-border/80 rounded-md">
                        <SelectValue placeholder="Select an offset" />
                    </SelectTrigger>
                    <SelectContent>
                        {getOffset().map((offset) => (
                            <SelectItem key={offset} value={String(offset)}>
                                {offset > 0 ? `+${offset}` : offset}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
        )}
        {errors.offset && (
          <p className="text-destructive text-xs font-medium mt-1">{errors.offset}</p>
        )}

        {/* Action Button */}
        <div className="pt-2">
            <Button type="submit" className="w-full font-semibold shadow-sm h-10 transition duration-200">
                {edit ? 'Save Changes' : 'Create Tracking'}
            </Button>
        </div>
    </form>
  )
}

export default ClockForm;
