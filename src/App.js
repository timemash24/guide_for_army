import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { useEffect, useState } from 'react';

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const ARTIST_ID = '3Nrfpe0tUJi4K4DXYWgMUX';

  // const [searchKey, setSearchKey] = useState('');
  const [albums, setAlbums] = useState([]);

  const auth_token = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const getAuth = async () => {
    try {
      //make post request to SPOTIFY API for access token, sending relavent info
      const token_url = 'https://accounts.spotify.com/api/token';

      // body data to be x-www-form-urlencoded but axios is converting the body to json
      const form = qs.stringify({ grant_type: 'client_credentials' });

      const response = await axios.post(token_url, form, {
        headers: {
          Authorization: `Basic ${auth_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.access_token;
    } catch (error) {
      //on fail, log the error in console
      console.log(error);
    }
  };
  const getAlbums = async () => {
    //request token using getAuth() function
    const access_token = await getAuth();

    const api_url = `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums/`;

    try {
      const response = await axios.get(api_url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          include_groups: 'album',
          market: 'KR',
          limit: 50,
        },
      });

      const data = await response.data.items;
      console.log(response.data);
      // data.map((album) => setAlbums([...albums, album]));
      setAlbums([...albums, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAlbums();
  }, []);

  const renderAlbums = () => {
    // console.log(albums);
    return albums.map((album) => (
      <div key={album.id}>
        {album.images.length ? (
          <img src={album.images[1].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {album.name}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify API - load albums</h1>
        <div>
          {albums.map((album) => (
            <div key={album.id}>
              {album.images.length ? (
                <img src={album.images[1].url} alt="" />
              ) : (
                <div>No Image</div>
              )}
              {album.name}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
