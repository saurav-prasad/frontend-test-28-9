import { useState } from "react";
import StoriesList from "../../components/StoriesList";
import StoryViewer from "../../components/StoryViewer";
import { storyList } from "../../constants/stories";

const Home = () => {
  const [viewStory, setViewStory] = useState<boolean>(false);
  const [clickedStoryId, setClickedStoryId] = useState<number | null>(null);

  const onStoryClick = (id: number) => {
    setClickedStoryId(id);
    setViewStory(true);
  };

  const onClose = () => {
    setViewStory(false);
    setClickedStoryId(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto space-y-4">
        {!viewStory && (
          <header className="border-b border-border border-white/50 py-4">
            <h1 className="text-xl font-semibold text-white">Stories</h1>
          </header>
        )}
        <main className="">
          {!viewStory && (
            <StoriesList storyList={storyList} onClick={onStoryClick} />
          )}
          {viewStory && (
            <StoryViewer
              clickedStoryId={clickedStoryId}
              storyList={storyList}
              onClose={onClose}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
