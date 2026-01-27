"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ============================================
// Types
// ============================================

export interface SalesDataPoint {
  date: string;
  sales: number;
}

export interface OrdersDataPoint {
  status: string;
  count: number;
  color?: string;
}

export interface RevenueDataPoint {
  date: string;
  current: number;
  previous: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

// ============================================
// Chart Colors - Using CSS Variables
// ============================================

const chartColors = {
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
};

// Fallback colors for direct use (oklch values converted to hex approximations)
const fallbackColors = {
  primary: "#8B5CF6",
  accent: "#EC4899",
  blue: "#3B82F6",
  amber: "#F59E0B",
  emerald: "#10B981",
};

// ============================================
// Custom Tooltip Components
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
  formatter?: (value: number) => string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatter = (v) => `${v.toLocaleString()}₽`,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/50 bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">
            {entry.name || entry.dataKey}:
          </span>
          <span className="font-semibold text-foreground">
            {formatter(entry.value || 0)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// SalesChart Component
// ============================================

interface SalesChartProps {
  data: SalesDataPoint[];
  height?: number;
}

export function SalesChart({ data, height = 300 }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fallbackColors.primary} stopOpacity={0.4} />
            <stop offset="50%" stopColor={fallbackColors.primary} stopOpacity={0.15} />
            <stop offset="100%" stopColor={fallbackColors.primary} stopOpacity={0} />
          </linearGradient>
          <filter id="salesGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          strokeOpacity={0.3}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))", strokeOpacity: 0.5 }}
          dy={10}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}к₽`}
          dx={-10}
        />
        <Tooltip
          content={<CustomTooltip formatter={(v) => `${v.toLocaleString()}₽`} />}
          cursor={{
            stroke: fallbackColors.primary,
            strokeWidth: 1,
            strokeDasharray: "5 5",
            strokeOpacity: 0.5,
          }}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke={fallbackColors.primary}
          strokeWidth={3}
          fill="url(#salesGradient)"
          filter="url(#salesGlow)"
          animationDuration={1500}
          animationEasing="ease-out"
          dot={false}
          activeDot={{
            r: 6,
            fill: fallbackColors.primary,
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ============================================
// OrdersChart Component
// ============================================

interface OrdersChartProps {
  data: OrdersDataPoint[];
  height?: number;
}

const defaultOrderColors = [
  fallbackColors.primary,
  fallbackColors.accent,
  fallbackColors.blue,
  fallbackColors.amber,
  fallbackColors.emerald,
];

export function OrdersChart({ data, height = 300 }: OrdersChartProps) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || defaultOrderColors[index % defaultOrderColors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={dataWithColors}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <defs>
          {dataWithColors.map((entry, index) => (
            <linearGradient
              key={`barGradient-${index}`}
              id={`barGradient-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
              <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          strokeOpacity={0.3}
          vertical={false}
        />
        <XAxis
          dataKey="status"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))", strokeOpacity: 0.5 }}
          dy={10}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip
          content={
            <CustomTooltip formatter={(v) => `${v.toLocaleString()} orders`} />
          }
          cursor={{
            fill: "hsl(var(--muted))",
            fillOpacity: 0.3,
            radius: 4,
          }}
        />
        <Bar
          dataKey="count"
          radius={[6, 6, 0, 0]}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {dataWithColors.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#barGradient-${index})`}
              className="transition-opacity duration-200 hover:opacity-80"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// RevenueChart Component
// ============================================

interface RevenueChartProps {
  data: RevenueDataPoint[];
  height?: number;
}

export function RevenueChart({ data, height = 300 }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <filter id="currentGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          strokeOpacity={0.3}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))", strokeOpacity: 0.5 }}
          dy={10}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}к₽`}
          dx={-10}
        />
        <Tooltip
          content={<CustomTooltip formatter={(v) => `${v.toLocaleString()}₽`} />}
          cursor={{
            stroke: "hsl(var(--border))",
            strokeWidth: 1,
            strokeDasharray: "5 5",
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-sm text-slate-300 capitalize ml-1">
              {value === "current" ? "Текущий период" : "Прошлый период"}
            </span>
          )}
        />
        <Line
          type="monotone"
          dataKey="previous"
          stroke={fallbackColors.accent}
          strokeWidth={2}
          strokeDasharray="5 5"
          strokeOpacity={0.6}
          dot={false}
          activeDot={{
            r: 5,
            fill: fallbackColors.accent,
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
          animationDuration={1500}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="current"
          stroke={fallbackColors.primary}
          strokeWidth={3}
          filter="url(#currentGlow)"
          dot={false}
          activeDot={{
            r: 6,
            fill: fallbackColors.primary,
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// CategoryDonut Component
// ============================================

interface CategoryDonutProps {
  data: CategoryDataPoint[];
  height?: number;
}

export function CategoryDonut({ data, height = 300 }: CategoryDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomPieTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: CategoryDataPoint }>;
  }) => {
    if (!active || !payload?.length) return null;

    const entry = payload[0];
    const percentage = ((entry.value / total) * 100).toFixed(1);

    return (
      <div className="rounded-lg border border-border/50 bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.payload.color }}
          />
          <span className="font-medium text-foreground">{entry.name}</span>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {entry.value.toLocaleString()} items ({percentage}%)
        </div>
      </div>
    );
  };

  const renderCenterLabel = () => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan
        x="50%"
        dy="-0.5em"
        className="text-2xl font-bold"
        fill="#ffffff"
      >
        {total.toLocaleString()}
      </tspan>
      <tspan
        x="50%"
        dy="1.5em"
        className="text-xs"
        fill="#94a3b8"
      >
        Всего
      </tspan>
    </text>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <defs>
          {data.map((entry, index) => (
            <linearGradient
              key={`pieGradient-${index}`}
              id={`pieGradient-${index}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
              <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
            </linearGradient>
          ))}
          <filter id="pieGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="85%"
          paddingAngle={3}
          dataKey="value"
          animationDuration={1200}
          animationEasing="ease-out"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#pieGradient-${index})`}
              filter="url(#pieGlow)"
              className="transition-all duration-200 hover:opacity-80 cursor-pointer"
              style={{
                transformOrigin: "center",
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={10}
          formatter={(value, entry) => (
            <span className="text-sm text-slate-300 ml-1">
              {value}
            </span>
          )}
        />
        {renderCenterLabel()}
      </PieChart>
    </ResponsiveContainer>
  );
}

// ============================================
// Sample/Mock Data for Testing
// ============================================

export const sampleSalesData: SalesDataPoint[] = [
  { date: "Jan", sales: 12400 },
  { date: "Feb", sales: 14500 },
  { date: "Mar", sales: 13200 },
  { date: "Apr", sales: 18900 },
  { date: "May", sales: 22100 },
  { date: "Jun", sales: 19800 },
  { date: "Jul", sales: 24500 },
  { date: "Aug", sales: 28900 },
  { date: "Sep", sales: 26700 },
  { date: "Oct", sales: 31200 },
  { date: "Nov", sales: 35600 },
  { date: "Dec", sales: 42100 },
];

export const sampleOrdersData: OrdersDataPoint[] = [
  { status: "Pending", count: 156, color: fallbackColors.amber },
  { status: "Processing", count: 234, color: fallbackColors.blue },
  { status: "Shipped", count: 412, color: fallbackColors.primary },
  { status: "Delivered", count: 687, color: fallbackColors.emerald },
  { status: "Cancelled", count: 43, color: fallbackColors.accent },
];

export const sampleRevenueData: RevenueDataPoint[] = [
  { date: "Jan", current: 24500, previous: 21200 },
  { date: "Feb", current: 28900, previous: 24100 },
  { date: "Mar", current: 32100, previous: 27800 },
  { date: "Apr", current: 29800, previous: 26500 },
  { date: "May", current: 35600, previous: 30200 },
  { date: "Jun", current: 42100, previous: 35800 },
  { date: "Jul", current: 38900, previous: 32100 },
  { date: "Aug", current: 45200, previous: 38900 },
  { date: "Sep", current: 48700, previous: 41200 },
  { date: "Oct", current: 52100, previous: 44500 },
  { date: "Nov", current: 58900, previous: 49800 },
  { date: "Dec", current: 65400, previous: 55200 },
];

export const sampleCategoryData: CategoryDataPoint[] = [
  { name: "Figures", value: 2450, color: fallbackColors.primary },
  { name: "Manga", value: 1820, color: fallbackColors.accent },
  { name: "Apparel", value: 1340, color: fallbackColors.blue },
  { name: "Accessories", value: 980, color: fallbackColors.amber },
  { name: "Posters", value: 650, color: fallbackColors.emerald },
];

// ============================================
// Export All
// ============================================

export {
  chartColors,
  fallbackColors,
  CustomTooltip,
};
