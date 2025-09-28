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
  const [userInfo, setUserInfo] = useState<{
    id: number;
    username: string;
    avatar: string;
  }>();

  useEffect(() => {
    if (clickedStoryId) {
      fetchStories(clickedStoryId);
      setUserInfo(storyList.find((story) => story.id === clickedStoryId));
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
      setUserInfo(storyList[currentIndex - 1]);
      fetchStories(storyList[currentIndex - 1].id);
      setCurrentStoryId(storyList[currentIndex - 1].id);
    } else {
      handleOnClose();
    }
  }
  function handleMoveToNextStory() {
    const currentIndex = storyList.findIndex(
      (story) => story.id === currentStoryId
    );
    if (currentIndex < storyList.length - 1) {
      setUserInfo(storyList[currentIndex + 1]);
      fetchStories(storyList[currentIndex + 1].id);
      setCurrentStoryId(storyList[currentIndex + 1].id);
    } else {
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
          <div className="absolute top-8 right-4 left-4 flex flex-row justify-between items-center z-10">
            <div className="flex justify-start items-center space-x-2">
              <img
                className="w-10 h-10 p-0.5 bg-gray-800 rounded-full border-1 border-pink-500"
                src={userInfo?.avatar}
                alt={userInfo?.username}
              />
              <span className="text-white text-sm pb-1">
                {userInfo?.username}
              </span>
            </div>
            <button
              className=" text-white text-3xl mb-2 font-bold cursor-pointer"
              onClick={handleOnClose}
            >
              &times;
            </button>
          </div>
          <Story
            userInfo={userInfo!}
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
