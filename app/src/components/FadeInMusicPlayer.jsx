import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import MusicPlayer from './MusicPlayer';

export default function FadeInMusicPlayer({ filename, tune, creator }) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box sx={{ height: 180 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} color={"purple"}/>}
        label="Show Music Player"
      />
      <Box sx={{ display: 'flex' }}>
        <Fade in={checked} timeout={500} unmountOnExit>
          <Box>
            <MusicPlayer filename={filename} tune={tune} creator={creator} />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
