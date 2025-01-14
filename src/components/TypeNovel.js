import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";


const Type = () => {
  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch type from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeNovel = params.get('type') || '';
    setType(typeNovel);
    setPage(1); // Reset page when type changes
    setData([]); // Clear data on type change
  }, [location.search]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      if (!type) return;

      setLoading(true);
      setError(null);

      try {
        const encodedType = encodeURIComponent(type);
        const response = await fetch(
          `https://prpropertystore.com/api/type?type=${encodedType}&page=${page}`,
          {
            method: 'GET',
            headers: {
              'X-API-KEY': '5zGe3SLBwicYuLq11NIpl6rmXKYAidzUhD1SV7POFCE',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data?.length === 0) {
          setHasMore(false);
        } else {
          setData((prevData) => [
            ...prevData,
            ...result.data.filter(
              (newItem) =>
                !prevData.some((existingItem) => existingItem.id === newItem.id)
            ),
          ]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, page]);

  // Navigate to item details
  const handleItemClick = (title) => {
    const encodedTitle = encodeURIComponent(title);
    navigate(`/novel/item?title=${encodedTitle}`);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, hasMore]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <>
    <Helmet>
                        {/* Basic SEO Settings */}
                        <title>{type}</title>
                        <meta name="description" content={type} />
                        <meta name="keywords" content={`Korean Novel, Webnovels, React, SEO, Helmet, ${type}`} />
        
                        {/* Open Graph for Facebook & Social Sharing */}
                        <meta property="og:title" content= {`${type}`} />
                        <meta property="og:description" content={type} />
                        <meta property="og:image" content="https://prpropertystore.com/images/favicon.jpg" />
                        <meta property="og:url" content="https://prpropertystore.com/novel" />
                        <meta property="og:type" content="website" />
        
                        {/* Twitter Card Metadata */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content= {`${type}`} />
                        <meta name="twitter:description" content={type} />
                        <meta name="twitter:image" content="https://prpropertystore.com/images/favicon.jpg" />
        
                        {/* Favicon */}
                        <link rel="icon" href="https://prpropertystore.com/images/favicon.ico" />
                    </Helmet>
    <div ref={scrollContainerRef} className="overflow-y-auto h-screen">
      {/* Error Message */}
      {error && (
        <div className="flex justify-center items-center min-h-screen">
          <p>Error: {error}</p>
        </div>
      )}

      {/* No Data */}
      {data.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">No novels available</p>
        </div>
      )}

      {/* Content Grid */}
      <div className="max-w-4xl mx-auto shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.title)}
            className="bg-gray-100 p-2 rounded-lg shadow-lg cursor-pointer"
          >
            <img
              src={item.img || 'https://prpropertystore.com/images/noimg.webp'}
              alt={item.title}
              className="w-full h-64 object-cover rounded-md mb-4"
              onError={(e) => (e.target.src = 'https://prpropertystore.com/images/noimg.webp')}
            />
            <h1 className="text-lg font-bold">{item.title}</h1>
          </div>
        ))}
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="loader"></div>
        </div>
      )}

      {/* End of Content Message */}
      {!hasMore && !loading && data.length > 0 && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-500">No more novels available</p>
        </div>
      )}
    </div>
    </>
  );
};

export default Type;
