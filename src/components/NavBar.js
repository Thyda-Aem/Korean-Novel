// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaComment } from 'react-icons/fa';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const openTelegram = () => {
    window.open('https://t.me/thyda3', '_blank');
  };

  const types = [
    '로맨스', '판타지', '현대', '무협', 'SF', '시대/역사', '게임', '퓨전',
    '회귀물', '빙의', '먼치킨', '스포츠', '성인', 'BL/백합', '기타'
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?query=${searchTerm.toLowerCase()}`);
  };

  const handleTypeButtonClick = (type) => {
    const encodedType = encodeURIComponent(type);
    setSelectedType(type);
    navigate(`/type?type=${encodedType}`);
  };

  return (
    <>
      <nav className="bg-purple-600 p-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-white text-xl font-bold text-center sm:text-left">
            <Link to="/">
              <img src='https://prpropertystore.com/images/favicon.jpg' alt="Website Logo" style={{ width: '150px' }} />
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <input
              type="text"
              required
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="p-2 rounded-lg flex-grow"
            />
            <button
              type="submit"
              className="bg-white text-purple-600 p-2 rounded-lg"
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto top-[60px] z-40 mt-4 mb-4 px-4 flex flex-col gap-2 justify-center border-b border-x-purple-600"> 
        <ul className="flex flex-wrap gap-2 justify-center mb-[10px]">
          {types.map((type) => (
            <li
              key={type}
              onClick={() => handleTypeButtonClick(type)}
              className={`p-2 rounded-lg text-sm font-semibold ${selectedType === type ? "active bg-white text-blue-600" : "bg-blue-600 text-white"}`}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          className="fixed top-40 right-4 px-4 py-2 text-blue-600 font-semibold rounded hover:text-pink-600 flex items-center"
          onClick={openTelegram}
        >
          <FaComment className="w-[30px] h-auto mr-2" />
        </button>
      </div>
    </>
  );
};

export default Navbar;
