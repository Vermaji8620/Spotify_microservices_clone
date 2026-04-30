import { sql } from './config/db.js';
import { redisClient } from './index.js';
import trycatch from './trycatch.js';


export const getAllAlbums = trycatch(
    async (req, res) => {
        let albums;
        const cache_expiry = 1800

        if (redisClient.isReady) {
            albums = await redisClient.get('albums')
        }
        if (albums) {
            console.log("cache hit")
            res.status(200).json(JSON.parse(albums))
            return;
        }
        else {
            console.log("cache miss")
            albums = await sql`
                SELECT * FROM albums
            `
            if (redisClient.isReady) {
                await redisClient.set('albums', JSON.stringify(albums), {
                    EX: cache_expiry
                })
            }
            res.status(200).json(albums)
        }
    }
)

export const getAllSongs = trycatch(
    async (req, res) => {
        const cache_expiry = 1800;
        let songs;
        if (redisClient.isReady) {
            songs = await redisClient.get('songs')
        }
        if (songs) {
            console.log("cache hit")
            res.status(200).json(JSON.parse(songs))
            return;
        }
        else {
            console.log("cache miss")
            songs = await sql`
                SELECT * FROM songs
            `
            if (redisClient.isReady) {
                await redisClient.set('songs', JSON.stringify(songs), {
                    EX: cache_expiry
                })
            }
            res.status(200).json(songs)
        }
    }
)

export const getAllSongsOfAlbum = trycatch(
    async (req, res) => {
        const cache_expiry = 1800;
        const album_id = req.params.id;
        let album_id_exists;
        if (redisClient.isReady) {
            album_id_exists = await redisClient.get(`album:${album_id}`);
        }
        if (album_id_exists) {
            console.log("Cache hit")
            res.status(200).json(JSON.parse(album_id_exists))
            return;
        }
        console.log("Cache miss")
        album_id_exists = await sql`
            SELECT * FROM albums WHERE id = ${album_id}
        `
        if (!album_id_exists || album_id_exists.length == 0) {
            res.status(404).json({ message: "No such album found" })
            return;
        }

        let allSongs;
        allSongs = await sql`
                SELECT * FROM songs WHERE album_id = ${album_id}
            `
        if (redisClient.isReady) {
            await redisClient.set(`album:${album_id}`, JSON.stringify({
                songs: allSongs, album: album_id_exists[0]
            }), { EX: cache_expiry })
        }
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