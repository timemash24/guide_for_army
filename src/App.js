import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const ARTIST_ID = '3Nrfpe0tUJi4K4DXYWgMUX';
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [albums, setAlbums] = useState([]);

  // const getToken = () => {
  //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
  //     let token = urlParams.get('access_token');
  // }

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const searchAlbums = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAlbums(data.items);
  };

  const renderAlbums = () => {
    console.log(albums);
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
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {token ? (
          <form onSubmit={searchAlbums}>
            <button type={'submit'}>Show Albums</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}

        {renderAlbums()}
      </header>
    </div>
  );
}

export default App;
