import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="flex justify-center items-center py-8">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-muted-foreground">Loading menu data...</p>
    </div>
  </div>
);

export default LoadingFallback;