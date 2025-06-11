import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import SelectAutoWidth from './SelectAutoWidth';

export default function FadeInDropdownMenu({options, tune, handleChange}) {
  const [checked, setChecked] = React.useState(false);

  const handleSwitchChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box sx={{ height: 180 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleSwitchChange} color={"purple"}/>}
        label="Show Music Player"
      />
      <Box sx={{ display: 'flex' }}>
        <Fade in={checked} timeout={500} unmountOnExit>
          <Box>
            <SelectAutoWidth options={options} tune={tune} handleChange={handleChange}/>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
