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
import MusicPlayer from './MusicPlayer.jsx'

import csv from '../assets/data.csv'

/* import svgs */
import ScoreContour from '../assets/score-contour-label.svg';
import AudioContour from '../assets/audio-contour-label.svg';
import Matrix from '../assets/matrix.svg'
import GoodmanVol1 from '../assets/Goodman Volume 1.svg'
import GoodmanVol2 from '../assets/Goodman Volume 2.svg'
import OldIrishFolkMusicSongs from '../assets/Old Irish Folk Music and Songs.svg'
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

const titles = csv.map(d => d.title)
const filenames = csv.map(d => d.identifier)
const collections = ["Goodman Volume 1", "Goodman Volume 2", "Edward Bunting’s Collection", "Children’s songs, rhymes and riddles collected by Hugh Shields", "Selection of Manuscripts by Pádraig O'Keeffe", "Tommy Peoples", "Dance Music of Ireland", "Gems of Irish Melody", "Traditional Irish Dance Tunes Composed by James Kelly (vol.1)", "Jigs and Reels", "Ryan’s Mammoth Collection Part 1", "Ryan’s Mammoth Collection Part 2", "Old Irish Folk Music and Songs"]
const creators = csv.map(d => d.creatorP)
const steps = ['Lyrics', 'Rhyme', 'Performance', 'Score', 'Collection'];
const lyrics = csv.map(d => d.lyrics)

let collectionsData = [
  {title: "Tunes of the Munster Pipers Volume 1",
  p: "This two-volume book presents the manuscript collection of Irish music written by Canon James Goodman in the 1860s and preserved in the Library of Trinity College.",
  link: "https://www.itma.ie/shop/tunes-of-the-munster-pipers-vols-1-2/",
  img: GoodmanVol1}, 
  {title: "Tunes of the Munster Pipers Volume 2",
  p: "This two-volume book presents the manuscript collection of Irish music written by Canon James Goodman in the 1860s and preserved in the Library of Trinity College.",
  link: "https://www.itma.ie/shop/tunes-of-the-munster-pipers-vols-1-2/",
  img: GoodmanVol2}, 
  {title: "Edward Bunting’s First Published Collection of Irish Music, 1797",
  p: "A General Collection of the Ancient Irish Music, Containing a Variety of Admired Airs Never Before Published, and also the Compositions of Conolan and Carolan; Collected from the Harpers &c. in the Different Provinces of Ireland, and Adapted for the Piano-Forte",
  link: 'https://www.itma.ie/texts/bunting_1/',
  img: EdwardCollection},
  {title: "Palandri / O’Keeffe Selection for World Fiddle Day 2021",
  p: "To mark World Fiddle Day 2021 ITMA invited fiddle player Andrea Palandri to select his favourite tunes from the Caoimhín Mac Aoidh Pádraig O’Keeffe collection and other Pádraig O’Keeffe manuscripts in the ITMA collection.",
  link: "https://www.itma.ie/notated-collections/andrea-palandri/",
  img: SelectionManuscripts}, 
  {title: "Tommy Peoples: A Portrait of an Artist",
  p: "Tommy Peoples is amongst the most important and influential musicians of his time. This project is a snapshot of his musical life. Born in St Johnston in 1948, he spent parts of his life in Dublin, Co. Clare and Boston, returning to his childhood home in 2004. Tommy’s unique fiddle style and significant compositional output mark him as one of the most important figures in the history of Irish Traditional Music. He died in August 2018.\nAs part of the Tommy Peoples: A Portrait of an Artist project Tommy’s daughter, Siobhán Peoples, provided meticulous transcriptions of her father’s playing.",
  link: "https://www.itma.ie/notated-collections/transcriptions-from-the-playing-of-tommy-peoples/",
  img: TommyPeoples}, 
  {title: "Dance Music Of Ireland",
  p: "A selection of traditional dance music.",
  link: "",
  img: DanceMusic}, 
  {title: "Gems of Irish melody: a choice collection of folk music including jigs, reels, hornpipes, country dances, songs etc.",
  p: "The Scottish musicologist Alfred Edward Moffat (Edinburgh 1866 – London 1950) was a highly regarded scholar and editor of music, with a specialisation in early British composers for the violin.\n Alfred Moffat edited in the early 1900s various other undated Irish collections, such as his Gems of Irish Melody and Irish National Songs, and items of Irish sheet music.",
  link: "https://www.itma.ie/texts/moffat/",
  img: GemsIrishMelody}, 
  {title: "Traditional Irish dance tunes composed by James Kelly",
  p: "Reels, jigs, hornpipes, polkas, slides, barndances, strathspeys.",
  link: "https://itmacatalogues.ie/Portal/Default/en-GB/RecordView/Index/254781",
  img: TraditionalIrishDanceTunes}, 
  {title: "Jigs and Reels",
  p: "A compilation of various traditional irish jigs and reels.",
  link: "",
  img: JigsAndReels}, 
  {title: "Ryan’s Mammoth Collection Part. 1",
  p: "Ryan’s Mammoth Collection, published in Boston in 1883, was – and is – an important collection of traditional music, though comparatively little known among Irish traditional players today.\nRyan’s collection contains more than a thousand tunes and is known to have been a source of repertory for many prominent Irish players, including such notable players of complicated hornpipes as the fiddle players James Morrison and Seán Maguire.",
  link: "https://www.itma.ie/notated-collections/ryans-mammoth-collection-a/",
  img: RyanCollectionPart1}, 
  {title: "Ryan’s Mammoth Collection Part. 2",
  p: "Ryan’s Mammoth Collection, published in Boston in 1883, was – and is – an important collection of traditional music, though comparatively little known among Irish traditional players today.\nRyan’s collection contains more than a thousand tunes and is known to have been a source of repertory for many prominent Irish players, including such notable players of complicated hornpipes as the fiddle players James Morrison and Seán Maguire.",
  link: "https://www.itma.ie/notated-collections/ryans-mammoth-collection-a/",
  img: RyanCollectionPart2}, 
  {title: "Old Irish Folk Music & Songs",
  p: "Old Irish Folk Music and Songs is Joyce’s magnum opus in Irish music. It includes the melodies of songs (some with words in English) and a variety of dance tunes. About half come from Joyce’s musical memories of his childhood in rural Co Limerick during the years before the Great Famine.",
  link: "https://www.itma.ie/notated-collections/old-irish-folk-music-songs-a/",
  img: OldIrishFolkMusicSongs}
]

const dividerStyle = {
  borderBottomWidth: '0.35rem',
  borderImage: 'linear-gradient(90deg, #b589fc , #a0cafa) 1',
}

export default function GridLayout() {

  const [width, height] = useWindowSize()
  const [tune, setTune] = React.useState(titles[0])
  const [tuneName, setTuneName] = React.useState("Hover the chart to find out more");
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

              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>
              </Grid>
              
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
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.5rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '200px', maxHeight: '400px', overflow: 'auto'}}>
                    
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
              
              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>
              </Grid>
              
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
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingLeft={'1rem'}>Graph</Typography>
                    
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem' whiteSpace={'pre-line'}>
                    {"Each node represents the final word of a verse.\nNodes that rhyme are connected and share the same color.\nVerses ending with the same word are not considered rhymes and are shown as white circles."}
                    </Typography>

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

                <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                    <MusicPlayer filename={filename}></MusicPlayer>
                  </div>
                </Grid>

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
                <Typography variant='h4' fontFamily={'playfair display'} color='black'>Tune Range</Typography>
              </Grid>

              <Grid size={{xs: 1, sm: 3, md: 7, lg: 7, xl: 8}} display='flex' flexDirection='column' alignItems='flex-end' justifyContent="center">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>
              </Grid>
              
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

                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                      <div style={{width: `${window.innerWidth * 0.8 * 0.01}px`, height: `${window.innerWidth * 0.8 * 0.01}px`, background: '#F9DEF1', background: 'radial-gradient(circle,rgba(249, 222, 241, 1) 10%, rgba(104, 137, 252, 1) 95%)', borderRadius: '50%', opacity: '0.4'}}/>
                      <Typography variant='caption' color='black' fontFamily='montserrat' fontWeight='400' textAlign='center'>1</Typography>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                      <div style={{width: `${window.innerWidth * 0.8 * 0.10}px`, height: `${window.innerWidth * 0.8 * 0.10}px`, background: '#F9DEF1', background: 'radial-gradient(circle,rgba(249, 222, 241, 1) 10%, rgba(104, 137, 252, 1) 95%)', borderRadius: '50%', opacity: '0.4'}}/>
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

              <Grid size={5} paddingTop='2rem'>
                <Typography color='black' fontFamily='montserrat' fontWeight='500' variant='h6'>{collection}</Typography>
                <Typography color='black' fontFamily='montserrat' fontWeight='450' variant='p'>{tuneName}</Typography>
              </Grid>

              <Grid sx={{height: 'fit-content'}} size={9} id='grid-size'>
                <CollectionOfTunesRangeChart  interaction={true} collection={collection} setTuneName={setTuneName} titles={titles} gridId='grid-size'/>
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

              <Grid size={12} padding={'3rem'}></Grid>

              {collectionsData.map((data, i) => {
                return (
                  <Grid className="flip-card" size={4} id='small-multiples'>
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <img src={data.img} width={'100%'}></img>
                      </div>
                      <div class="flip-card-back">
                        <Typography padding={'1rem'} variant='body' color='black' fontFamily={'montserrat'} fontWeight={600}>{data.title}</Typography>
                        <Typography paddingLeft={'2rem'} paddingRight={'2rem'} paddingTop={'0.5rem'} paddingBottom={'1rem'} textAlign={'left'} variant='caption' color='black' fontFamily={'montserrat'}>{data.p}</Typography>
                      </div>
                    </div>
                  </Grid>
                )
              })}
             

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