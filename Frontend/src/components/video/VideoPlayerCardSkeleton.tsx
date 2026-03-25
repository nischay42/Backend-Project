const VideoPlayerCardSkeleton = () => {
  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-video">

        {/* Main video area */}
        <div className="w-full h-full bg-gray-900 animate-pulse" />

        {/* Center play button placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-gray-700/60 rounded-full animate-pulse" />
        </div>

        {/* Bottom controls gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/60 to-transparent pt-10 pb-3 px-4">

          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-1 bg-gray-700 rounded-full w-full animate-pulse" />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-4">
              {/* Play button */}
              <div className="w-6 h-6 bg-gray-600 rounded animate-pulse" />
              {/* Skip back */}
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
              {/* Skip forward */}
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
              {/* Volume icon */}
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
              {/* Time display */}
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Settings */}
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
              {/* Fullscreen */}
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VideoPlayerCardSkeleton
