import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton } from '@mui/material';
import { fontSize } from '../functions';
const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function HorizontalNonLinearStepper({steps, activeStep, setActiveStep}) {

  const handleNext = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveStep((prevActiveStep) =>{
      if (prevActiveStep + 1 > steps.length - 1) return 0
      else return prevActiveStep + 1
    })
  }

  const handleBack = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (

    <Box sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      background: 'whitesmoke',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      borderRadius: '0.7rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
      }}>
      <IconButton type='button' disabled={activeStep === 0} onClick={handleBack} sx={{borderRadius: '50%', marginLeft: `-${(40-24) * 0.5}px`}}>
        <KeyboardArrowLeftIcon/>
      </IconButton>

      <Stepper nonLinear activeStep={activeStep} sx={{width: '90%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        {steps.map((label, index) => (
          <Step key={label}
          sx={{
                '& .MuiStepIcon-root': {
                    color: 'lightgray',
                    fontSize: '26px',
                    
                },
                '& .MuiStepIcon-root:hover': {
                    cursor: 'pointer'
                },
                '& .MuiStepIcon-root.Mui-active': {
                    color: '#d2b8fd'
                },
                '& .MuiStepIcon-text': {
                    fill: '#10002a',
                    fontSize: '13px',
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                },
              }}
          >
            <StepButton color="inherit" 
             disableRipple
            disableTouchRipple
              onClick={ (event) => {
                setActiveStep(index)
                event.preventDefault()
                event.stopPropagation()
              }}>
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <IconButton type='button' onClick={handleNext} sx={{borderRadius: '50%', marginLeft: `-${(40-24) * 0.5}px`}}>
        <KeyboardArrowRightIcon/>
      </IconButton>
     
    </Box>
  );
}