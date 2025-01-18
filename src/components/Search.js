import React, { useState, useEffect, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";

const Search = () => {
  const [data, setData] = useState([]); // State to store the data
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [hasMore, setHasMore] = useState(true); // State to track if there are more data
  const [query, setQuery] = useState(''); // State to store the query term

 
  const navigate = useNavigate(); // Use navigate for navigation
  const location = useLocation(); // To read query parameters from the URL

  // Get the query parameter from the URL (if it's a part of the URL)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('query') || ''; // Default to empty string if no query
    setQuery(searchQuery);
  }, [location.search]);

  // Fetch data based on query
  useEffect(() => {
    const fetchData = async () => {
      if (!query) return; // Don't fetch if there's no query
      setLoading(true);
      try {
        const response = await fetch(`https://prpropertystore.com/api/search?query=${query}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '5zGe3SLBwicYuLq11NIpl6rmXKYAidzUhD1SV7POFCE',
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.data.length === 0) {

          setHasMore(false); // No more data available
        } else {
          setData(result.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [query]); // Fetch data when the query changes

  const handleItemClick = (title) => {
    const encodedTitle = encodeURIComponent(title); // Encode title to make it URL-safe
    navigate(`/item?title=${encodedTitle}`); // Navigate to the item detail page using title
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div> {/* Ensure loader is defined */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">No results found</p>
        </div>
      // <div className="flex justify-center items-center min-h-screen">
      //   {/* <p>Error: {error.message}</p> */}
      //   {/* Optionally provide a retry button */}
      // </div>
    );
  }

  return (
    <>
    <Helmet>
                        {/* Basic SEO Settings */}
                        <title>{query}</title>
                        <meta name="description" content={query} />
                        <meta name="keywords" content={`Korean Novel, Webnovels, React, SEO, Helmet, ${query}`}  />
        
                        {/* Open Graph for Facebook & Social Sharing */}
                        <meta property="og:title" content= {`${query}`} />
                        <meta property="og:description" content={query} />
                        <meta property="og:image" content="https://prpropertystore.com/images/favicon.jpg" />
                        <meta property="og:url" content="/" />
                        <meta property="og:type" content="website" />
        
                        {/* Twitter Card Metadata */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content= {`${query}`} />
                        <meta name="twitter:description" content={query} />
                        <meta name="twitter:image" content="https://prpropertystore.com/images/favicon.jpg" />
        
                        {/* Favicon */}
                        <link rel="icon" href="https://prpropertystore.com/images/favicon.ico" />
                    </Helmet>
    
    <div className="overflow-y-auto h-screen">
      {/* Check if data is empty */}
      {data.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">No results found</p>
        </div>
      )}

      {/* Display the data */}
      <div className="max-w-4xl mx-auto shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.title)} // Attach click handler
            className="flex flex-col items-center justify-center bg-gray-100 p-2 rounded-lg shadow-lg cursor-pointer"
          >
            <img
              src={item.img || "https://via.placeholder.com/300"}
              alt={item.title}
              className="w-64 h-64 object-cover rounded-md mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
          </div>
        ))}
      </div>

      {/* Loader for loading state */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="loader"></div> {/* Ensure loader is defined */}
        </div>
      )}

      {/* No more data available message */}
      {!hasMore && !loading && data.length > 0 && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">No more data available</p>
        </div>
      )}
    </div>
    </>
  );
};

export default Search;
