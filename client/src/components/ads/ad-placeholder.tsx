import { cn } from "@/lib/utils";
import { ENABLE_ADS } from "@/lib/constants";

interface AdPlaceholderProps {
  type: "banner" | "sidebar" | "mobile" | "interstitial";
  label?: string;
  description?: string;
  className?: string;
}

const adSizes = {
  banner: "h-24",
  sidebar: "h-64",
  mobile: "h-12",
  interstitial: "h-96"
};

const adDimensions = {
  banner: "728x90",
  sidebar: "300x250", 
  mobile: "320x50",
  interstitial: "728x300"
};

export default function AdPlaceholder({ 
  type, 
  label, 
  description, 
  className 
}: AdPlaceholderProps) {
  if (!ENABLE_ADS) {
    return null;
  }

  return (
    <div className={cn(
      "bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center",
      adSizes[type],
      className
    )}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          <i className="fas fa-ad mr-2"></i>
          {label || `Advertisement (${adDimensions[type]})`}
        </div>
        {description && (
          <div className="text-xs text-gray-400 mt-1">
            {description}
          </div>
        )}
        {/* Actual ad implementation would go here */}
        {/* Example: <ins className="adsbygoogle" data-ad-client="..." data-ad-slot="..."></ins> */}
      </div>
    </div>
  );
}
