import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useWindowSize } from './UseWindowSize';
import { IconButton } from '@mui/material';





export default function ShowLyrics({open, handleClose, lyrics, tune}) {
    const [width, height] = useWindowSize()
    console.log(lyrics)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width * 0.6,
        height: 'fit-content',
        maxHeight: height * 0.7,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '0.5rem',
        p: 4,
        overflow: 'scroll'
    };

    return (
    <div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography width={'60%'} id="modal-modal-title" variant="h4" component="h2" color='black' fontFamily={'playfair display'}>
                {tune}
                </Typography>

                <IconButton onClick={handleClose} style={{color: 'black', width: '3rem', height: '3rem'}}>
                    <CloseIcon sx={{fontSize: '1.5rem'}}/>
                </IconButton>
            </div>

            <Typography id="modal-modal-description" color='black' fontFamily={'montserrat'} fontWeight='medium' sx={{ mt: 2, whiteSpace: 'pre-line'}}>
            {lyrics}
            </Typography>
        </Box>
        </Modal>
    </div>
    );
}