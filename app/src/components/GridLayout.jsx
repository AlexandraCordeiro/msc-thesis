import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
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
import { Button } from '@mui/material'


const Item = ({children, textAlign, fontWeight, fontFamily, fontSize, p}) => {
  return (
    <Box sx={{height: 'fit-content',
              textAlign: textAlign,
              color: 'black',
              fontWeight: fontWeight,
              fontFamily: fontFamily,
              fontSize: fontSize,
              whiteSpace: 'pre-wrap',
              paddingBottom: p}}>

    {children}
    </Box>
  )
}

const title = "Visualization of Folk Music"
const introText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
const howToRead = "How to read this visualization"

const titles = csv.map(d => d.title)
const filenames = csv.map(d => d.identifier)
const collections = ["goodman_vol_1", "goodman_vol_2", "IE_1797_BT_EB", "IE-2019-D-HLS", "IE-2021-KY-AP", "IE-2023-DL-TP"]
const creators = csv.map(d => d.creatorP)
const steps = ['Lyrics', 'Performance', 'Score', 'Collection'];
  
  
  
// ArcDiagramChart, CollectionOfTunesRangeChart, LyricsSimilarityMatrix, SpectogramChart]

const dividerStyle = {
  borderBottomWidth: '0.25rem',
  borderImage: 'linear-gradient(90deg, rgba(208, 182, 250, 1) , rgba(148, 187, 233, 1)) 1',
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

  const handleTuneChange = (event) => {
    setTune(event.target.value)
    const index = titles.indexOf(event.target.value);
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
              <Grid size={6}>
                <Item fontWeight={600} fontSize={'35px'} fontFamily={'playfair display'} textAlign='left' p={'1.5rem'}>{"The hidden patterns of song lyrics"}</Item>
              </Grid>
              <Grid size={6}>
                <Item textAlign={'right'}>
                  <Button onClick={handleOpen}>
                    <InfoIcon sx={{fontSize: {xs: '2rem', sm: '2.3rem', md: '2.6rem', lg: '2.8rem', xl: '3rem'}, color: "#673ab7"}}/>
                  </Button>
                  <HowToReadPopup open={open} handleClose={handleClose}/>
                </Item>
              </Grid>
              
            </Grid>
            <Grid size={5}>
              <Item fontWeight={500} fontSize={'16px'} fontFamily={'montserrat'} textAlign='left' p={'1.5rem'}>{`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`}</Item>
            </Grid>
            <Grid size={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <MusicPlayer filename={filename} tune={tune} creator={creator}/>
                {/* <SelectAutoWidth options={titles} tune={tune} handleChange={handleTuneChange}/> */}
            </Grid>

            
            <Grid container display={'flex'} alignItems={'center'}>
              {/* <Grid sx={{height: 'fit-content'}} size={12}>
                <LyricsSimilarityMatrix tuneIndex={filenames.indexOf(filename)}/>
              </Grid> */}
              {/* <Grid size={2}>
                <Item textAlign={'right'}>
                  <HorizontalLinearStepper steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
                </Item>
              </Grid> */}
            </Grid>
          </>
        )
      
      case 1: 
        return (
            <>
              <Grid size={7}>
                <Item fontWeight={600} fontSize={'25px'} fontFamily={'montserrat'} textAlign='left' p={'1.5rem'}>{"The hidden patterns of song lyrics"}</Item>
                <Item fontWeight={500} fontSize={'14px'} fontFamily={'montserrat'} textAlign='left'>{`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`}</Item>
              </Grid>
              {/* <Grid size={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <MusicPlayer filename={filename} tune={tune} creator={creator}/>
                <SelectAutoWidth options={titles} tune={tune} handleChange={handleTuneChange}/>
              </Grid> */}
              <Grid size={12}>
                {/* <SpectogramChart tune={filename}/> */}
              </Grid>
              <Grid container>
                <Grid size={1}>
                  <HorizontalLinearStepper steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
                </Grid>
                <Grid size={11}>
                </Grid>
              </Grid>
            </>
          )

      /* Arc Diagram */
      case 2:
        return (
          <>
          <Grid size={7}>
            <Item fontWeight={600} fontSize={'25px'} fontFamily={'montserrat'} textAlign='left' p={'1.5rem'}>{"The hidden patterns of song lyrics"}</Item>
            <Item fontWeight={500} fontSize={'14px'} fontFamily={'montserrat'} textAlign='left'>{`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`}</Item>
          </Grid>
          {/* <Grid size={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <MusicPlayer filename={filename} tune={tune} creator={creator}/>
            <SelectAutoWidth options={titles} tune={tune} handleChange={handleTuneChange}/>
          </Grid> */}
          <Grid container>
                <Grid size={1}>
                  <HorizontalLinearStepper steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
                </Grid>
                <Grid size={11}>
                </Grid>
              </Grid>
          <Grid size={12}>
            {/* <ArcDiagramChart tune={filename}/> */}
          </Grid>
          </>
        )
      /* Collection */
      case 3:
        return (
          <>
            <Grid size={7}>
              <Item fontWeight={600} fontSize={'25px'} fontFamily={'montserrat'} textAlign='left' p={'1.5rem'}>{"The hidden patterns of song lyrics"}</Item>
              <Item fontWeight={500} fontSize={'14px'} fontFamily={'montserrat'} textAlign='left'>{`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`}</Item>
            </Grid>
            <Grid container>
                <Grid size={1}>
                  <HorizontalLinearStepper steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
                </Grid>
                <Grid size={11}>
                </Grid>
              </Grid>
            <Grid width={'80vw'} marginLeft={'10vw'}  size={12} display={'flex'} alignItems={'center'} justifyContent={'normal'} columnGap={'10%'}>
              {/* <ScrollableTabsButtonVisible options={collections} value={collection} handleChange={handleCollectionChange}/> */}
              {/* <CollectionOfTunesRangeChart collection={collection}/> */}
            </Grid>
          </>
        )
      default:
        setActiveStep(0)
    }
  }

  return (
    <Box sx={{ flexGrow: 1, width: '80%',  margin: 'auto', alignItems: "stretch"}}>
      <Grid container spacing={2}>
        <Grid size={12}>
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
        </Grid>

        

      </Grid>
    </Box>
  )
}