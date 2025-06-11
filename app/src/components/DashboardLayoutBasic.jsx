import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import { Typography, Divider, IconButton, Tooltip } from '@mui/material';
import LyricsSimilarityMatrix from './LyricsSimilarityMatrix';
import csv from '../assets/lyrics_data.csv'
import SpectogramChart from './SpectogramChart';
import ArcDiagramChart from './ArcDiagramChart';
import CollectionOfTunesRangeChart from './CollectionOfTunesRangeChart';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import LyricsIcon from '@mui/icons-material/Lyrics';
import MusicPlayer from './MusicPlayer'




const titles = csv.map(d => d.title)
const filenames = csv.map(d => d.identifier)
const lyrics = csv.map(d => d.lyrics)
const collections = ["goodman_vol_1", "goodman_vol_2", "IE_1797_BT_EB", "IE-2019-D-HLS", "IE-2021-KY-AP", "IE-2023-DL-TP"]
const creators = csv.map(d => d.creatorP)
const NAVIGATION = [

  {
    kind: 'header',
    title: 'Sections',
  },
  {
    segment: 'lyrics',
    title: 'Lyrics',
    icon: <LyricsIcon/>,
  },
  {
    segment: 'performance',
    title: 'Performance',
    icon: <GraphicEqIcon/>,
  },
  {
    segment: 'score',
    title: 'Score',
    icon: <MusicNoteIcon/>,
  },
  {
    segment: 'collection',
    title: 'Collection',
    icon: <LibraryMusicIcon/>,
  },
  {
    kind: 'divider',
  },
];

const dividerStyle = {
  borderBottomWidth: '0.25rem',
  borderImage: 'linear-gradient(90deg, #d0b6fa , #94bbe9) 1',
}

const demoTheme = createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
    colorSchemeSelector: 'class',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    typography: {
        h2: {fontFamily: 'playfair display'},
        h3: {fontFamily: 'playfair display'},
        h4: {fontFamily: 'playfair display'},
        h5: {fontFamily: 'montserrat'},
        p: {fontFamily: 'montserrat'},
        body: {fontFamily: 'montserrat'},
        span: {fontFamily: 'montserrat'},
        caption: {fontFamily: 'montserrat'},        
        body1: {fontFamily: 'montserrat'},          
        body2: {fontFamily: 'montserrat'},          
        subtitle1: {fontFamily: 'montserrat'},      
        subtitle2: {fontFamily: 'montserrat'},     
    },
    palette: {
        contrastThreshold: 4.5,
    }
    
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

const LandingPage = () => (
    <Grid container spacing={1}>
        <Grid size={5} />
        <Grid size={12}>
            <Typography variant='h2'>{"Title"}</Typography>
        </Grid>
        <Grid size={12}>
           <Typography variant='h3'>{"Subtitle"}</Typography>
        </Grid>
        <Grid size={4}>
            <Skeleton height={100} />
        </Grid>
        <Grid size={8}>
            <Skeleton height={100} />
        </Grid>

        <Grid size={12}>
            <Skeleton height={150} />
        </Grid>
        <Grid size={12}>
            <Skeleton height={14} />
        </Grid>

        <Grid size={3}>
            <Skeleton height={100} />
        </Grid>
        <Grid size={3}>
            <Skeleton height={100} />
        </Grid>
        <Grid size={3}>
            <Skeleton height={100} />
        </Grid>
        <Grid size={3}>
            <Skeleton height={100} />
        </Grid>
        </Grid>
)

import SelectAutoWidth from './SelectAutoWidth';
import DropdownMenu from './DropdownMenu';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import InfoIcon from '@mui/icons-material/Info';
import ShowLyrics from './ShowLyrics';
const LyricsContent = ({filename, tune, creator, options, handleChange, open, handleClose, setOpen}) => (
    <Grid container spacing={1}>
        <Grid size={7}>
           <Typography variant='h3'>The hidden patterns in song lyrics</Typography>
        </Grid>
        <Grid size={5}></Grid>

        <Grid size={5}>
            <Typography variant='p'>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</Typography>
        </Grid>
        <Grid size={7}></Grid>

        <Grid size={12} style={{paddingBottom: '1rem', paddingTop: '1rem'}}>
            <Divider sx={dividerStyle}></Divider>
        </Grid>

        <Grid size={12}>
            <Typography variant='body2'>Select a tune</Typography>
        </Grid>
        <Grid size={4} style={{display: 'flex',  alignItems: 'center', justifyContent:'flex-start'}}>
            <DropdownMenu options={options} handleTuneChange={handleChange} selectedValue={tune}></DropdownMenu>
        </Grid>

         <Grid size={4} style={{display: 'flex',  alignItems: 'center', justifyContent:'center'}}>
            <MusicPlayer filename={filename} tune={tune} creator={creator}></MusicPlayer>
        </Grid>

        <Grid size={4} style={{display: 'flex', alignItems: 'center', justifyContent:'flex-end'}}>
            <Tooltip title={<Typography variant='body2'>Lyrics</Typography>}>
                <IconButton onClick={() => setOpen(true)}>
                    <TextSnippetIcon sx={{color:'#565656'}}/>
                </IconButton>
            </Tooltip>

            <Tooltip title={<Typography variant='body2'>How to Read</Typography>}>
                <IconButton>
                    <InfoIcon sx={{color:'#565656'}}/>
                </IconButton>
            </Tooltip>

        </Grid>

        <Grid size={12} id='grid-12' >
            <LyricsSimilarityMatrix tuneIndex={filenames.indexOf(filename)}/>
        </Grid>

        <Grid>
            {open && <ShowLyrics handleClose={handleClose} open={open} lyrics={lyrics[filenames.indexOf(filename)]} tune={tune}/>}
        </Grid>
    </Grid>
)

const PerformanceContent = ({filename, options, tune, handleChange}) => (
    <Grid container spacing={1}>
        <Grid size={7}>
           <Typography variant='h3'>How performance differs from the score</Typography>
        </Grid>

        <Grid size={5}/>

        <Grid size={5}>
            <Typography variant='p'>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</Typography>
        </Grid>

        <Grid size={12} style={{paddingBottom: '1rem', paddingTop: '1rem'}}>
            <Divider id='grid-12' sx={dividerStyle}></Divider>
        </Grid>

        <Grid size={12}>
            <Typography variant='body2'>Select a tune</Typography>
        </Grid>
        <Grid size={4}>
            <DropdownMenu options={options} handleTuneChange={handleChange} selectedValue={tune}></DropdownMenu>
        </Grid>

         <Grid size={4} style={{display: 'flex'}}>
            <MusicPlayer filename={filename}></MusicPlayer>
        </Grid>

        <Grid size={4} style={{display: 'flex', alignItems: 'center', justifyContent:'flex-end'}}>
            <Tooltip title={<Typography variant='body2'>Lyrics</Typography>}>
                <IconButton>
                    <TextSnippetIcon sx={{color:'#565656'}}/>
                </IconButton>
            </Tooltip>

            <Tooltip title={<Typography variant='body2'>How to Read</Typography>}>
                <IconButton>
                    <InfoIcon sx={{color:'#565656'}}/>
                </IconButton>
            </Tooltip>

        </Grid>

        <Grid size={12}>
            <SpectogramChart key={filename} tune={filename}/>
        </Grid>
    </Grid>
)

const ScoreContent = ({filename, options, tune, handleChange}) => (
    <Grid container spacing={1}>
        <Grid size={7} >
           <Typography variant='h3'>Note range of a song</Typography>
        </Grid>

        <Grid size={5}/>

        <Grid size={5}>
            <Typography variant='p'>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</Typography>
        </Grid>
        
        <Grid size={12} style={{paddingBottom: '1rem', paddingTop: '1rem'}}>
            <Divider id='grid-12' sx={dividerStyle}></Divider>
        </Grid>

        <Grid size={12}>
            <Typography variant='body2'>Select a tune</Typography>
        </Grid>
        <Grid xs={4} md={3}>
            <DropdownMenu options={options} handleTuneChange={handleChange} selectedValue={tune}></DropdownMenu>
        </Grid>

         <Grid xs={4} md={3} style={{display: 'flex'}}>
            <MusicPlayer filename={filename}></MusicPlayer>
        </Grid>
        
        <Grid size={12}>
            <ArcDiagramChart tune={filename}/>
        </Grid>
    </Grid>
)

const CollectionContent = ({collection, tuneName, setTuneName}) => (
    
    
    <Grid container spacing={1}>
        <Grid size={7}>
           <Typography variant='h3'>A look into the whole collection</Typography>
        </Grid>

        <Grid size={5}/>

        <Grid size={5}>
            <Typography variant='p'>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</Typography>
        </Grid>
        <Grid size={12}>
            <Divider style={{paddingBottom: '1rem'}} sx={dividerStyle}></Divider>
        </Grid>
        
        <Grid size={4}>
            <Typography variant='h5'>{collection}</Typography>
            <Typography variant='p'>{tuneName}</Typography>
        </Grid>

        <Grid size={8} id='grid-12'></Grid>

        <Grid size={12} sx={{display: 'flex', justifyContent: 'center'}}>
            <CollectionOfTunesRangeChart collection={collection} setTuneName={setTuneName}/>
        </Grid>
    </Grid>
)





export default function DashboardLayoutBasic(props) {

    
    const router = useDemoRouter('/dashboard');
    const { window } = props;
    
    const demoWindow = window ? window() : undefined;
    const [tuneName, setTuneName] = React.useState("Hover chart");
    const [tune, setTune] = React.useState(titles[0])
    const [collection, setCollection] = React.useState(collections[0])
    const [filename, setFilename] = React.useState(filenames[0])
    const [creator, setCreator] = React.useState(creators[0])
    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    
    const renderContent = () => {
        console.log(router)
        switch (router.pathname) {
            case '/lyrics':
                return <LyricsContent filename={filename} tune={tune} creator={creator} options={titles} handleChange={handleTuneChange} open={open} handleClose={handleClose} setOpen={setOpen}/>
            case '/performance':
                return <PerformanceContent filename={filename} options={titles} handleChange={handleTuneChange} tune={tune}/>
            case '/score':
                return <ScoreContent filename={filename} options={titles} handleChange={handleTuneChange} tune={tune}/>
            case '/collection':
                return <CollectionContent collection={collection} tuneName={tuneName} setTuneName={setTuneName}/>
            default:
                return <LandingPage/>
        }
    }

const handleTuneChange = (value) => {
    console.log('handleTuneChange called with:', value);
    setTune(value)
    const index = titles.indexOf(value);
    console.log('Index found:', index);
    if (index !== -1) {
        setFilename(filenames[index]);
        setCreator(creators[index]);
    }
};

    const handleCollectionChange = (event, newValue) => {
        setCollection(newValue);
    };
    
    

  return (
    <AppProvider
        account={null}
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
    >
        <DashboardLayout>
            <PageContainer title=''>
                {renderContent(router)}
            </PageContainer>
        </DashboardLayout>
    </AppProvider>
  );
}