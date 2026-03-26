const WatchVideoCardSkeleton = ({
  videoWidth = 'lg:w-[25vw]',
  videoHeight='h-30',
  detailWidth = 'w-full'
}: {
  videoWidth?: string
  videoHeight?: string
  detailWidth?: string
}) => {
  return (
    <div className={`border border-[#ffffff20] w-[95vw] lg:w-auto p-1 ${videoHeight} lg:h-[22vh] relative`}>
      <div className="flex z-0 top-0 h-full w-full">

        {/* Thumbnail skeleton */}
        <div className={`relative ${videoWidth} h-full bg-gray-800 animate-pulse shrink-0`}>
          {/* Duration badge placeholder */}
          <div className="absolute bottom-2 right-2 w-10 h-4 bg-gray-700 rounded-sm" />
        </div>

        {/* Details skeleton */}
        <div className={`flex ${detailWidth} pl-2 h-full relative`}>
          <div className="flex flex-col justify-between w-full py-1">

            {/* Title */}
            <div className="space-y-2 pr-6">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-4/5" />
            </div>

            {/* Channel info + views */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse shrink-0" />
                {/* Channel name */}
                <div className="h-3.5 bg-gray-700 rounded animate-pulse w-24" />
              </div>
              {/* Views + time */}
              <div className="flex gap-2">
                <div className="h-3 bg-gray-800 rounded animate-pulse w-14" />
                <div className="h-3 bg-gray-800 rounded animate-pulse w-20" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default WatchVideoCardSkeleton
