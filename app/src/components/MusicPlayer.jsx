import {useLayoutEffect, useState} from 'react'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import {Container, Grid, IconButton, Slider} from '@mui/material'
import {useWindowSize} from "./UseWindowSize.jsx"
import {fontSize, setOfTokensFromString} from '../functions.js'
import { useRef } from 'react'

const useAudio = (filename, router) => {
  const audioRef = useRef(null)
  const [play, setPlay] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const toggle = () => {
    setPlay((prev) => !prev)
  }

  const seek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleEnded = () => {
    setPlay(false)
  }


  useLayoutEffect(() => {
    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.removeEventListener('ended', handleEnded)
    }

    const newAudio = new Audio(filename)
    newAudio.addEventListener('timeupdate', handleTimeUpdate)
    newAudio.addEventListener('ended', handleEnded)
    audioRef.current = newAudio

    setPlay(false)
    setCurrentTime(0)

    return () => {
      newAudio.pause()
      newAudio.removeEventListener('timeupdate', handleTimeUpdate)
      newAudio.removeEventListener('ended', handleEnded)
    }
  }, [filename, router])

  useLayoutEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (play) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [play])

  return [play, toggle, currentTime, audioRef.current?.duration || 0, seek]
}

function formatDuration(value) {
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export default function MusicPlayer({filename, router}) {
  // playMusic returns a boolean (true/false) = (playing/not playing)
  const [playMusic, setMusic, currentTime, duration, seek] = useAudio(`/audio_files/${filename}.mp3`, router)
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