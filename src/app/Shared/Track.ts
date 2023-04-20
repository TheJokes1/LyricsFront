export interface Track {
    artist: string;
    title: string;
}

export interface TrackData {
    artist: string[];
    title: string;
    artistId: string;
    spotifyLink: string;
    previewLink: string;
    popularity: number;
    releaseDate: string;
    imageUrl: string;
    album: string;
}