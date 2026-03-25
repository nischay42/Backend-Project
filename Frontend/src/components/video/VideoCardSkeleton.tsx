const VideoCardSkeleton = () => {
  return (
    <div className="min-w-88 h-88 relative mt-4">
      <div className="static z-0 top-0 h-full w-full">

        {/* Thumbnail skeleton */}
        <div className="min-w-88 max-w-100 h-56 overflow-hidden rounded-sm bg-gray-800 animate-pulse relative">
          {/* Duration badge placeholder */}
          <div className="absolute bottom-2 right-2 w-10 h-4 bg-gray-700 rounded" />
        </div>

        {/* Card details skeleton */}
        <div className="relative w-full">
          <div className="flex min-w-88 max-w-100 h-32">

            {/* Avatar skeleton */}
            <div className="flex pt-5 mr-2 min-w-11 max-w-30">
              <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
            </div>

            {/* Text skeleton */}
            <div className="min-w-53 max-w-70 mt-4 space-y-2">
              {/* Title - two lines */}
              <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />

              {/* Channel name */}
              <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2 mt-2" />

              {/* Views + time */}
              <div className="flex gap-2 mt-1">
                <div className="h-3 bg-gray-800 rounded animate-pulse w-16" />
                <div className="h-3 bg-gray-800 rounded animate-pulse w-20" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default VideoCardSkeleton
