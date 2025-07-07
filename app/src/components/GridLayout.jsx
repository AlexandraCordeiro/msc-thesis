/* custom components */
import CollectionOfTunesRangeChart from './CollectionOfTunesRangeChart.jsx'
import ArcDiagramChart from './ArcDiagramChart.jsx'
import SpectogramChart from './SpectogramChart.jsx'
import LyricsSimilarityMatrix from './LyricsSimilarityMatrix.jsx'
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
import { Chip, Icon, IconButton } from '@mui/material'
import MusicPlayer from './MusicPlayer.jsx'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import csv from '../assets/data.csv'

/* import svgs */
import ScoreContour from '../assets/score-contour-label.svg';
import AudioContour from '../assets/audio-contour-label.svg';
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
import ItmaLogo from '../assets/itma-logo.svg'
import CisucLogo from '../assets/cisuc-logo.svg'
import MailIcon from '../assets/mail.svg'

import RhymeGraph from './RhymeGraph.jsx'

const titles = csv.map(d => d.title)
const filenames = csv.map(d => d.identifier)
const collections = ["Goodman Volume 1", "Goodman Volume 2", "Edward Bunting’s Collection", "Children’s songs, rhymes and riddles collected by Hugh Shields", "Selection of Manuscripts by Pádraig O'Keeffe", "Tommy Peoples", "Dance Music of Ireland", "Gems of Irish Melody", "Traditional Irish Dance Tunes Composed by James Kelly (vol.1)", "Jigs and Reels", "Ryan’s Mammoth Collection Part 1", "Ryan’s Mammoth Collection Part 2", "Old Irish Folk Music and Songs"]
const creators = csv.map(d => d.creatorP)
const steps = ['Lyrics', 'Rhyme', 'Performance', 'Score', 'Collection'];
const lyrics = csv.map(d => d.lyrics)


let collectionsData = [
  {title: "Tunes of the Munster Pipers Volume 1",
  title2: "Munster Pipers Volume 1",
  p: "This two-volume book presents the manuscript collection of Irish music written by Canon James Goodman in the 1860s and preserved in the Library of Trinity College.",
  link: "https://www.itma.ie/notated-collections/tunes-of-the-munster-pipers-1-a/",
  img: GoodmanVol1,
  chips: ["James Goodman", "song airs", "dance tunes", "pipers", "1860s"]}, 
  {title: "Tunes of the Munster Pipers Volume 2",
  title2: "Munster Pipers Volume 2",
  p: "This two-volume book presents the manuscript collection of Irish music written by Canon James Goodman in the 1860s and preserved in the Library of Trinity College.",
  link: "https://www.itma.ie/notated-collections/tunes-of-the-munster-pipers-2-a/",
  img: GoodmanVol2,
  "chips": ["James Goodman", "song airs", "dance tunes", "pipers", "1860s"]}, 
  {title: "Edward Bunting’s First Published Collection of Irish Music, 1797",
  title2: "Edward Buntling's Collection",
  p: "A General Collection of the Ancient Irish Music, Containing a Variety of Admired Airs Never Before Published, and also the Compositions of Conolan and Carolan; Collected from the Harpers &c. in the Different Provinces of Ireland, and Adapted for the Piano-Forte",
  link: 'https://www.itma.ie/texts/bunting_1/',
  img: EdwardCollection,
  chips: ['1790s', 'Belfast', 'Edward Buntling', 'irish harp', 'piano-forte']},
  {title: "Palandri / O’Keeffe Selection for World Fiddle Day 2021",
  p: "To mark World Fiddle Day 2021 ITMA invited fiddle player Andrea Palandri to select his favourite tunes from the Caoimhín Mac Aoidh Pádraig O’Keeffe collection and other Pádraig O’Keeffe manuscripts in the ITMA collection.",
  title2: "Pádraig O’Keeffe collection",
  link: "https://www.itma.ie/notated-collections/andrea-palandri/",
  img: SelectionManuscripts,
  chips: ['20th century', 'Pádraig O\'Keeffe', 'Andrea Palandri', 'fiddle', 'violin']}, 
  {title: "Tommy Peoples: A Portrait of an Artist",
  title2: "Tommy Peoples",
  p: "Tommy Peoples is amongst the most important and influential musicians of his time. This project is a snapshot of his musical life. Born in St Johnston in 1948, he spent parts of his life in Dublin, Co. Clare and Boston, returning to his childhood home in 2004. Tommy’s unique fiddle style and significant compositional output mark him as one of the most important figures in the history of Irish Traditional Music. He died in August 2018.\nAs part of the Tommy Peoples: A Portrait of an Artist project Tommy’s daughter, Siobhán Peoples, provided meticulous transcriptions of her father’s playing.",
  link: "https://www.itma.ie/notated-collections/transcriptions-from-the-playing-of-tommy-peoples/",
  img: TommyPeoples,
  chips: ['fiddle', 'violin', 'Tommy Peoples']}, 
  {title: "Dance Music Of Ireland",
  title2: "Dance Music Of Ireland",
  p: "A selection of traditional dance music.",
  link: "https://www.itma.ie/explore/dance/",
  img: DanceMusic,
  chips: ['dance music', 'instrumental music']}, 
  {title: "Gems of Irish melody: a choice collection of folk music including jigs, reels, hornpipes, country dances, songs etc.",
  title2: "Gems of Irish Melody",
  p: "The Scottish musicologist Alfred Edward Moffat (Edinburgh 1866 – London 1950) was a highly regarded scholar and editor of music, with a specialisation in early British composers for the violin.\n Alfred Moffat edited in the early 1900s various other undated Irish collections, such as his Gems of Irish Melody and Irish National Songs, and items of Irish sheet music.",
  link: "https://www.itma.ie/texts/moffat/",
  img: GemsIrishMelody,
  chips: ['1900s', 'Alfred Moffat', 'jigs', 'reels', 'hornpipes', 'dance music']}, 
  {title: "Traditional Irish dance tunes composed by James Kelly",
  title2: "Traditional Irish dance tunes",
  p: "Reels, jigs, hornpipes, polkas, slides, barndances, strathspeys.",
  link: "https://itmacatalogues.ie/Portal/Default/en-GB/RecordView/Index/254781",
  img: TraditionalIrishDanceTunes,
  chips: ['reels', 'jigs', 'hornpipes', 'polkas', 'barndances', 'strathspeys']}, 
  {title: "Jigs and Reels",
  title2: "Jigs and Reels",
  p: "A compilation of various traditional irish jigs and reels.",
  link: "https://www.itma.ie/explore/tunes/",
  img: JigsAndReels,
  chips: ['jigs', 'reels', 'instrumental music']}, 
  {title: "Ryan’s Mammoth Collection Part. 1",
  title2: "Ryan’s Collection Part. 1",
  p: "Ryan’s Mammoth Collection, published in Boston in 1883, was – and is – an important collection of traditional music, though comparatively little known among Irish traditional players today.\nRyan’s collection contains more than a thousand tunes and is known to have been a source of repertory for many prominent Irish players, including such notable players of complicated hornpipes as the fiddle players James Morrison and Seán Maguire.",
  link: "https://www.itma.ie/notated-collections/ryans-mammoth-collection-a/",
  img: RyanCollectionPart1,
  chips: ['1880s', 'Boston', 'fiddle', 'violin']}, 
  {title: "Ryan’s Mammoth Collection Part. 2",
    title2: "Ryan’s Collection Part. 2",
  p: "Ryan’s Mammoth Collection, published in Boston in 1883, was – and is – an important collection of traditional music, though comparatively little known among Irish traditional players today.\nRyan’s collection contains more than a thousand tunes and is known to have been a source of repertory for many prominent Irish players, including such notable players of complicated hornpipes as the fiddle players James Morrison and Seán Maguire.",
  link: "https://www.itma.ie/notated-collections/ryans-mammoth-collection-a/",
  img: RyanCollectionPart2,
  chips: ['1880s', 'Boston', 'fiddle', 'violin']}, 
  {title: "Old Irish Folk Music & Songs",
  title2: "Old Irish Folk Music & Songs",
  p: "Old Irish Folk Music and Songs is Joyce’s magnum opus in Irish music. It includes the melodies of songs (some with words in English) and a variety of dance tunes. About half come from Joyce’s musical memories of his childhood in rural Co Limerick during the years before the Great Famine.",
  link: "https://www.itma.ie/texts/joyce-oifms/",
  img: OldIrishFolkMusicSongs,
  chips: ['songs', 'dance music', '1910s', 'Patrick Weston Joyce']}
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
  const [graphWidth, setGraphWidth] = React.useState(0)
  const [minDb, setMinDb] = React.useState('min')
  const [maxDb, setMaxDb] = React.useState('max')
  const [maxCount, setMaxCount] = React.useState('max')
  const mailto = "mailto:acordeiro2002@gmail.com"
  const itmaLink = "https://www.itma.ie/"
  const cisucLink = "https://www.cisuc.uc.pt/en/projects/ea-digifolk"

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

  const handleCollectionChange = (newValue) => {
    setCollection(newValue);
  };

  const selectViz = (activeStep) => {
    switch (activeStep) {
      /* Lyrics */
      case 0:
        return (
          
          <>
            <Grid container>
              <Grid size={{xs: 12, md: 9}} id='grid-size'>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                  <div style={{width: '50%'}}>
                    <Typography variant='h4' fontFamily={'playfair display'} color='black'>Lyrics</Typography>
                  </div>
                  <div>
                    <Typography variant='body' color={'black'} fontFamily='montserrat' paddingTop={'1rem'}>Similarity matrix where cell (𝑖, 𝑗) is filled if word 𝑖 in a song's lyrics is the same as word 𝑗.</Typography>
                  </div>
                </div>
                <div style={{'paddingTop': '2rem'}}>
                  <LyricsSimilarityMatrix tuneIndex={filenames.indexOf(filename)} gridId={'grid-size'}/>
                </div>
              </Grid>

              <Grid size={{xs: 12, md: 3}} display='flex' flexDirection='column' alignItems='center' justifyContent="flex-start" paddingBottom={'1rem'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                  <DropdownMenu options={titles} handleChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </div>
                 <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '3rem'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.5rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '200px', maxHeight: '400px', overflow: 'auto'}}>                   
                    <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' padding='1rem' >Lyrics</Typography>              
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem' whiteSpace='pre-line'>{lyrics[filenames.indexOf(filename)]}</Typography>
                </div>
              </Grid>          
            </Grid>
          </>
        )
      
      case 1:
        return (
          <>
            <Grid container>

              <Grid size={{xs: 12, md: 9}} id='grid-size'>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                  <div style={{width: '50%'}}>
                    <Typography variant='h4' fontFamily={'playfair display'} color='black'>Rhyme</Typography>
                  </div>
                  <div>
                    <Typography variant='body' color='black' fontFamily={'montserrat'} whiteSpace={'pre-line'}>
                      {"Each node represents the final word of a verse.\nNodes that rhyme are connected and share the same color.\nVerses ending with the same word are not considered rhymes and are shown as white circles."}
                    </Typography>
                  </div>
                </div>
                <div style={{'paddingTop': '2rem'}}>
                  <RhymeGraph tuneIndex={filenames.indexOf(filename)} gridId={'grid-size'}/>
                </div>
              </Grid>

              <Grid size={{xs: 12, md: 3}} display='flex' flexDirection='column' alignItems='center' justifyContent="flex-start" paddingBottom={'1rem'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                  <DropdownMenu options={titles} handleChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </div>
                 <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '3rem'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', borderRadius: '0.5rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '200px', maxHeight: '400px', overflow: 'auto'}}>                   
                    <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' padding='1rem' >Lyrics</Typography>              
                    <Typography variant='caption' color={'black'} fontFamily='montserrat' padding='1rem' whiteSpace='pre-line'>{lyrics[filenames.indexOf(filename)]}</Typography>
                </div>
              </Grid>           
            </Grid>
          </>
        )
      /* Spectogram */
      case 2: 
        return (
            <>
              <Grid container>
                <Grid size={{xs: 12, md: 9}} id='grid-size'>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                  <div style={{width: '50%'}}>
                    <Typography variant='h4' fontFamily={'playfair display'} color='black'>Performance</Typography>
                  </div>
                  <div>
                    <Typography variant='body' color='black' fontFamily={'montserrat'} whiteSpace={'pre-line'}>
                      {"Visual representation of the frequency spectrum of a signal as it varies over time.\nColor intensity indicates the amplitude in decibels (dB).\n\nThe letters C, D, E, F, G, A, B correspond to the solfege system Do, Re, Mi, Fa, Sol, La, Si. Numbers indicate the octave of the note."}
                    </Typography>
                  </div>
                </div>
                <div style={{'paddingTop': '2rem'}}>
                  <SpectogramChart key={filename} tune={filename} gridId={'grid-size'} setMaxDb={setMaxDb} setMinDb={setMinDb}/>
                </div>
              </Grid>

              <Grid size={{xs: 12, md: 3}} display='flex' flexDirection='column' alignItems='center' justifyContent="flex-start" paddingBottom={'1rem'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                  <DropdownMenu options={titles} handleChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </div>
                 <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '3rem'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', padding: '10px', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '180px'}}>
                  
                  <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' paddingBottom={'1rem'}>How to Read</Typography>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingBottom={'1rem'}>Loudness (Db)</Typography>
                  <div style={{width: '100%', height: '25px', background: 'linear-gradient(90deg, #e0f4fd, #390160)', borderRadius: '0.25rem'}}/>
                  <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent:'space-between', paddingBottom:'1rem'}}>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>{minDb}</Typography>
                    <Typography variant='caption' color={'black'} fontFamily='montserrat'>{maxDb}</Typography>
                  </div>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Score melodic contour</Typography>
                  <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}>
                    <img src={ScoreContour} style={{paddingBottom:'1rem'}}></img>
                  </div>
                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'}>Performance melodic contour</Typography>
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
              <Grid size={{xs: 12, md: 9}} id='grid-size'>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                  <div style={{width: '50%'}}>
                    <Typography variant='h4' fontFamily={'playfair display'} color='black'>Music Intervals</Typography>
                  </div>

                  <div>
                    <Typography variant='body' color='black' fontFamily={'montserrat'} whiteSpace={'pre-line'}>
                      {"Each arc shows a musical interval, which is the distance between two consecutive notes in a piece of music.\nAscending intervals are displayed above the x axis, and vice-versa."}
                    </Typography>
                  </div>
                </div>

                <div style={{'paddingTop': '2rem'}}>
                  <ArcDiagramChart tune={filename} gridId={'grid-size'} setMaxCount={setMaxCount}/>
                </div>
              </Grid>

              <Grid size={{xs: 12, md: 3}} display='flex' flexDirection='column' alignItems='center' justifyContent="flex-start" paddingBottom={'1rem'}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a tune</Typography>
                  <DropdownMenu options={titles} handleChange={handleTuneChange} selectedValue={tune}></DropdownMenu>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '3rem'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Play</Typography>
                  <MusicPlayer filename={filename}></MusicPlayer>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', background: 'white', padding: '10px', borderRadius: '0.7rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '180px'}}>
                  
                  <Typography variant='h5' textAlign={'center'} color='black' fontFamily='playfair display' paddingBottom={'1rem'}>How to Read</Typography>

                  <Typography variant='caption' color={'black'} fontFamily='montserrat' fontWeight={'500'} paddingTop='1rem' paddingBottom={'1rem'}>Total Note Count</Typography>

                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                      <div style={{width: `${window.innerWidth * 0.8 * 0.01}px`, height: `${window.innerWidth * 0.8 * 0.01}px`, background: '#F9DEF1', background: 'radial-gradient(circle,rgba(249, 222, 241, 1) 10%, rgba(104, 137, 252, 1) 95%)', borderRadius: '50%', opacity: '0.4'}}/>
                      <Typography variant='caption' color='black' fontFamily='montserrat' fontWeight='400' textAlign='center'>1</Typography>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                      <div style={{width: `${window.innerWidth * 0.8 * 0.10}px`, height: `${window.innerWidth * 0.8 * 0.10}px`, background: '#F9DEF1', background: 'radial-gradient(circle,rgba(249, 222, 241, 1) 10%, rgba(104, 137, 252, 1) 95%)', borderRadius: '50%', opacity: '0.4'}}/>
                      <Typography variant='caption' color='black' fontFamily='montserrat' fontWeight='400' textAlign='center'>{maxCount}</Typography>
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
              <Grid size={{xs: 12, md: 9}} id='grid-size'>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                  <div style={{width: '50%'}}>
                    <Typography variant='h4' fontFamily={'playfair display'} color='black'>Collection of Tunes</Typography>
                  </div>

                  <div style={{width: '70%', paddingTop: '1rem', position:'sticky', top:'0'}}>
                    <Typography color='black' fontFamily='montserrat' fontWeight='500' variant='h6'>{collection}</Typography>
                    <Typography color='black' fontFamily='montserrat' fontWeight='450' variant='p'>{tuneName}</Typography>
                  </div>
                </div>

                <div style={{'paddingTop': '2rem'}}>
                  <CollectionOfTunesRangeChart  interaction={true} collection={collection} setTuneName={setTuneName} titles={titles} gridId='grid-size'/>
                </div>
              </Grid>

              <Grid size={{xs: 12, md: 3}} display='flex' flexDirection='column' alignItems='center' justifyContent="flex-start" paddingBottom={'1rem'}>
                <div style={{display: 'flex', flexDirection: 'column', paddingBottom: '2rem'}}>
                  <Typography variant='caption' color='black' fontFamily={'montserrat'} fontWeight={500}>Select a collection</Typography>
                  <DropdownMenu options={collections} handleChange={handleCollectionChange} selectedValue={collection}></DropdownMenu>
                </div>

                <div sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: "flex-end", paddingTop: '1rem'}}>
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

                </div>
              </Grid>

              <Grid size={12} padding={'1rem'}></Grid>
              <Grid size={12}>
                <Typography color='black' fontFamily='playfair display' fontWeight='500' variant='h4' paddingBottom='2rem'>Other Folk Collections</Typography>
              </Grid>
              
              {collectionsData.map((data, i) => {
                return (
                  <>
                    <Grid size={4} id='small-multiples' style={{display: 'flex', flexDirection: 'column', alignContent: 'center', gap: '0.5rem'}}>
                      <div style={{height: '100%', width: '90%'}}>
                        <Typography variant='body' color='black' fontFamily={'montserrat'} fontWeight={500}>{data.title2}</Typography>
                      </div>
                      <div className="flip-card">
                        <div class="flip-card-inner">
                          <div class="flip-card-front">
                            
                            <img src={data.img} width={'100%'}></img>
                          </div>
                          <div class="flip-card-back">
                            <Typography padding={'1rem'} variant='body' color='black' fontFamily={'montserrat'} fontWeight={600}>{data.title}</Typography>
                            <Typography paddingLeft={'2rem'} paddingRight={'2rem'} paddingTop={'0.5rem'} paddingBottom={'1rem'} textAlign={'left'} variant='caption' color='black' fontFamily={'montserrat'}>{data.p}</Typography>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: '5px', padding: '2rem'}}>
                            {data.chips.map((chip) => {
                                return <Chip variant="outlined" color='#d1b8fd' label={`${chip}`} sx={{fontFamily: 'montserrat', fontWeight: 450, background: '#f0e6ff', border: '1px'}}/> 
                              })}
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding:'2rem', gap: '0.5rem'}}>
                              
                              <IconButton sx={{borderRadius: '0.5rem'}}
                              onClick={() => {
                                window.open(`${data.link}`, '_blank')
                              }}>
                                <div style={{display: 'flex', flexDirection: 'row', padding: '0.5rem', textWrap: 'wrap'}}>
                                  <Typography variant='caption' color='black' fontFamily={'montserrat'} paddingRight={'5px'} fontWeight={500}>Click to learn more</Typography>
                                  <OpenInNewIcon sx={{color: ' #b589fc', fontSize: '1.2rem'}}/>
                                </div>
                              </IconButton>  
                            </div>
                          </div>
                        </div>
                      </div>

                    </Grid>
                  </>
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

    <Grid container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>

      <Box sx={{width: '80%', display: 'flex', alignItems: 'flex-start'}}>
        <Grid container spacing={10}>

            
            <Grid size={{xs: 11, sm: 9, md: 6, lg: 5, xl: 4}} paddingTop={{xs: '7rem'}}>
              <Typography variant='h2' fontFamily={'playfair display'} color={'black'} fontWeight={500} textAlign={'left'}>
                Visualization of Folk Music
              </Typography>
            </Grid>

            <Grid size={{xs: 10, sm: 8, md: 6, xl: 5}} paddingTop={{xs: '1rem', md: '7rem'}} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
              <Typography variant='body' fontFamily={'montserrat'} color={'black'} fontWeight={500} whiteSpace={'pre-line'}>
                {"Folk music's recovery and transmission have gained the authorities' attention as a way of preserving this intangible asset, which is being accelerated by the depopulation of rural areas and the loss of the function of this music, along with changes in musical transmission.\n\nThe following visualizations aim to highlight interesting patterns about traditional Irish music."}
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
      <Grid size={12} sx={{height: 'fit-content', display: 'flex',  marginTop: '10rem', alignItems: 'flex-end', paddingBottom: '0.5rem', flexWrap: 'wrap', flexDirection: 'row'}}>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginLeft: '10%', flexWrap: 'wrap'}}>
          <IconButton style={{display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-end', height: 'fit-content', padding: '1rem', borderRadius: '0.5rem'}}
          onClick={(e) => {window.location.href = mailto; e.preventDefault()}}>
            <div>
              <img src={MailIcon} height={'16px'}></img>
            </div>
            <div>
              <Typography fontFamily={'montserrat'} color='black' fontWeight='400'>Contact</Typography>
            </div>
          </IconButton>

          <IconButton style={{display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-end', height: 'fit-content', padding: '1rem', borderRadius: '0.5rem'}}
          onClick={() => {window.open(`${cisucLink}`, '_blank')}}>
            <div>
              <img src={CisucLogo} height={'16px'}></img>
            </div>
            <div>
              <Typography fontFamily={'montserrat'} color='black' fontWeight='400'>About the project</Typography>
            </div>
          </IconButton>

          <IconButton style={{display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-end', height: 'fit-content', padding: '1rem', borderRadius: '0.5rem'}}
          onClick={() => {window.open(`${itmaLink}`, '_blank')}}>
            <div>
              <img src={ItmaLogo} height={'16px'}></img>
            </div>
            <div>
              <Typography fontFamily={'montserrat'} color='black' fontWeight='400'>Data Collection</Typography>
            </div>
          </IconButton>
        </div>

      </Grid>
    </Grid>
    
  )
}