import { useEffect, useRef, useState } from 'react';
import { useSongData } from '../context/SongContext'
import { GrChapterNext, GrChapterPrevious } from 'react-icons/gr';
import { FaPause, FaPlay } from 'react-icons/fa';

const Player = () => {
  const { data, song, fetchSingleSong, selectedSong, isPlaying, setIsPlaying, nextSong, previousSong } = useSongData();
  useEffect(() => {
    fetchSingleSong()
  }, [selectedSong, fetchSingleSong])

  // useRef in React is basically a way to hold onto a value across renders without causing re-renders.
  // difference b/w useState and useRef - 

  // Feature	        useState	useRef
  // Triggers render	✅ Yes	  ❌ No
  // Stores value	    ✅ Yes	  ✅ Yes
  // DOM access	      ❌ No	  ✅ Yes

  // React doesn't automatically play audio, JS can. Hence, we escape React to talk to the real DOM ( hence, useRef exists ) 

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(1);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) { return; }

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    }

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, [isPlaying, song])

  const handlePlayorPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      }
      else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  }

  return (
    <div>
      {
        song && <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
          <div className="lg:flex items-center gap-4">
            <img src={song.thumbnail ? song.thumbnail : './download.png'} alt="" className='w-12' />
            <div className="hidden md:block">
              <p>{song.title}</p>
              <p>{song.description.slice(0, 30)} ...</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 m-auto ">
            {song.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={isPlaying} />
            )}
            <div className="w-full items-center flex font-thin text-green-400">
              <input type="range" min={"0"} max={"100"} className='progress-bar w-30px md:[300px]' value={(progress / duration) * 100 || 0} onChange={durationChange} />
            </div>
            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer" onClick={previousSong}>
                <GrChapterPrevious />
              </span>
              <button className="bg-white text-black rounded-full p-2" onClick={handlePlayorPause}>
                {
                  isPlaying ? <FaPause /> : <FaPlay />
                }
              </button>
              <span className="cursor-pointer" onClick={nextSong}>
                <GrChapterNext />
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <input type="range" name="" id="" className='w-16 md:w-32' min={"1"} max={"100"} step={"0.01"} value={volume * 100} onChange={volumeChange} />
          </div>
        </div>
      }
    </div>
  )
}

export default Player
