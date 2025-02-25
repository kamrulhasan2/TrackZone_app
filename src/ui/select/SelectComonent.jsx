

const SelectComonent = ({handleChange,text,name,value,maped}) => {
  return (
    
    <div>
    <label htmlFor={name}>{text}</label>
            <select
                 name={name} 
                 id={name}
                 value={value}
                 onChange={handleChange}
            >
                {maped.map((offset) =>(
                    <option key={offset} value={offset}>{offset}</option>
                ))}
   
            </select>
    </div>
  )
}

export default SelectComonent;