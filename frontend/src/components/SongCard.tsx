import { FaBookmark, FaPlay } from 'react-icons/fa'
import { useUserData } from '../context/UserContext'
import { useSongData } from '../context/SongContext';

interface SongCardProps {
    id: string,
    image: string,
    name: string,
    desc: string
}

const SongCard = ({ image, name, desc, id }: SongCardProps) => {
    const { addToPlaylist, isAuth } = useUserData();
    const { setSelectedSong, setIsPlaying } = useSongData();

    const savetoPlaylistHandler = () => {
        addToPlaylist(id);
    }
    return (
        <div>
            <div className="min-w-[45] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
                <div className="relative group">
                    <img src={image ? image : `./download.png`} className='mr-1 w-40 rounded' alt={name} />
                    <div className="flex gap-2">
                        <button onClick={() => { setSelectedSong(id); setIsPlaying(true); }} className='absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <FaPlay />
                        </button>
                        {isAuth && <button onClick={savetoPlaylistHandler} className='absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <FaBookmark />
                        </button>}
                    </div>
                </div>
            </div>
            <p className="font-bold mt-2 mb-1">{name}</p>
            <p className='text-slate-200 text-sm'>{desc.slice(0, 20)} ...</p>
        </div>
    )
}

export default SongCard