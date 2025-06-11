import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth({options, tune, handleChange}) {

  return (
    <div>
      <FormControl sx={{m: 1, minWidth: 80, width: 'fit-content'}} size="small">
        <InputLabel id="demo-simple-select-autowidth-label">Tune</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={tune}
          onChange={handleChange}
          autoWidth={false}
          label="Tune"
          fontSize='14px'
        >
          {options.map((option, index) => (
            <MenuItem
              sx={{ fontFamily: 'Montserrat', fontSize: '14px', fontWeight: '450'}}
              value={option}
            >
            {`${index + 1} - ${option}`}
            </MenuItem>

          ))}
        </Select>
      </FormControl>
    </div>
  );
}