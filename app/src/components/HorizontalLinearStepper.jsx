import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {IconButton} from '@mui/material'

export default function HorizontalLinearStepper({steps, activeStep, setActiveStep}) {

  const handleNext = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }


  return (
    <div style={{display:'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '20vw',
      height: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      margin: 0
      }}>

        <IconButton type='button' disabled={activeStep === 0} onClick={handleBack} sx={{borderRadius: '50%', marginLeft: `-${(40-24) * 0.5}px`}}>
          <KeyboardArrowLeftIcon sx={{transform: 'rotate(90deg)'}}/>
        </IconButton>
        <Stepper orientation='vertical' activeStep={activeStep} sx={{width: '100%', height: '50%', overflow: 'hidden'}}>
          {steps.map((label) => (
            <Step key={label} completed={false} onClick={handleNext}>
              <StepLabel>{label == steps[activeStep] ? label : "" }</StepLabel>
            </Step>
          ))}
        </Stepper>
        <IconButton type='button' onClick={handleNext} sx={{borderRadius: '50%', marginLeft: `-${(40-24) * 0.5}px`}}>
          <KeyboardArrowRightIcon sx={{transform: 'rotate(90deg)'}}/>
        </IconButton>
      

      

    </div>
)
}