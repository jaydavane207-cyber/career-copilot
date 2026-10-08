// frontend/src/pages/SuccessStories.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuccessStoriesFeed from '../components/Stories/SuccessStoriesFeed';
import StoryDetailPage from '../components/Stories/StoryDetailPage';

export const SuccessStories = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStoryId, setSelectedStoryId] = useState(id ? parseInt(id, 10) : null);

  const handleSelectStory = (storyId) => {
    setSelectedStoryId(storyId);
    navigate(`/stories/${storyId}`);
  };

  const handleBackToFeed = () => {
    setSelectedStoryId(null);
    navigate('/stories');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {selectedStoryId ? (
        <StoryDetailPage
          storyId={selectedStoryId}
          onBack={handleBackToFeed}
          onSelectStory={handleSelectStory}
        />
      ) : (
        <SuccessStoriesFeed onSelectStory={handleSelectStory} />
      )}
    </div>
  );
};

export default SuccessStories;
