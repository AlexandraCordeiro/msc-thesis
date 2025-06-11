import {useLayoutEffect, useState} from 'react'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import {Container, Grid, IconButton, Slider} from '@mui/material'
import {useWindowSize} from "./UseWindowSize.jsx"
import {fontSize, setOfTokensFromString} from '../functions.js'

const useAudio = (filename) => {
  const [song, setSong] = useState(() => new Audio(filename))
  const [play, setPlay] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // handles play button changes
  function toggle() {
    setPlay(!play)
  }

  const seek = (value) => {
    if (song) {
      song.currentTime = value;
      setCurrentTime(value);
    }
  };

  useLayoutEffect(() => {
    song.pause()
    song.removeEventListener('timeupdate', () => setCurrentTime(0)) 
    song.removeEventListener('ended', () => setPlay(false))
    
    // Reset states
    setPlay(false)
    setCurrentTime(0)
    
    // new audio
    const newAudio = new Audio(filename)
    setSong(newAudio)
    
  }, [filename])

  useLayoutEffect(() => {
      play ? song.play() : song.pause()
    },
    [play]
  )

  useLayoutEffect(() =>  {
    song.addEventListener('timeupdate', () => {
      setCurrentTime(song.currentTime)
    })

    return () => {
      song.removeEventListener('timeupdate', () => setCurrentTime(0))
    }
  }, [song])

  useLayoutEffect(() => {
    song.addEventListener('ended', () => setPlay(false))

    // react clean up function
    // runs when a component is rerun
    return () => {
      song.removeEventListener('ended', () => setPlay(false))
    }
  }, [song])

  return [play, toggle, currentTime, song.duration, seek]
}

function formatDuration(value) {
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export default function MusicPlayer({filename}) {
  // playMusic returns a boolean (true/false) = (playing/not playing)
  const [playMusic, setMusic, currentTime, duration, seek] = useAudio(`/audio_files/${filename}.mp3`)
  console.log(`duration: ${duration}\ncurrent: ${currentTime}`)
  const [width, height] = useWindowSize()

  return (

        <>
          {/* Align Play/Pause button with slider */}
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

              <IconButton variant="contained" sx={{padding: 0, minWidth: 0}} onClick={setMusic}>
                {
                  // if music is play display pause, else diplay arrow
                  playMusic ? 
                  (<PauseCircleFilledRoundedIcon sx={{ color: '#565656', minWidth: 0, fontSize: {xs: '1.5rem', sm: '1.8rem', md: '2.1rem', lg: '2.3rem', xl: '2.5rem'}}}/>)
                  :
                  (<PlayArrowRoundedIcon sx={{ color: '#565656', minWidth: 0, fontSize: {xs: '1.5rem', sm: '1.8rem', md: '2.1rem', lg: '2.3rem', xl: '2.5rem'}}}/>)
                  
                }
              </IconButton>
              <Slider
                key={filename}
                size="small"
                value={currentTime || 0}
                min={0}
                max={duration || `${width * 0.2}px`}
                step={1}
                defaultValue={0}
                aria-label="song-duration"
                valueLabelFormat={formatDuration(currentTime || 0)}
                onChange={(_, value) => seek(value)}
                sx={{width: `${width * 0.2}px`, color: '#565656', marginLeft: '1rem'}}
              />
          </div>
        </>
  )
}