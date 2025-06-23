/* custom components */

import CollectionOfTunesRangeChart from './CollectionOfTunesRangeChart.jsx'
import ArcDiagramChart from './ArcDiagramChart.jsx'
import SpectogramChart from './SpectogramChart.jsx'
import LyricsSimilarityMatrix from './LyricsSimilarityMatrix.jsx'
import VerticalSteps from './VerticalSteps.jsx'
import DropdownMenu from './DropdownMenu.jsx'
import { useWindowSize } from './UseWindowSize.jsx'
import HorizontalNonLinearStepper from './HorizontalNonLinearStepper.jsx'
/* other components */
import { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { IconButton } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import csv from '../assets/data.csv'

/* import svgs */
import ScoreContour from '../assets/score-contour-label.svg';
import AudioContour from '../assets/audio-contour-label.svg';
import Matrix from '../assets/matrix.svg'
import GoodmanVol1 from '../assets/Goodman Volume 1.svg'
import GoodmanVol2 from '../assets/Goodman Volume 2.svg'
import OldIrishFolkMusicSongs from '../assets/Old Irish Folk Music and Songs.svg'
import FolkSongbook from '../assets/Folk Songbook.svg'
import ArchivoDublin from '../assets/Archivo Dublin.svg'
import CollectionOfCountryDances from '../assets/Collection of Country Dances.svg'
import ChildrenSongs from '../assets/Children’s songs, rhymes and riddles collected by Hugh Shields.svg'
import EdwardCollection from '../assets/Edward Bunting’s Collection.svg'
import JigsAndReels from '../assets/Jigs and Reels.svg'
import RyanCollectionPart2 from '../assets/Ryan’s Mammoth Collection Part 2.svg'
import RyanCollectionPart1 from '../assets/Ryan’s Mammoth Collection Part 1.svg'
import TraditionalIrishDanceTunes from '../assets/Traditional Irish Dance Tunes Composed by James Kelly (vol.1).svg'
import TommyPeoples from '../assets/Tommy Peoples.svg'
import SelectionManuscripts from '../assets/Selection of Manuscripts by Pádraig O\'Keeffe.svg'
import GemsIrishMelody from '../assets/Gems of Irish Melody.svg'
import DanceMusic from '../assets/Dance Music of Ireland.svg'
import RhymeGraph from './RhymeGraph.jsx'

const title = "Visualization of Folk Music"
const introText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
const howToRead = "How to read this visualization"

const titles = csv.map(d => d.title)
const filenames = csv.map(d => d.identifier)
const collections = ["Goodman Volume 1", "Goodman Volume 2", "Edward Bunting’s Collection", "Children’s songs, rhymes and riddles collected by Hugh Shields", "Selection of Manuscripts by Pádraig O'Keeffe", "Tommy Peoples", "Archivo Dublin", "Folk Songbook", "Collection of Country Dances", "Dance Music of Ireland", "Gems of Irish Melody", "Traditional Irish Dance Tunes Composed by James Kelly (vol.1)", "Jigs and Reels", "Ryan’s Mammoth Collection Part 1", "Ryan’s Mammoth Collection Part 2", "Old Irish Folk Music and Songs"]
const creators = csv.map(d => d.creatorP)
const steps = ['Lyrics', 'Rhyme', 'Performance', 'Score', 'Collection'];
const lyrics = csv.map(d => d.lyrics)


const dividerStyle = {
  borderBottomWidth: '0.35rem',
  borderImage: 'linear-gradient(90deg, #b589fc , #a0cafa) 1',
}


export default function GridLayout() {

  const [width, height] = useWindowSize()
  const [tune, setTune] = React.useState(titles[0])
  const [tuneName, setTuneName] = React.useState("Hover chart to find out more");
  const [collection, setCollection] = React.useState(collections[3])
  const [filename, setFilename] = React.useState(filenames[0])
  const [creator, setCreator] = React.useState(creators[0])
  const [activeStep, setActiveStep] = React.useState(0);
  const [buttonClick, setButton] = React.useState(false);
  const handleButton = () => setButton(!buttonClick);
  const [graphWidth, setGraphWidth] = React.useState(0)


  useEffect(() => {
    setGraphWidth(width * 0.9)
  }, [width])
  
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
              <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}} id='section-title'>
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>The hidden patterns in song lyrics</Typography>
              </Grid>
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}></Grid>
              
              <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                <Typography variant='body' color='black' fontFamily={'montserrat'}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </Typography>
              </Grid>

              <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                    <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                  </div>
              </Grid>
            
              <Grid sx={{height: 'fit-content'}} size={9} id='grid-size'>
                <LyricsSimilarityMatrix tuneIndex={filenames.indexOf(filename)} gridId={'grid-size'}/>
              </Grid>


                <Grid size={3} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                  {buttonClick ? (
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.5rem', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 10px', width: '200px', maxHeight: '400px', overflow: 'auto'}}>
                    
                    <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' padding='1rem' >Lyrics</Typography>
                    
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem' whiteSpace='pre-line'>{lyrics[filenames.indexOf(filename)]}</Typography>

                    <div style={{alignSelf: 'center', padding:'1rem'}}>
                      <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Go back</Typography>
                      <IconButton onClick={handleButton}>
                        <KeyboardArrowLeftIcon/>
                      </IconButton>
                    </div>
                  </div>

                  ) : 
                  (
                  <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '200px'}}>
                    <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' padding={'1rem'}>How to Read</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Matrix</Typography>
                    
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem'>
                    Similarity matrix where cell (i, j) is filled if word i in a song's lyrics is the same as word j
                    </Typography>

                    <div style={{alignSelf: 'center'}}>
                        <img src={Matrix} style={{paddingBottom:'1rem'}}></img>
                    </div>

                    <div style={{alignSelf: 'center', padding:'1rem'}}>
                      <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Show lyrics</Typography>
                      <IconButton onClick={handleButton}>
                        <KeyboardArrowRightIcon/>
                      </IconButton>
                    </div>
                  </div>
                  )}
                </Grid>

            </Grid>
          </>
        )
      
      case 1:
        return (
          <>
            <Grid container>
              <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}} id='section-title'>
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>Rhyme</Typography>
              </Grid>
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}></Grid>
              
              <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                <Typography variant='body' color='black' fontFamily={'montserrat'}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </Typography>
              </Grid>

              <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                    <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                  </div>
              </Grid>
            
              <Grid sx={{height: 'fit-content', paddingTop: '3rem'}} size={9} id='grid-size'>
                <RhymeGraph tuneIndex={filenames.indexOf(filename)} gridId={'grid-size'}/>
              </Grid>


                <Grid size={3} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center" paddingTop= '3rem'>
                  {buttonClick ? (
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.5rem', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 10px', width: '200px', maxHeight: '400px', overflow: 'auto'}}>
                    
                    <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' padding='1rem' >Lyrics</Typography>
                    
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem' whiteSpace='pre-line'>{lyrics[filenames.indexOf(filename)]}</Typography>

                    <div style={{alignSelf: 'center', padding:'1rem'}}>
                      <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Go back</Typography>
                      <IconButton onClick={handleButton}>
                        <KeyboardArrowLeftIcon/>
                      </IconButton>
                    </div>
                  </div>

                  ) : 
                  (
                  <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '200px'}}>
                    <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' padding={'1rem'}>How to Read</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Matrix</Typography>
                    
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem'>
                    Similarity matrix where cell (i, j) is filled if word i in a song's lyrics is the same as word j
                    </Typography>

                    <div style={{alignSelf: 'center'}}>
                        <img src={Matrix} style={{paddingBottom:'1rem'}}></img>
                    </div>

                    <div style={{alignSelf: 'center', padding:'1rem'}}>
                      <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Show lyrics</Typography>
                      <IconButton onClick={handleButton}>
                        <KeyboardArrowRightIcon/>
                      </IconButton>
                    </div>
                  </div>
                  )}
                </Grid>

            </Grid>
          </>
        )
      /* Spectogram */
      case 2: 
        return (
            <>
              <Grid container>
                <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}>
                  <Typography variant='h4' fontFamily={'playfair display'} color='black'>How performance differs from the score</Typography>
                </Grid>
                <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}></Grid>
                
                <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                  <Typography variant='body' color='black' fontFamily={'montserrat'}>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                  </Typography>
                </Grid>
                <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                    <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                  </div>
                </Grid>
              
              

              <Grid sx={{height: 'fit-content'}} size={9} id='grid-size'>
                <SpectogramChart key={filename} tune={filename} gridId={'grid-size'}/>
              </Grid>


              <Grid size={3} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', padding: '10px', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '180px'}}>
                  
                  <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' paddingBottom={'1rem'}>How to Read</Typography>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingBottom={'1rem'}>Loudness</Typography>
                  <div style={{width: '100%', height: '25px', background: 'linear-gradient(90deg, #e0f4fd, #390160)', borderRadius: '0.25rem'}}/>
                  <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent:'space-between', paddingBottom:'1rem'}}>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>min</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>max</Typography>
                  </div>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Score Contour</Typography>
                  <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}>
                    <img src={ScoreContour} style={{paddingBottom:'1rem'}}></img>
                  </div>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Audio Contour</Typography>
                  <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}>
                    <img src={AudioContour}></img>
                  </div>
                </div>
              </Grid>

            </Grid>

            </>
          )

      /* Arc Diagram */
      case 3:
        return (
          <>
            <Grid container>
              <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}>
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>The hidden patterns in song lyrics</Typography>
              </Grid>
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}></Grid>
              
              <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                <Typography variant='body' color='black' fontFamily={'montserrat'}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </Typography>
              </Grid>
              <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}} paddingTop={'1rem'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                    <DropdownMenu options={titles} handleTuneChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                  </div>
              </Grid>

                <Grid sx={{height: 'fit-content'}} size={9} id='grid-size'>
                  <ArcDiagramChart tune={filename} gridId={'grid-size'}/>
                </Grid>

                <Grid size={3} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', padding: '10px', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '180px'}}>
                  
                  <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' paddingBottom={'1rem'}>How to Read</Typography>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingBottom={'1rem'}>Musical Intervals</Typography>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat'>
                  Each arc shows a musical interval, which is the distance between two adjacent notes in a piece of music.
                  </Typography>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingTop='1rem' paddingBottom={'1rem'}>Total Note Count</Typography>

                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7}}>

                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                      <div style={{width: `${window.innerWidth * 0.8 * 0.02}px`, height: `${window.innerWidth * 0.8 * 0.02}px`, background: '#F9DEF1', background: 'radial-gradient(circle,rgba(249, 222, 241, 1) 10%, rgba(104, 137, 252, 1) 95%)', borderRadius: '50%', opacity: '0.4'}}/>
                      <Typography variant='caption' color='black' fontFamily='montserrat' fontWeight='400' textAlign='center'>1</Typography>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                      <div style={{width: `${window.innerWidth * 0.8 * 0.11}px`, height: `${window.innerWidth * 0.8 * 0.11}px`, background: '#F9DEF1', background: 'radial-gradient(circle,rgba(249, 222, 241, 1) 10%, rgba(104, 137, 252, 1) 95%)', borderRadius: '50%', opacity: '0.4'}}/>
                      <Typography variant='caption' color='black' fontFamily='montserrat' fontWeight='400' textAlign='center'>max</Typography>
                    </div>

                  </div>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingBottom={'1rem'}>Note Range</Typography>
                  <div style={{width: '100%', height: '25px', background: 'linear-gradient(90deg, #fc00ff 0%, #00dbde 100%)', borderRadius: '0.25rem'}}/>
                  <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent:'space-between', paddingBottom:'1rem'}}>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>C1</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>G4</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>C8</Typography>
                  </div>

                  
         
                </div>
              </Grid>

            </Grid>

            

          </>
        )
        
        /* Collection of Tunes */
        case 4:
          return (
            <>
            <Grid container>

              <Grid size={{xs: 11, sm: 9, md: 5, lg: 5, xl: 4}}>
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>A look into the whole collection</Typography>
              </Grid>
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}}></Grid>
              
              <Grid size={{xs: 7, sm: 7, md: 5, xl: 4}} paddingTop={'1rem'}>
                <Typography variant='body' color='black' fontFamily={'montserrat'}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </Typography>
              </Grid>

              <Grid size={{xs: 5, sm: 5, md: 7, xl: 8}}></Grid>

              <Grid size={4} paddingTop='1rem'>
                <Typography color='black' fontFamily='montserrat' fontWeight='500' variant='h5'>{collection}</Typography>
                <Typography color='black' fontFamily='montserrat' fontWeight='500' variant='p'>{tuneName}</Typography>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={9} id='grid-size'>
                <CollectionOfTunesRangeChart  interaction={true} collection={collection} setTuneName={setTuneName} gridId='grid-size'/>
              </Grid>

              <Grid size={3} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', padding: '10px', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '180px'}}>
                  
                  <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' paddingBottom={'1rem'}>How to Read</Typography>


                  <Typography variant='caption' color={'black'} fontFamily='montserrat' style={{whiteSpace: "pre-line"}}>
                  {"Each radial line represents an arc diagram for a tune in the collection.\nAs in the previous visualisation, the arc diagrams refer to musical intervals."}
                  </Typography>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingBottom={'1rem'} paddingTop={'1rem'}>Note Range</Typography>
                  <div style={{width: '100%', height: '25px', background: 'linear-gradient(90deg, #fc00ff 0%, #00dbde 100%)', borderRadius: '0.25rem'}}/>
                  <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent:'space-between', paddingBottom:'1rem'}}>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>C1</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>G4</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>C8</Typography>
                  </div>
        
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center' id='small-multiples'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[0]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={GoodmanVol1} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[1]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={GoodmanVol2} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[2]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={EdwardCollection} width={'100%'}></img>
                </div>
              </Grid>

              <Grid size={12} padding={'2rem'}/>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[3]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={ChildrenSongs} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[4]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={SelectionManuscripts} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography  extAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[11]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={TraditionalIrishDanceTunes} width={'100%'}></img>
                </div>
              </Grid>

              <Grid size={12} padding={'2rem'}/>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[6]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={ArchivoDublin} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[7]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={FolkSongbook} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[8]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={CollectionOfCountryDances} width={'100%'}></img>
                </div>
              </Grid>

              <Grid size={12} padding={'2rem'}/>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[9]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={DanceMusic} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography  extAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[10]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={GemsIrishMelody} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography textAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[5]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={TommyPeoples} width={'100%'}></img>
                </div>
              </Grid>
              

              <Grid size={12} padding={'2rem'}/>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography  extAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[12]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={JigsAndReels} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography  extAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[13]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={RyanCollectionPart1} width={'100%'}></img>
                </div>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography  extAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[14]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={RyanCollectionPart2} width={'100%'}></img>
                </div>
              </Grid>

              <Grid size={12} padding={'2rem'}/>

              <Grid sx={{height: 'fit-content'}} size={4} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems='center'>
                <Typography  extAlign='center' variant='body' color={'black'} fontFamily='montserrat' fontWeight='500'>{`${collections[15]}`}</Typography>
                <div style={{background: 'white', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '95%'}}>
                  <img src={OldIrishFolkMusicSongs} width={'100%'}></img>
                </div>
              </Grid>

          </Grid>
          </>
          )
      default:
        setActiveStep(0)
    }
  }


  return (

    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>

      <Box sx={{width: '80%', display: 'flex', alignItems: 'flex-start'}}>
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

            <Grid size={12}>
              <Divider sx={dividerStyle}></Divider>
            </Grid>
            
            <Grid size={12}>
              <HorizontalNonLinearStepper steps={steps} activeStep={activeStep} setActiveStep={setActiveStep}/>
            </Grid>

            {/* selected visualization */}
            <Grid size={12}>
              {selectViz(activeStep)}
            </Grid>         
        </Grid>
      </Box>
    </Box>
    
  )
}