import { sql } from './config/db.js';
import trycatch from './trycatch.js';


export const getAllAlbums = trycatch(
    async (req, res) => {
        let albums;

        albums = await sql`
            SELECT * FROM albums
        `
        res.status(200).json(albums)
    }
)

export const getAllSongs = trycatch(
    async (req, res) => {
        let songs;

        songs = await sql`
            SELECT * FROM songs
        `
        res.status(200).json(songs)
    }
)

export const getAllSongsOfAlbum = trycatch(
    async (req, res) => {
        const album_id = req.params.id;
        const album_id_exists = await sql`
            SELECT * FROM albums WHERE id = ${album_id}
        `
        if (!album_id_exists || album_id_exists.length == 0) {
            res.status(404).json({ message: "No such album found" })
            return;
        }

        const allSongs = await sql`
            SELECT * FROM songs WHERE album_id = ${album_id}
        `

        res.status(200).json({ songs: allSongs, album: album_id_exists[0] })
    }
)

export const getSingleSong = trycatch(
    async (req, res) => {
        const song = await sql`
            SELECT * FROM songs WHERE id = ${req.params.id}
        `
        return res.json(song[0])
    }
)