import { useEffect, useRef } from "react";

export default function UsageChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Mock chart data - in production, this would use real data
    const mockData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      applications: [12, 19, 3, 5, 2, 3, 7],
      resumes: [8, 12, 15, 10, 8, 6, 4],
      jobMatches: [5, 8, 12, 15, 10, 7, 9]
    };

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
        
        // Set canvas size
        const canvas = chartRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Draw simple line chart
        const padding = 40;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;
        
        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height + padding);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height + padding);
        ctx.lineTo(width + padding, height + padding);
        ctx.stroke();
        
        // Draw data line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const stepX = width / (mockData.labels.length - 1);
        const maxValue = Math.max(...mockData.applications);
        
        mockData.applications.forEach((value, index) => {
          const x = padding + index * stepX;
          const y = height + padding - (value / maxValue) * height;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#3b82f6';
        mockData.applications.forEach((value, index) => {
          const x = padding + index * stepX;
          const y = height + padding - (value / maxValue) * height;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        mockData.labels.forEach((label, index) => {
          const x = padding + index * stepX;
          ctx.fillText(label, x, height + padding + 20);
        });
      }
    }
  }, []);

  return (
    <div className="w-full h-64 relative">
      <canvas 
        ref={chartRef} 
        className="w-full h-full"
        style={{ maxHeight: '256px' }}
      />
      <div className="absolute top-0 right-0 text-xs text-gray-500 dark:text-gray-400">
        Interactive charts with real data coming soon
      </div>
    </div>
  );
}
