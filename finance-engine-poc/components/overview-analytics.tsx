"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLIENT_ANALYTICS } from "@/lib/data";

const AXIS = "#9CA1B5";
const GRID = "#EFF1F7";

function withAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

const tooltipStyle = {
  borderRadius: 11,
  border: "1px solid #E8EAF2",
  fontSize: 12,
  boxShadow: "0 10px 30px -12px rgba(40,30,80,.18)",
} as const;

export function OverviewAnalytics({ clientId, accent }: { clientId: string; accent: string }) {
  const a = CLIENT_ANALYTICS[clientId];
  if (!a) return null;

  const gid = `trend-${clientId}`;
  const sliceColors = [1, 0.78, 0.58, 0.42, 0.3].map((o) => withAlpha(accent, o));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Andamento & impatto</h2>
        <p className="text-sm text-muted-foreground">
          Risultati misurati negli ultimi 12 mesi e impatto rispetto alla gestione tradizionale.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trend area — 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              {a.trendTitle}
              {a.trendUnit ? <span className="text-muted-foreground"> ({a.trendUnit})</span> : null}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Trend mensile su 12 mesi</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={a.trend} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.32} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={GRID} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11 }} width={40} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: accent, strokeOpacity: 0.2 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name={a.trendTitle}
                    stroke={accent}
                    strokeWidth={2.5}
                    fill={`url(#${gid})`}
                    dot={{ r: 0 }}
                    activeDot={{ r: 4, fill: accent }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown donut — 1/3 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{a.breakdownTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">Composizione</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={a.breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {a.breakdown.map((_, i) => (
                      <Cell key={i} fill={sliceColors[i % sliceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => {
                      const v = Number(value);
                      return a.breakdownUnit ? `${v}${a.breakdownUnit}` : v.toLocaleString("it-IT");
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Before / after grouped bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{a.beforeAfterTitle}</CardTitle>
          {a.beforeAfterNote && <p className="text-sm text-muted-foreground">{a.beforeAfterNote}</p>}
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.beforeAfter} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barGap={6}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11 }} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: `${accent}0F` }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
                <Bar dataKey="prima" name="Prima" fill="#D7DAE6" radius={[5, 5, 0, 0]} maxBarSize={46} />
                <Bar dataKey="dopo" name="Con AIchain" fill={accent} radius={[5, 5, 0, 0]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
