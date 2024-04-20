import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../FirebaseInit"; // Importing Firebase db instance

const AddImages = () => {
  const { albumId } = useParams(); // Accessing albumId from route parameters
  const history = useHistory(); // Accessing navigation history
  const [image, setImage] = useState({ name: "", url: "" }); // State for image details
  const [formSubmit, setFormSubmit] = useState(false); // State to track form submission
  const [images, setImages] = useState([]); // State to store images associated with the album
  const [isAddImageClicked, setIsAddImageClicked] = useState(false); // State to manage image upload form display
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image for modal display

  useEffect(() => {
    // Fetch images associated with the album from Firestore
    const fetchImages = async () => {
      try {
        const albumRef = doc(db, "Albums", albumId); // Reference to the specific album document
        const albumSnapshot = await getDoc(albumRef); // Retrieve the album document
        if (albumSnapshot.exists()) {
          const albumData = albumSnapshot.data(); // Extract data from the album document
          setImages(albumData.images || []); // Update images state with the retrieved images array
        } else {
          console.error("Album not found");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages(); // Call the fetchImages function when the component mounts

    // Set up a listener to listen for real-time updates to the album's images
    const unsubscribe = onSnapshot(doc(db, "Albums", albumId), (snapshot) => {
      if (snapshot.exists()) {
        const albumData = snapshot.data();
        setImages(albumData.images || []); // Update images state with updated images array
      } else {
        console.error("Album not found");
      }
    });

    return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, [albumId]); // Re-run the effect when albumId changes

  const handleImageUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setFormSubmit(true); // Set formSubmit state to true

    try {
      const albumRef = doc(db, "Albums", albumId); // Reference to the specific album document
      const albumSnapshot = await getDoc(albumRef); // Retrieve the album document
      if (albumSnapshot.exists()) {
        const albumData = albumSnapshot.data(); // Extract data from the album document
        const updatedImages = [
          ...albumData.images,
          {
            id: `${new Date()}+${image.name}`,
            name: image.name,
            url: image.url,
          },
        ]; // Create updated images array with the new image
        await updateDoc(albumRef, { images: updatedImages }); // Update the album document with the new images array
        setImage({ name: "", url: "" }); // Clear image state after successful upload
      } else {
        console.error("Album not found");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const albumRef = doc(db, "Albums", albumId); // Reference to the specific album document
      const albumSnapshot = await getDoc(albumRef); // Retrieve the album document
      if (albumSnapshot.exists()) {
        const albumData = albumSnapshot.data(); // Extract data from the album document
        const updatedImages = albumData.images.filter((img) => img.id !== id); // Filter out the image with the specified id
        await updateDoc(albumRef, { images: updatedImages }); // Update the album document with the updated images array
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDownloadImage = (imageUrl, imageName) => {
    // Function to handle image download
    console.log("Attempting to download:", imageUrl, imageName);
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    // Navigate back to the home page
    history.push("/");
  };

  const handleImageClick = (imageUrl) => {
    // Set selectedImage state to display the modal with the clicked image
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    // Close the modal by resetting selectedImage state
    setSelectedImage(null);
  };

  return (
    <>
      {/* Display image upload form or add image button */}
      <div className={selectedImage ? "imageBody" : ""}>
        <button className="btn-cancel btn-back" onClick={handleBack}>
          Back
        </button>

        {isAddImageClicked ? (
          // Display image upload form if isAddImageClicked is true
          <form className="img-form" onSubmit={handleImageUpload}>
            <h1>Add Images</h1>
            <label>Image Name:</label>
            <input
              type="text"
              placeholder="Enter Image Name"
              value={image.name}
              required
              onChange={(e) => setImage({ ...image, name: e.target.value })}
            />
            <label>Image URL:</label>
            <input
              type="text"
              placeholder="Enter Image URL"
              value={image.url}
              required
              onChange={(e) => setImage({ ...image, url: e.target.value })}
            />
            <button className="btn-add " type="submit">
              Add Image
            </button>
            <button
              className="btn-cancel"
              onClick={() => setIsAddImageClicked(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          // Display add image button if isAddImageClicked is false
          <button
            className="btn-add btn-addimage"
            onClick={() => setIsAddImageClicked(true)}
          >
            Add Image
          </button>
        )}

        {/* Display image list */}
        <h1 className="image-heading">
          {images.length === 0
            ? "No Images Added Yet"
            : `Total Images: ${images.length}`}
        </h1>

        <div className="image-list">
          {images.map((img, index) => (
            // Display each image in the list
            <div key={index} className="image-container">
              <h2 className="image-name">
                {img.name.length > 10
                  ? img.name.slice(0, 10) + "..."
                  : img.name}
              </h2>
              <button
                className="btnsymbol"
                onClick={() => handleDeleteImage(img.id)}
              >
                {/* Button to delete the image */}
                <img
                  className="symbol-img"
                  src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png"
                  alt="delete-symbol"
                />
              </button>
              <button
                className="btnsymbol"
                onClick={() => handleDownloadImage(img.url, img.name)}
              >
                {/* Button to download the image */}
                <img
                  className="symbol-img"
                  src="https://cdn-icons-png.flaticon.com/128/9153/9153957.png"
                  alt="download-symbol"
                />
              </button>
              <hr />
              {/* Display the image */}
              <img
                className="image"
                src={img.url}
                alt={img.name}
                onClick={() => handleImageClick(img.url)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal to display enlarged image */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
          style={{
            backgroundImage: `url(${selectedImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="modal">
            <span className="modal-btn" onClick={handleCloseModal}>
              X
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AddImages;
