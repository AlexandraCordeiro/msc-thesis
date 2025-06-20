import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {IconButton} from '@mui/material'

export default function VerticalSteps({steps, activeStep, setActiveStep}) {

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
    <div style={{display:'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: 'fit-content',
      height: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      margin: 0,
      paddingTop: '3rem',
      paddingBottom: '3rem'

      }}>

        <IconButton type='button' disabled={activeStep === 0} onClick={handleBack} sx={{borderRadius: '50%', marginLeft: `-${(40-24) * 0.5}px`}}>
          <KeyboardArrowLeftIcon sx={{transform: 'rotate(90deg)'}}/>
        </IconButton>
        <Stepper connector={false} orientation='vertical' activeStep={activeStep} sx={{width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {steps.map((label, index) => (
            <Step
              sx={{
                '& .MuiStepIcon-root': {
                    color: 'whitesmoke',
                },
                '& .MuiStepIcon-root:hover': {
                    cursor: 'pointer'
                },
                '& .MuiStepIcon-root.Mui-active': {
                    color: '#b589fc',
                },
                '& .MuiStepIcon-text': {
                    fill: '#10002a',
                    fontSize: '13px',
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                },
              }}
              key={label} completed={false}
              onClick={ (event) => {
                setActiveStep(index)
                event.preventDefault()
                event.stopPropagation()
              }
              }>
              <StepLabel> {label == "" }</StepLabel>
            </Step>
          ))}
        </Stepper>
        <IconButton type='button' onClick={handleNext} sx={{borderRadius: '50%', marginLeft: `-${(40-24) * 0.5}px`}}>
          <KeyboardArrowRightIcon sx={{transform: 'rotate(90deg)'}}/>
        </IconButton>
    </div>
)
}