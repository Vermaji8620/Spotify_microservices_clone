import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { useUserData } from '../context/UserContext';
import { useSongData } from '../context/SongContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

const Admin = () => {
    const server = `http://localhost:7000`;
    const { user } = useUserData();
    const navigate = useNavigate();
    const { albums, songs, fetchAlbums, fetchSongs } = useSongData();
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate])
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [album, setAlbum] = useState<string>('');

    const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = (e.target.files && e.target.files[0]) || null;
        console.log(selectedFile);
        setFile(selectedFile);
    }

    const addAlbumHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file == null) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append('file', file);
        console.log(formData);
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/album/new`, formData, {
                headers: {
                    token: localStorage.getItem('token')
                }
            });

            toast.success(data.message);
            fetchAlbums();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
            setBtnLoading(false);
            setTitle("");
            setDescription("");
            setFile(null);
        }
    }

    const addSongHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file == null) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append('file', file);
        formData.append('album_id', album);
        console.log(formData);
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
                headers: {
                    token: localStorage.getItem('token')
                }
            });

            toast.success(data.message);
            fetchSongs();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
            setBtnLoading(false);
            setTitle("");
            setDescription("");
            setAlbum("");
            setFile(null);
        }
    }

    const addThumbnailHandler = async (id: string) => {
        if (file == null) return;

        const formData = new FormData();
        formData.append('file', file);
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/song/${id}`, formData, {
                headers: {
                    token: localStorage.getItem('token')
                }
            });

            toast.success(data.message);
            fetchSongs();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
            setBtnLoading(false);
            setFile(null);
        }
    }

    const deleteAlbum = async (id: string) => {
        if (confirm("Are you sure you want to delete this album ? ")) {
            setBtnLoading(true);
            try {
                await axios.delete(`${server}/api/v1/album/${id}`, {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                });
                toast.success("Album deleted successfully");
                fetchSongs();
                fetchAlbums();
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "An error occurred");
            }
            finally {
                setBtnLoading(false);
            }
        }
    }

    const deleteSong = async (id: string) => {
        if (confirm("Are you sure you want to delete this Song ? ")) {
            setBtnLoading(true);
            try {
                await axios.delete(`${server}/api/v1/song/${id}`, {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                });
                toast.success("Song deleted successfully");
                fetchSongs();
                fetchAlbums();
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "An error occurred");
            }
            finally {
                setBtnLoading(false);
            }
        }
    }

    return (
        <div className='min-h-screen bg-[#212121] text-white p-8'>
            <Link to={"/"} className='bg-green-500 text-white font-bold py-2 px-4 rounded-full'>Go to Home Page</Link>
            <h2 className='text-2xl font-bold mb-6 mt-6'>Add Album</h2>
            <form onSubmit={addAlbumHandler} className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4">
                <input type="text" name="" id="" placeholder='Title' className='auth-input' value={title} onChange={(e) => { setTitle(e.target.value) }} required />
                <input type="text" name="" id="" placeholder='Description' className='auth-input' value={description} onChange={(e) => { setDescription(e.target.value) }} required />
                <input type="file" name="" id="" placeholder='Choose thumbnail' accept='image/*' onChange={fileChangeHandler} required className='auth-input' />
                <button className='auth-btn w-[25]' disabled={btnLoading}>{btnLoading ? "Please Wait" : "Add"} </button>
            </form>
            <h2 className='text-2xl font-bold mb-6 mt-6'>Add Song</h2>
            <form onSubmit={addSongHandler} className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4">
                <input type="text" name="" id="" placeholder='Title' className='auth-input' value={title} onChange={(e) => { setTitle(e.target.value) }} required />
                <input type="text" name="" id="" placeholder='Description' className='auth-input' value={description} onChange={(e) => { setDescription(e.target.value) }} required />
                <select name="" id="" className='auth-input' value={album} onChange={(e) => setAlbum(e.target.value)} required>
                    <option value="">Choose Album</option>
                    {
                        albums?.map((element: any, index: number) => {
                            return <>
                                <option value={element.id} key={index}>{element.title}</option>
                            </>
                        })
                    }
                </select>
                <input type="file" name="" id="" placeholder='Choose Audio' accept='audio/*' onChange={fileChangeHandler} required className='auth-input' />
                <button className='auth-btn w-[25]' disabled={btnLoading}>{btnLoading ? "Please Wait" : "Add"} </button>
            </form>

            <div className="mt-8">
                <h3 className='text-xl font-semibold mb-4'>Added Albums</h3>
                <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
                    {
                        albums?.map((ele: any, inde: number) => {
                            return <div className='bg-[#181818] p-4 rounded-lg shadow-md' key={inde}>
                                <img src={ele.thumbnail} alt="" className='mr-1 w-52 h-52' />
                                <h4 className="text-lg font-bold">{ele.title.slice(0, 20)}...</h4>
                                <h4 className="text-lg font-bold">{ele.description.slice(0, 20)}...</h4>
                                <button className='px-3 py-1 bg-red-500 text-white rounded' disabled={btnLoading} onClick={(() => { deleteAlbum(ele.id) })}><MdDelete /></button>
                            </div>
                        })
                    }
                </div>
            </div>

            <div className="mt-8">
                <h3 className='text-xl font-semibold mb-4'>Added Songs</h3>
                <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
                    {
                        songs?.map((ele: any, inde: number) => {
                            return <div className='bg-[#181818] p-4 rounded-lg shadow-md' key={inde}>
                                {
                                    ele.thumbnail ? <img src={ele.thumbnail} alt="" className='mr-1 w-52 h-52' /> : <div className='flex flex-col justify-center items-center gap-2'>
                                        <input type="file" onChange={fileChangeHandler} />
                                        <button className='auth-btn' style={{ width: '200px' }} disabled={btnLoading} onClick={() => { addThumbnailHandler(ele.id); console.log("sfsfsf") }}>{
                                            btnLoading ? "Please Wait" : "Add thumbnail"
                                        }</button>
                                    </div>
                                }

                                <h4 className="text-lg font-bold">{ele.title.slice(0, 20)}...</h4>
                                <h4 className="text-lg font-bold">{ele.description.slice(0, 20)}...</h4>
                                <button className='px-3 py-1 bg-red-500 text-white rounded' disabled={btnLoading} onClick={(() => { deleteSong(ele.id) })}><MdDelete /></button>
                            </div>
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default Admin
