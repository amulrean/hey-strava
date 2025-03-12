import { CacheInfo } from "@/utils/cache";
import { getCacheSize } from "@/utils/cache";

interface CacheControlsProps {
  cacheInfo: CacheInfo | null;
  loading: boolean;
  onRefresh: () => void;
  onClearCache: () => void;
}

export function CacheControls({ cacheInfo, loading, onRefresh, onClearCache }: CacheControlsProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-medium">Your Activities</h2>
        {cacheInfo?.isCached && (
          <p className="text-xs text-gray-500 mt-1">
            Using cached data (expires in {cacheInfo.expiresIn})
            {getCacheSize() > 0 && ` • ${(getCacheSize() / 1024).toFixed(1)}KB cached`}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {cacheInfo?.isCached && (
          <button
            onClick={onClearCache}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            title="Clear cached data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        )}
        <button
          onClick={onRefresh}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? 'animate-spin' : ''}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
