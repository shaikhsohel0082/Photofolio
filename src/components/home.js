import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../FirebaseInit"; // Importing Firebase db instance
import { collection, addDoc, onSnapshot, getDocs } from "firebase/firestore"; // Importing Firestore functions

export default function Home() {
  const [albumName, setAlbumName] = useState(""); // State for album name input
  const [albums, setAlbums] = useState([]); // State to store list of albums from Firestore
  const [isAlbumClicked, setIsAlbumClicked] = useState(false); // State to manage album creation form display

  useEffect(() => {
    // Fetch albums from Firestore when component mounts
    const fetchAlbums = async () => {
      const albumsCollection = collection(db, "Albums"); // Reference to Firestore collection "Albums"
      const snapshot = await getDocs(albumsCollection); // Get all documents from "Albums" collection
      const albumsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albumsData); // Set albums state with retrieved data

      // Set up a listener to update albums in real-time
      const unsubscribeListener = onSnapshot(albumsCollection, (snapshot) => {
        const updatedAlbums = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlbums(updatedAlbums); // Update albums state when collection changes
      });

      // Clean up listener when component unmounts or rerenders
      return () => unsubscribeListener();
    };

    fetchAlbums(); // Call the fetchAlbums function
  }, []); // Empty dependency array ensures this effect runs only once (on mount)

  const addAlbum = async (albumName) => {
    try {
      const docRef = await addDoc(collection(db, "Albums"), {
        // Add a new document to "Albums" collection
        name: albumName,
        images: [],
      });
      // Update state with the newly added album
      setAlbums([...albums, { id: docRef.id, name: albumName }]);
    } catch (error) {
      console.error("Error adding album: ", error);
    }
  };

  const handleAddAlbum = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (albumName.trim() !== "") {
      addAlbum(albumName); // Call addAlbum function with albumName as argument
      setAlbumName(""); // Clear the input field after adding album
    }
  };

  return (
    <div className="home">
      {isAlbumClicked ? (
        // Display form to add new album if isAlbumClicked is true
        <form className="form" onSubmit={handleAddAlbum}>
          <h1>Create Album</h1>
          <input
            type="text"
            placeholder="Enter Album Name"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            required
          />
          <button className="btn-add" type="submit">
            Add
          </button>
          <button
            className="btn-cancel"
            onClick={() => setIsAlbumClicked(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        // Display list of existing albums and add album button if isAlbumClicked is false
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Your Albums</h1>
          <button className="btn" onClick={() => setIsAlbumClicked(true)}>
            Add Album
          </button>
        </div>
      )}

      {/* Display albums retrieved from Firestore */}
      <div className="albums">
        {albums.map((album) => (
          <Link to={`/album/${album.id}`} key={album.id} className="album-link">
            <div className="album-container">
              <div className="album"></div>
              <hr />
              <h2 style={{ margin: 0 }}>{album.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
