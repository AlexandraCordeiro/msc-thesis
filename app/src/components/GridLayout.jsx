import CollectionOfTunesRangeChart from './CollectionOfTunesRangeChart.jsx'
import ArcDiagramChart from './ArcDiagramChart.jsx'
import ScrollableTabsButtonVisible from './ScrollableTabsButtonVisible.jsx'
import SpectogramChart from './SpectogramChart.jsx'
import LyricsSimilarityMatrix from './LyricsSimilarityMatrix.jsx'
import React from 'react'
import MusicPlayer from './MusicPlayer.jsx'
import csv from '../assets/lyrics_data.csv'
import HorizontalLinearStepper from './HorizontalLinearStepper.jsx'
import SelectAutoWidth from './SelectAutoWidth.jsx'
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { fontSize } from '../functions.js'
import InfoIcon from '@mui/icons-material/Info';
import HowToReadPopup from './HowToReadPopup.jsx'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import VerticalSteps from './VerticalSteps.jsx'
import { IconButton } from '@mui/material'
import ShowLyrics from './ShowLyrics.jsx'
import DropdownMenu from './DropdownMenu.jsx'


import ScoreContour from '../assets/score-contour-label.svg';
import AudioContour from '../assets/audio-contour-label.svg';

const title = "Visualization of Folk Music"
const introText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
const howToRead = "How to read this visualization"

const titles = csv.map(d => d.title)
const filenames = csv.map(d => d.identifier)
const collections = ["goodman_vol_1", "goodman_vol_2", "IE_1797_BT_EB", "IE-2019-D-HLS", "IE-2021-KY-AP", "IE-2023-DL-TP"]
const creators = csv.map(d => d.creatorP)
const steps = ['Lyrics', 'Performance', 'Score', 'Collection'];
const lyrics = csv.map(d => d.lyrics)
  
  
// ArcDiagramChart, CollectionOfTunesRangeChart, LyricsSimilarityMatrix, SpectogramChart]

const dividerStyle = {
  borderBottomWidth: '0.35rem',
  borderImage: 'linear-gradient(90deg, #b589fc , #a0cafa) 1',
}

export default function GridLayout() {
  const [tune, setTune] = React.useState(titles[0])
  const [collection, setCollection] = React.useState(collections[0])
  const [filename, setFilename] = React.useState(filenames[0])
  const [creator, setCreator] = React.useState(creators[0])
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleTuneChange = (value) => {
    setTune(value)
    const index = titles.indexOf(value);
    if (index !== -1) {
      setFilename(filenames[index]);
      setCreator(creators[index]);
    }
  };

  const handleCollectionChange = (event, newValue) => {
    setCollection(newValue);
  };

  const selectViz = (activeStep) => {
    switch (activeStep) {
      /* Lyrics */
      case 0:
        return (
          <>
            <Grid container>
              <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}>
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>The hidden patterns in song lyrics</Typography>
              </Grid>
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}>
                  <IconButton onClick={handleOpen} sx={{width: '3rem', height: '3rem'}}>
                    <InfoIcon sx={{fontSize: '1.8rem', color: "#b589fc", fontSize: '1.8rem'}}/>
                  </IconButton>
                  <ShowLyrics open={open} handleClose={handleClose} lyrics={lyrics[filenames.indexOf(filename)]} tune={tune}/>
              </Grid>
              
              <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                <Typography variant='body' color='black' fontFamily={'montserrat'}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </Typography>
              </Grid>
              <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </Grid>
            
            </Grid>

            <Grid sx={{height: 'fit-content'}} size={12} id='grid-12'>
              <LyricsSimilarityMatrix tuneIndex={filenames.indexOf(filename)}/>
            </Grid>

          </>
        )
      
      /* Spectogram */
      case 1: 
        return (
            <>
              <Grid container>
                <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}>
                  <Typography variant='h4' fontFamily={'playfair display'} color='black'>How performance differs from the score</Typography>
                </Grid>
                <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}>
                    <IconButton onClick={handleOpen} sx={{width: '3rem', height: '3rem'}}>
                      <InfoIcon sx={{fontSize: '1.8rem', color: "#b589fc", fontSize: '1.8rem'}}/>
                    </IconButton>
                    <ShowLyrics open={open} handleClose={handleClose} lyrics={lyrics[filenames.indexOf(filename)]} tune={tune}/>
                </Grid>
                
                <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                  <Typography variant='body' color='black' fontFamily={'montserrat'}>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                  </Typography>
                </Grid>
                <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                  <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </Grid>
              
              

              <Grid sx={{height: 'fit-content'}} size={10} id='grid-12'>
                <SpectogramChart key={filename} tune={filename}/>
              </Grid>


              <Grid size={2} display='flex' flexDirection='column' alignItems='center' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 10px'}}>
                  
                  <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' paddingBottom={'1rem'}>How to Read</Typography>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Loudness</Typography>
                  <div style={{width: '100%', height: '25px', background: 'linear-gradient(90deg, #e0f4fd, #390160)', borderRadius: '0.5rem'}}/>
                  <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent:'space-between', paddingBottom:'1rem'}}>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>min</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>max</Typography>
                  </div>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Score Contour</Typography>
                  <div>
                    <img src={ScoreContour} style={{paddingBottom:'1rem'}}></img>
                  </div>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Audio Contour</Typography>
                  <div>
                    <img src={AudioContour}></img>
                  </div>
                </div>
              </Grid>

            </Grid>

            </>
          )

      /* Arc Diagram */
      case 2:
        return (
          <>
            <Grid container>
              <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}>
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>The hidden patterns in song lyrics</Typography>
              </Grid>
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}>
                <Item textAlign={'right'}>
                  <IconButton onClick={handleOpen} sx={{width: '3rem', height: '3rem'}}>
                    <InfoIcon sx={{fontSize: '1.8rem', color: "#b589fc", fontSize: '1.8rem'}}/>
                  </IconButton>
                  <ShowLyrics open={open} handleClose={handleClose} lyrics={lyrics[filenames.indexOf(filename)]} tune={tune}/>
                </Item>
              </Grid>
              
              <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                <Typography variant='body' color='black' fontFamily={'montserrat'}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </Typography>
              </Grid>
              <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </Grid>
            
            </Grid>

            <Grid sx={{height: 'fit-content'}} size={12} id='grid-12'>
              <ArcDiagramChart tune={filename}/>
            </Grid>

          </>
        )
      default:
        setActiveStep(0)
    }
  }

  /* Collection of Tunes*/
  return (

    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>

      <Box
      sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      paddingTop: '60vh',
      paddingLeft: '4%',
      }}
      >
      <VerticalSteps steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
      </Box>


      <Box sx={{width: '80%',  margin: 'auto', display: 'flex', alignItems: 'flex-start'}}>
        <Grid container spacing={4}>

            {/* Intro */}
            <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}} paddingTop={{xs: '7rem'}}>
              <Typography variant='h3' fontFamily={'playfair display'} color={'black'} fontWeight={500} textAlign={'left'}>
                Visualization of Folk Music
              </Typography>
            </Grid>

            <Grid size={{xs: 10, sm: 8, md: 6, xl: 5}} paddingTop={{xs: '1rem', md: '7rem'}}>
              <Typography variant='body' fontFamily={'montserrat'} color={'black'} fontWeight={500}>
                Recently, the recovery and transmission of folk music has achieved the interest of the authorities as a way of preserving this intangible asset, a problem accelerated by the depopulation of rural areas, the loss of the function of this music, and the paradigmatic change of the forms of musical transmission.
              </Typography>
            </Grid>

            <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}/>

            <Grid size={{xs: 10, sm: 8, md: 6, xl: 5}}>
              <Typography variant='body' fontFamily={'montserrat'} color={'black'} fontWeight={500}>
                Recently, the recovery and transmission of folk music has achieved the interest of the authorities as a way of preserving this intangible asset, a problem accelerated by the depopulation of rural areas, the loss of the function of this music, and the paradigmatic change of the forms of musical transmission.
              </Typography>
            </Grid>


            <Grid size={12}>
              <Divider sx={dividerStyle}></Divider>
            </Grid>

            <Grid size={12}>
              {selectViz(activeStep)}
            </Grid>

          {/* <Grid size={12}>
            <Item fontWeight={600} fontSize={'40px'} fontFamily={'playfair display'} textAlign='left' p={'1.5rem'} >{title}</Item>
          </Grid>
          <Grid size={6}>
            <Item fontWeight={600} fontSize={'25px'} fontFamily={'montserrat'} textAlign='left' p={'1.5rem'}>{"Subtitle"}</Item>
          </Grid>
          <Grid size={5}>
            <Item fontWeight={500} fontSize={'14px'} fontFamily={'montserrat'} textAlign='left' p={'1.5rem'} >{introText}</Item>
          </Grid>
          <Grid size={12}>
            <Item fontWeight={600} fontSize={'25px'} fontFamily={'amiri'} textAlign='center' p={'1.5rem'} >{}</Item>
            <Divider sx={dividerStyle}></Divider>
          </Grid>
          <Grid size={12}>
            {selectViz(activeStep)}
          </Grid> */}

          

        </Grid>
      </Box>
    </Box>
    
  )
}