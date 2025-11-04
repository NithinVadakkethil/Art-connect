import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User, Artwork } from '../../types';

const ArtistProfiles: React.FC = () => {
  const [artists, setArtists] = useState<User[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'no-artworks'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsQuery = query(collection(db, 'users'), where('role', '==', 'artist'));
        const artistsSnapshot = await getDocs(artistsQuery);
        const artistsList = artistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setArtists(artistsList);

        const artworksQuery = query(collection(db, 'artworks'));
        const artworksSnapshot = await getDocs(artworksQuery);
        const artworksList = artworksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
        setArtworks(artworksList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArtists = artists.filter(artist => {
    if (filter === 'no-artworks') {
      return !artworks.some(artwork => artwork.artistId === artist.uid);
    }
    return true;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Artist Profiles</h1>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value as 'all' | 'no-artworks')}
          className="border p-2 rounded"
        >
          <option value="all">All Artists</option>
          <option value="no-artworks">Artists with no artworks</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArtists.map(artist => (
          <div key={artist.uid} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{artist.displayName}</h2>
            <p>{artist.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistProfiles;
