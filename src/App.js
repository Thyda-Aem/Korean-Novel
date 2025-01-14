import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import ItemDetail from './components/ItemDetail'; // Import ItemDetail component
import EpisodeDetail from "./components/Episode";
import Navbar from "./components/NavBar";
import Type from "./components/TypeNovel";
import Search from "./components/Search";
import { Helmet } from "react-helmet";


function Home() {
  const [data, setData] = useState([]); // State to store the data
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [page, setPage] = useState(1); // State to track the current page
  const [hasMore, setHasMore] = useState(true); // State to track if there are more pages

  const scrollContainerRef = useRef(null); // Ref for the scrolling container
  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://prpropertystore.com/api/novels?page=${page}`, {
          method: "GET",
          headers: {
            "X-API-KEY": "5zGe3SLBwicYuLq11NIpl6rmXKYAidzUhD1SV7POFCE",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        if (result.data.length === 0) {
          setHasMore(false); // No more data available
        } else {
          setData((prevData) => {
            const uniqueData = result.data.filter(
              (newItem) => !prevData.some((existingItem) => existingItem.id === newItem.id)
            );
            return [...prevData, ...uniqueData];
          });
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleItemClick = (title) => {
    const encodedTitle = encodeURIComponent(title); // Encode title to make it URL-safe
    navigate(`/novel/item?title=${encodedTitle}`); // Navigate to the item detail page using title
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error: {error.message}</p>
        {/* Optionally provide a retry button */}
      </div>
    );
  }

  return (
    <>
      {/* Helmet for managing the <head> section */}
      <Helmet>
                {/* Basic SEO Settings */}
                <title>Korean Novel</title>
                <meta name="description" content="Discover the latest and most popular Korean novels." />
                <meta name="keywords" content="Korean Novel, Webnovels, React, SEO, Helmet" />

                {/* Open Graph for Facebook & Social Sharing */}
                <meta property="og:title" content="Korean Novel" />
                <meta property="og:description" content="Explore a vast collection of Korean novels and web novels." />
                <meta property="og:image" content="https://prpropertystore.com/images/favicon.jpg" />
                <meta property="og:url" content="https://prpropertystore.com/novel" />
                <meta property="og:type" content="website" />

                {/* Twitter Card Metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Korean Novel" />
                <meta name="twitter:description" content="Enjoy reading the latest Korean novels online." />
                <meta name="twitter:image" content="https://prpropertystore.com/images/favicon.jpg" />

                {/* Favicon */}
                <link rel="icon" href="https://prpropertystore.com/images/favicon.ico" />
            </Helmet>
               
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="overflow-y-auto h-screen"
    >
      <div className="max-w-4xl mx-auto shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.title)} // Attach click handler
            className="flex flex-col items-center justify-center bg-gray-100 p-2 rounded-lg shadow-lg cursor-pointer"
          >
            <img
              src={item.img == null ? "https://prpropertystore.com/images/noimg.webp" : item.img}
              alt={item.title}
              className="w-64 h-64 object-cover rounded-md mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="loader"></div>
        </div>
      )}

      {!hasMore && !loading && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">No more data available</p>
        </div>
      )}
    </div>
    </>
  );
}

function App() {
  return (
    <>
    <Helmet>
                <title>Korean Novel</title>

                {/* Social Media Preview Image (Open Graph Protocol) */}
                <meta property="og:title" content="Korean Novel" />
                <meta property="og:description" content="This is a page with an image from a URL." />
                <meta property="og:image" content="https://prpropertystore.com/images/favicon.jpg" />
                <meta property="og:type" content="website" />

                {/* Favicon Example */}
                <link rel="icon" href="https://prpropertystore.com/images/favicon.ico" />
            </Helmet>

    <Router>
    <Navbar />
      <Routes>
        <Route path="/novel" element={<Home />} />
        <Route path="/novel/item" element={<ItemDetail />} /> {/* Use title in the route */}
        <Route path="/novel/episode/:id/:episodeId" element={<EpisodeDetail />} />
        <Route path="/novel/type" element={<Type />} />
        <Route path="/novel/search" element={<Search />} />
        
        <Route path="/about" element={<Home />} />
        <Route path="/services" element={<Home />} />
        <Route path="/contact" element={<Home />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
