import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const ButtonLocal = ({text,onClick,color='primary',size='small'},type='button') => {
  return (
    <div style={{margin:'10px'}}>
        <Stack direction="row" spacing={1}>
            <Button variant="contained" color={color} onClick={onClick} size={size} type={type}>
                {text}
            </Button>
        </Stack>
    </div>
  )
}

export default ButtonLocal;