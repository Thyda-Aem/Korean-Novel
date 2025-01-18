import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // React Router imports
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Helmet } from "react-helmet";


const EpisodePage = () => {
  const { id, episodeId } = useParams(); // Capture the dynamic parameters from the URL
  const navigate = useNavigate(); // Initialize the router for navigation

  const [episode, setEpisode] = useState(null);
  const [episodeCount, setEpisodeCount] = useState(0); // Use state for episode_count
  const [count, setCount] = useState(0); // Use state for count
  const [title, setTitle] = useState(""); // Use state for title
  const [comments, setComments] = useState(""); // Use state for descriptions
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    // console.log(`id ${id} episode ${episodeId}`);
    window.scrollTo(0, 0);
    if (!id || !episodeId) return;

    const fetchEpisode = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        const response = await fetch(`https://prpropertystore.com/api/episodedetail/${id}/${episodeId}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '5zGe3SLBwicYuLq11NIpl6rmXKYAidzUhD1SV7POFCE',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch episode details');
        }

        const data = await response.json();
        console.log('yyy',data)
        setEpisode(data.data.episode);
        setEpisodeCount(data.data.episode_count); // Set episode_count
        setCount(data.data.count); // Set count
        setTitle(data.data.title); // Set title
        setComments(data.data.comments); // Set descriptions
        setDescription(data.data.description)
        console.log('this data', count);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id, episodeId, count]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div> {/* Loading spinner */}
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error: {error}</div>;
  }

  if (!episode) {
    return <div className="flex justify-center items-center min-h-screen">No episode found!</div>;
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !comment) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch(
            `https://prpropertystore.com/api/submitcomment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': '5zGe3SLBwicYuLq11NIpl6rmXKYAidzUhD1SV7POFCE',
                },
                body: JSON.stringify({ name, email, comment, episodeId, id }),
            }
        );

        if (!response.ok) throw new Error('Failed to submit comment');

        const newComment = { name, comment }; // Adding comment to state immediately
        setComments((prevComments) => [newComment, ...prevComments]);

        alert('Comment submitted successfully!');
        setName('');
        setEmail('');
        setComment('');
    } catch (error) {
        alert('Error submitting comment: ' + error.message);
    }
};

  const parsedEpisodeId = episodeId && typeof episodeId === 'string' ? parseInt(episodeId) : 0;

  const formatTextWithLineBreaks = (text) => {
    return text.split(/\r\n|\r|\n/).map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <>
    <Helmet>
                    {/* Basic SEO Settings */}
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <meta name="keywords" content={`Korean Novel, Webnovels, React, SEO, Helmet, ${title}`} />
    
                    {/* Open Graph for Facebook & Social Sharing */}
                    <meta property="og:title" content= {`${title}`} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content="https://prpropertystore.com/images/favicon.jpg" />
                    <meta property="og:url" content="/" />
                    <meta property="og:type" content="website" />
    
                    {/* Twitter Card Metadata */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content= {`${title}`} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content="https://prpropertystore.com/images/favicon.jpg" />
    
                    {/* Favicon */}
                    <link rel="icon" href="https://prpropertystore.com/images/favicon.ico" />
                </Helmet>
      {/* Use react-helmet to manage head content in React */}
    
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <h2 className="text-2xl font-bold mb-4">
          {episode.episode_titles == null
            ? `Episode ${episodeId}`
            : `Episode ${episodeId} - ${episode.episode_titles}`}
        </h2>
        <p className="text-lg text-gray-700 mb-4">{formatTextWithLineBreaks(episode.description)}</p>
        <div className="mt-8 border-t pt-4">
              <h3 className="text-xl font-bold mb-2">Comments</h3>
              <div className="w-full h-[300px] overflow-y-scroll border p-2 space-y-3 flex flex-col-reverse">
                  {comments && comments.length > 0 ? (
                      comments.map((comment, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border-b">
                        <div className="flex-shrink-0">
                          {/* Add a profile picture */}
                          <img
                            src="https://prpropertystore.com/images/redfox.jpg"
                            alt={comment.name}
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-2">
                          <p className="text-sm font-semibold text-gray-800">{comment.name}</p>
                          <p className="text-sm text-gray-700">{formatTextWithLineBreaks(comment.comment)}</p>
                        </div>
                      </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-center flex items-center justify-center h-full">
                    No comments yet.
                  </p>
                  
                  )}
              </div>
            </div> 
            {/* Comment Form */}
            <div className="mt-8 border-t pt-4">
                <h3 className="text-xl font-bold mb-2">Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit}>
                    <label className="block mb-2">
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 w-full mb-2"
                            required
                        />
                    </label>
                    <label className="block mb-2">
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 w-full mb-2"
                            required
                        />
                    </label>
                    <label className="block mb-2">
                        Comment:
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border p-2 w-full mb-2"
                            required
                        />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Submit Comment
                    </button>
                </form>
            </div>

      </div>

      <div className="p-0 m-0">
        {/* Navigation buttons */}
        {parsedEpisodeId > 1 && (
          <button
            onClick={() => navigate(`/episode/${id}/${parsedEpisodeId - 1}`)}
            className="text-3xl fixed left-20 transform -translate-x-1/2 top-[50vh]"
          >
            <FaArrowLeft />
          </button>
        )}

        {parsedEpisodeId < episodeCount && (
          <button
            onClick={() => navigate(`/episode/${id}/${parsedEpisodeId + 1}`)}
            className="text-3xl fixed right-20 transform translate-x-1/2 top-[50vh]"
          >
            <FaArrowRight />
          </button>
        )}
      </div>
    </>
  );
};

export default EpisodePage;
