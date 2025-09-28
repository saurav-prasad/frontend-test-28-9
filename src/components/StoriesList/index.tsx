interface StoriesListInterface {
  onClick: (id: number) => void;
  storyList: { id: number; username: string; avatar: string }[];
}

function StoriesList({ onClick, storyList }: StoriesListInterface) {
  function getAvatar(value: any) {
    return (
      <img
        className="w-18 h-18 p-0.5 bg-gray-800 rounded-full border-2 border-pink-500"
        src={value}
        alt={value}
      />
    );
  }
  function handleOnClick(id: number) {
    onClick(id);
  }
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 border-b border-border scrollbar-hide">
      <div className="flex shrink-0 space-x-4 overflow-auto">
        {storyList.map((story, i) => (
          <div
            onClick={() => handleOnClick(story.id)}
            key={i}
            className="  cursor-pointer"
          >
            {getAvatar(story.avatar)}
            <span className="text-xs text-white text-center block mt-1 w-16 truncate">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesList;
