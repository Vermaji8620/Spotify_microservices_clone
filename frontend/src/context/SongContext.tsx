import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const server = 'http://localhost:8000'

export interface Song {
    id: string,
    title: string,
    description: string,
    thumbnail: string,
    audio: string,
    album: string,
}

export interface Album {
    id: string,
    title: string,
    description: string,
    thumbnail: string,
}

interface SongContextType {
    songs: Song[],
    isPlaying: boolean,
    setIsPlaying: (value: boolean) => void,
    loading: boolean,
    setLoading: (value: boolean) => void,
    selectedSong: string | null,
    setSelectedSong: (id: string) => void,
    albums: Album[],
    fetchSingleSong: () => Promise<void>, // yaha pe promise use kiya as a data type kyunki async await wala function hai na,. baki me promise ka use nai kiya hai, kyunki, wo normal function k jaise behave krta hai 
    song: Song | null,
}

// createContext prop drilling k bajaye use kiya jata hai.. jaise agar prop drilling krenge, to pura ka pura parent->children1->children2->children3 pe jana hoga.... to instead, hm context ka use krenge, taki pura ka pura <App/> koi v chiz ko use kr paye....

// yaha pe ( take for example ), empty box bana rahe hai 
const SongContext = createContext<SongContextType | undefined>(undefined)

interface SongProviderProps {
    children: ReactNode
}

export const SongProvider = ({ children }: SongProviderProps) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [songs, setSongs] = useState<Song[]>([])
    const [selectedSong, setSelectedSong] = useState<string | null>(null)
    const [albums, setAlbums] = useState<Album[]>([])
    const [song, setSong] = useState<Song | null>(null)


    // usecallback function is used for caching and memoization, so if there are no changes in its dependencies, then it renders the cached or memoized results.
    const fetchSongs = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await axios.get<Song[]>(`${server}/api/v1/song/all`)
            setSongs(data)
            if (data.length > 0) setSelectedSong(data[0].id.toString());
            setIsPlaying(false)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }, []);

    const fetchSingleSong = useCallback(async () => {
        if (!selectedSong) {
            return;
        }
        try {
            const { data } = await axios.get(`${server}/api/v1/song/${selectedSong}`)
            setSong(data)
        } catch (error) {
            console.log(error)
        }
    }, [selectedSong])

    const fetchAlbums = useCallback(async () => {
        try {
            const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`)
            setAlbums(data)
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        fetchSongs()
        fetchAlbums()
    }, [])

    // yaha pe box ko fill up krrhe hai, jo v chiz chahiye hoga, pure k pure app me...
    return (<SongContext.Provider value={{ songs, selectedSong, setSelectedSong, isPlaying, setIsPlaying, loading, setLoading, albums, fetchSingleSong, song }}>{children}</SongContext.Provider>)
}

export const useSongData = (): SongContextType => {
    // yaha pe useContext wala hook bana le rahe hai taki useSongData() ka use krke direct app k andar k chizo ko import kr sake, naki baar baar useContext(songContext) ka use krna pade.
    const context = useContext(SongContext)
    if (!context) {
        throw new Error("useSongData must be used within a SongProvider")
    }
    return context;
}