import { useEffect, useState } from "react";
import { storiesList } from "../../constants/stories";
import Story from "../Story";

interface StoryViewerInterface {
  storyList: { id: number; username: string; avatar: string }[];
  onClose: () => void;
  clickedStoryId: number | null;
}

const StoryViewer = ({
  storyList,
  onClose,
  clickedStoryId,
}: StoryViewerInterface) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    if (clickedStoryId) {
      fetchStories(clickedStoryId);
    }
  }, [clickedStoryId]);

  function fetchStories(storyId: number) {
    const story = getStoryById(storyId);
    if (story) {
      setStories(story.stories);
    }
    setCurrentStoryId(storyId);
  }
  function getStoryById(id: number | null) {
    return storiesList.find((story) => story.id === id);
  }
  function handleOnClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }
  function handleMoveToPrevioiusStory() {
    const currentIndex = storyList.findIndex(
      (story) => story.id === currentStoryId
    );
    if (currentIndex > 0) {
      setCurrentStoryId(storyList[currentIndex - 1].id);
    } else {
      // Optional: handle case when it's already the first story
      console.log("Already at the first story");
      handleOnClose();
    }
  }
  function handleMoveToNextStory() {
    const currentIndex = storyList.findIndex(
      (story) => story.id === currentStoryId
    );
    console.log("object");
    if (currentIndex < storyList.length - 1) {
      console.log("object");
      fetchStories(storyList[currentIndex + 1].id);
      setCurrentStoryId(storyList[currentIndex + 1].id);
    } else {
      // Optional: handle case when it's already the last story
      console.log("Already at the last story");
      handleOnClose();
    }
  }

  return (
    <div
      className={`inset-0 bg-black z-50 h-screen flex items-center justify-center transition-all duration-300 ${
        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {currentStoryId && stories.length > 0 && (
        <div className="relative w-full h-full max-w-md bg-black rounded-lg overflow-hidden">
          <button
            className="absolute top-8 right-4 z-10 text-white text-2xl font-bold cursor-pointer"
            onClick={handleOnClose}
          >
            &times;
          </button>
          <Story
            moveToPrevioiusStory={handleMoveToPrevioiusStory}
            moveToNextStory={handleMoveToNextStory}
            stories={stories}
          />
        </div>
      )}
    </div>
  );
};
export default StoryViewer;
