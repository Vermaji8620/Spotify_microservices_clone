import AlbumCard from '../components/AlbumCard'
import Layout from '../components/Layout'
import SongCard from '../components/SongCard'
import { useSongData } from '../context/SongContext'

const Home = () => {
  const { albums, songs } = useSongData()
  return (
    <div>
      <Layout>
        <div className="mb-4 ">
          <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
          <div className="flex overflow-auto">
            {
              albums?.map((element, index) => {
                return <AlbumCard key={index} image={element.thumbnail} name={element.title} desc={element.description} id={element.id} />
              })
            }
          </div>
        </div>
        <div className="mb-4 ">
          <h1 className='my-5 font-bold text-2xl'>Today's hits</h1>
          <div className="flex overflow-auto">
            {
              songs?.map((element, index) => {
                return <SongCard key={index} image={element.thumbnail} name={element.title} desc={element.description} id={element.id} />
              })
            }
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Home