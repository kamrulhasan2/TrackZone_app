
const InputComponent = ({text,name,type,value,handleChange,disabled}) => {
  return (
    <div>
        <label htmlFor={name}>{text}</label>
        <input 
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            disabled={disabled} 
        />
    </div>
  )
}

export default InputComponent;