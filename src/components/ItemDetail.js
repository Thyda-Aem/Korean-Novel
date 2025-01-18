import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";

function ItemDetail() {
  const [title, setTitle] = useState('');
  const [item, setItem] = useState(null);
  const navigate = useNavigate(); 
  const location = useLocation(); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTitle = params.get('title') || ''; 
    setTitle(searchTitle);
  }, [location.search]);

  useEffect(() => {
    const fetchItem = async () => {
      if (!title) return;
      try {
        const response = await fetch(`https://prpropertystore.com/api/detail?title=${title}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '5zGe3SLBwicYuLq11NIpl6rmXKYAidzUhD1SV7POFCE',
          },
        });
        const result = await response.json();
        setItem(result.data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [title]); 

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const handleEpisodeNavigation = (id, episodeId) => {
    navigate(`/episode/${id}/${episodeId}`);
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={item.description} />
        <meta name="keywords" content={`Korean Novel, Webnovels, React, SEO, Helmet, ${title}`} />
      </Helmet>
      <div className="flex justify-center min-h-screen bg-gray-100 p-5">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={item.img || 'https://prpropertystore.com/images/noimg.webp'}
            alt={item.title}
            className="w-1/2 object-cover mx-auto"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.title}</h1>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <div>
              {item.viewer_counts
                ?.sort((a, b) => b.episode_no - a.episode_no) // Sorting in descending order
                .map((vc, index) => (
                  <li
                    key={index}
                    className="flex justify-between bg-gray-100 p-2 rounded-md shadow"
                    onClick={() => handleEpisodeNavigation(item.id, vc.episode_no)}
                  >
                    <span>Episode {vc.episode_no}</span>
                    <span>{vc.viewer_count} views</span>
                  </li>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemDetail;
