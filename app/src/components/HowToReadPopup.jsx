import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useWindowSize } from './UseWindowSize';





export default function HowToReadPopup({open, handleClose}) {
    const [width, height] = useWindowSize()

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width * 0.6,
        height: height * 0.4,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '0.5rem',
        p: 4,
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
                How to read this visualization
                </Typography>

                <Button onClick={handleClose} style={{height: 'fit-content', width: 'fit-content', color: 'black'}}>
                    <CloseIcon/>
                </Button>
            </div>

            <Typography id="modal-modal-description" color='black' fontFamily={'montserrat'} fontWeight='medium' sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
        </Box>
        </Modal>
    </div>
    );
}