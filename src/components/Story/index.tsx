import React, { useEffect, useState, useRef } from "react";

interface StoryInterface {
  stories: { id: number; image: string }[];
  moveToPrevioiusStory: () => void;
  moveToNextStory: () => void;
}

const Story = ({
  stories,
  moveToPrevioiusStory,
  moveToNextStory,
}: StoryInterface) => {
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const STORY_DURATION = 5000; // 5 seconds
  const PROGRESS_UPDATE_INTERVAL = 50; // Update progress every 50ms

  function getCurrentImage() {
    const story = stories.find((story) => story.id === currentId);
    if (story) {
      return (
        <div
          key={story.id}
          className="select-none relative h-full w-full flex justify-center items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <img
            src={story.image}
            alt={`Story ${story.id}`}
            className="max-w-full max-h-full object-contain"
          />
          <div
            onClick={handleGoPrev}
            className="group absolute z-[9] flex top-0 bottom-0 left-0 w-[25%] pl-5 justify-start items-center cursor-pointer"
          >
            <svg
              className="w-9 h-9 group-hover:opacity-100 opacity-0 group-hover:-translate-x-2 transition-all fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320zM576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7C182.5 314.9 182.5 325.1 188.7 331.3L292.7 435.3C297.3 439.9 304.2 441.2 310.1 438.8C316 436.4 320 430.5 320 424L320 352L424 352C437.3 352 448 341.3 448 328L448 312C448 298.7 437.3 288 424 288L320 288L320 216C320 209.5 316.1 203.7 310.1 201.2C304.1 198.7 297.2 200.1 292.7 204.7L188.7 308.7z" />
            </svg>
          </div>
          <div
            onClick={handleGoNext}
            className="group absolute z-[9] top-0 bottom-0 right-0 w-[25%] pr-5 flex justify-end items-center cursor-pointer transition-all"
          >
            <svg
              className="w-9 h-9 group-hover:opacity-100 opacity-0 group-hover:translate-x-2 transition-all fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM451.3 331.3C457.5 325.1 457.5 314.9 451.3 308.7L347.3 204.7C342.7 200.1 335.8 198.8 329.9 201.2C324 203.6 320 209.5 320 216L320 288L216 288C202.7 288 192 298.7 192 312L192 328C192 341.3 202.7 352 216 352L320 352L320 424C320 430.5 323.9 436.3 329.9 438.8C335.9 441.3 342.8 439.9 347.3 435.3L451.3 331.3z" />
            </svg>
          </div>
        </div>
      );
    }
    return null;
  }

  function handleGoNext() {
    if (currentId) {
      const currentIndex = stories.findIndex((story) => story.id === currentId);
      if (currentIndex < stories.length - 1) {
        setCurrentId(stories[currentIndex + 1].id);
        resetProgress();
      } else {
        moveToNextStory();
      }
    }
  }

  function handleGoPrev() {
    if (currentId) {
      const currentIndex = stories.findIndex((story) => story.id === currentId);
      if (currentIndex > 0) {
        setCurrentId(stories[currentIndex - 1].id);
        resetProgress();
      } else {
        moveToPrevioiusStory();
      }
    }
  }

  function resetProgress() {
    setProgress(0);
  }

  function getCurrentStoryIndex() {
    return stories.findIndex((story) => story.id === currentId);
  }

  // Auto-progression timer
  useEffect(() => {
    if (isPaused || !currentId) return;

    intervalRef.current = setTimeout(() => {
      handleGoNext();
    }, STORY_DURATION);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentId, isPaused]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused || !currentId) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    resetProgress();
    const progressIncrement = (100 * PROGRESS_UPDATE_INTERVAL) / STORY_DURATION;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current!);
          return 100;
        }
        return newProgress;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentId, isPaused]);

  // Initialize first story
  useEffect(() => {
    if (stories.length > 0) {
      setCurrentId(stories[0].id);
    }
  }, [stories]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
      {/* Progress bars */}
      <div className="absolute z-10 top-4 right-0 left-0 space-x-2 w-full px-4 flex justify-center items-center flex-row">
        {stories.length > 0 &&
          stories.map(({ id }, index) => {
            const currentIndex = getCurrentStoryIndex();
            let progressWidth = "0%";

            if (index < currentIndex) {
              progressWidth = "100%";
            } else if (index === currentIndex) {
              progressWidth = `${progress}%`;
            }

            return (
              <div
                key={id}
                className="relative w-full h-1 max-w-md bg-white/50 rounded-full overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{ width: progressWidth }}
                />
              </div>
            );
          })}
      </div>

      {/* Story images */}
      {getCurrentImage()}
    </div>
  );
};

export default Story;
