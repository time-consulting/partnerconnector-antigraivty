import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

// Lazy-loaded chart container
interface LazyChartContainerProps {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  className?: string;
  id?: string;
}

export function LazyChartContainer({ 
  config, 
  children, 
  className,
  id,
  ...props 
}: LazyChartContainerProps) {
  return (
    <ChartContainer
      config={config}
      className={className}
      id={id}
      {...props}
    >
      {children}
    </ChartContainer>
  );
}

// Lazy-loaded Bar Chart
interface LazyBarChartProps {
  data: any[];
  config: ChartConfig;
  children?: React.ReactNode;
  className?: string;
  dataKey?: string;
  fill?: string;
  xAxisDataKey?: string;
}

export function LazyBarChart({ 
  data, 
  config, 
  children, 
  className = "",
  dataKey = "value",
  fill = "var(--color-bar)",
  xAxisDataKey = "name"
}: LazyBarChartProps) {
  return (
    <LazyChartContainer config={config} className={className}>
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={xAxisDataKey} />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <RechartsPrimitive.Bar dataKey={dataKey} fill={fill} />
        {children}
      </RechartsPrimitive.BarChart>
    </LazyChartContainer>
  );
}

// Lazy-loaded Line Chart
interface LazyLineChartProps {
  data: any[];
  config: ChartConfig;
  children?: React.ReactNode;
  className?: string;
  dataKey?: string;
  stroke?: string;
  xAxisDataKey?: string;
}

export function LazyLineChart({ 
  data, 
  config, 
  children, 
  className = "",
  dataKey = "value",
  stroke = "var(--color-line)",
  xAxisDataKey = "name"
}: LazyLineChartProps) {
  return (
    <LazyChartContainer config={config} className={className}>
      <RechartsPrimitive.LineChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={xAxisDataKey} />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <RechartsPrimitive.Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={stroke} 
          strokeWidth={2}
        />
        {children}
      </RechartsPrimitive.LineChart>
    </LazyChartContainer>
  );
}

// Lazy-loaded Pie Chart
interface LazyPieChartProps {
  data: any[];
  config: ChartConfig;
  children?: React.ReactNode;
  className?: string;
  dataKey?: string;
  nameKey?: string;
}

export function LazyPieChart({ 
  data, 
  config, 
  children, 
  className = "",
  dataKey = "value",
  nameKey = "name"
}: LazyPieChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <LazyChartContainer config={config} className={className}>
      <RechartsPrimitive.PieChart>
        <RechartsPrimitive.Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <RechartsPrimitive.Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </RechartsPrimitive.Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        {children}
      </RechartsPrimitive.PieChart>
    </LazyChartContainer>
  );
}

// Lazy-loaded Area Chart
interface LazyAreaChartProps {
  data: any[];
  config: ChartConfig;
  children?: React.ReactNode;
  className?: string;
  dataKey?: string;
  fill?: string;
  stroke?: string;
  xAxisDataKey?: string;
}

export function LazyAreaChart({ 
  data, 
  config, 
  children, 
  className = "",
  dataKey = "value",
  fill = "var(--color-area)",
  stroke = "var(--color-line)",
  xAxisDataKey = "name"
}: LazyAreaChartProps) {
  return (
    <LazyChartContainer config={config} className={className}>
      <RechartsPrimitive.AreaChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={xAxisDataKey} />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <RechartsPrimitive.Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={stroke}
          fill={fill}
        />
        {children}
      </RechartsPrimitive.AreaChart>
    </LazyChartContainer>
  );
}

// Advanced chart components with more customization
interface LazyAdvancedBarChartProps {
  data: any[];
  config: ChartConfig;
  className?: string;
  xAxisDataKey?: string;
  bars: {
    dataKey: string;
    fill: string;
    name?: string;
  }[];
}

export function LazyAdvancedBarChart({ 
  data, 
  config, 
  className = "",
  xAxisDataKey = "name",
  bars
}: LazyAdvancedBarChartProps) {
  return (
    <LazyChartContainer config={config} className={className}>
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={xAxisDataKey} />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {bars.map((bar, index) => (
          <RechartsPrimitive.Bar 
            key={index}
            dataKey={bar.dataKey} 
            fill={bar.fill}
            name={bar.name}
          />
        ))}
      </RechartsPrimitive.BarChart>
    </LazyChartContainer>
  );
}

interface LazyAdvancedLineChartProps {
  data: any[];
  config: ChartConfig;
  className?: string;
  xAxisDataKey?: string;
  lines: {
    dataKey: string;
    stroke: string;
    name?: string;
    strokeWidth?: number;
  }[];
}

export function LazyAdvancedLineChart({ 
  data, 
  config, 
  className = "",
  xAxisDataKey = "name",
  lines
}: LazyAdvancedLineChartProps) {
  return (
    <LazyChartContainer config={config} className={className}>
      <RechartsPrimitive.LineChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={xAxisDataKey} />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {lines.map((line, index) => (
          <RechartsPrimitive.Line 
            key={index}
            type="monotone" 
            dataKey={line.dataKey} 
            stroke={line.stroke}
            strokeWidth={line.strokeWidth || 2}
            name={line.name}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </LazyChartContainer>
  );
}