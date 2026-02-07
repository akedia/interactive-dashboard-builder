# Chart.js Code Patterns Reference

Complete, copy-pasteable Chart.js patterns for dashboard building.

## Line Chart (Trend / Time Series)

```javascript
function createLineChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color || COLORS[i],
        backgroundColor: ds.fill ? (ds.bgColor || COLORS[i] + '20') : 'transparent',
        fill: ds.fill || false,
        tension: 0.3,
        pointRadius: ds.pointRadius ?? 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        ...ds.extra
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top',
          labels: { usePointStyle: true, padding: 16 }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          callbacks: options.tooltipCallbacks || {}
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 12 }
        },
        y: {
          beginAtZero: options.beginAtZero ?? true,
          grid: { color: 'rgba(0,0,0,0.06)' },
          ticks: {
            callback: options.yTickFormat || (v => v.toLocaleString()),
            maxTicksLimit: 8
          }
        },
        ...(options.y1 ? {
          y1: {
            position: 'right',
            beginAtZero: options.y1.beginAtZero ?? true,
            grid: { display: false },
            ticks: {
              callback: options.y1.tickFormat || (v => v.toLocaleString())
            }
          }
        } : {})
      }
    }
  });
}
```

### Usage: Simple Line Chart
```javascript
const chart = createLineChart('revenueChart', dates, [
  { label: 'Revenue', data: revenueValues, color: '#4F46E5', fill: true }
], {
  yTickFormat: v => '$' + v.toLocaleString()
});
```

### Usage: Multi-Line with Dual Axis
```javascript
const chart = createLineChart('arpuChart', dates, [
  { label: 'ARPU', data: arpuValues, color: '#4F46E5', extra: { yAxisID: 'y' } },
  { label: 'ARPPU', data: arppuValues, color: '#06B6D4', extra: { yAxisID: 'y1' } }
], {
  yTickFormat: v => '$' + v.toFixed(2),
  y1: { beginAtZero: false, tickFormat: v => '$' + v.toFixed(2) }
});
```

---

## Bar Chart (Comparison)

```javascript
function createBarChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.colors || ds.color || COLORS[i],
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: options.barPercentage || 0.7,
        categoryPercentage: options.categoryPercentage || 0.8,
        ...ds.extra
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: options.horizontal ? 'y' : 'x',
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top',
          labels: { usePointStyle: true, padding: 16 }
        },
        tooltip: {
          callbacks: options.tooltipCallbacks || {}
        }
      },
      scales: {
        x: {
          grid: { display: options.horizontal || false },
          stacked: options.stacked || false
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.06)' },
          stacked: options.stacked || false,
          ticks: {
            callback: options.yTickFormat || (v => v.toLocaleString())
          }
        }
      }
    }
  });
}
```

### Usage: Grouped Bar Chart
```javascript
const chart = createBarChart('channelChart', channels, [
  { label: 'Installs', data: installValues, color: '#4F46E5' },
  { label: 'Spend', data: spendValues, color: '#F59E0B' }
]);
```

### Usage: Horizontal Bar Chart
```javascript
const chart = createBarChart('topCreatives', creativeNames, [
  { label: 'CTR', data: ctrValues, color: '#10B981' }
], { horizontal: true });
```

---

## Stacked Bar Chart

```javascript
function createStackedBarChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color || COLORS[i],
        borderRadius: i === datasets.length - 1 ? { topLeft: 4, topRight: 4 } : 0,
        borderSkipped: false
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true } },
        tooltip: {
          callbacks: {
            footer: (items) => {
              const total = items.reduce((s, item) => s + item.raw, 0);
              return 'Total: ' + total.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.06)' },
          ticks: { callback: v => v.toLocaleString() }
        }
      }
    }
  });
}
```

### Usage: Revenue by Source (Stacked)
```javascript
const chart = createStackedBarChart('revenueBySource', dates, [
  { label: 'IAP', data: iapValues, color: '#4F46E5' },
  { label: 'Ads', data: adsValues, color: '#06B6D4' },
  { label: 'Subscription', data: subValues, color: '#10B981' }
]);
```

---

## Doughnut / Pie Chart (Distribution)

```javascript
function createDoughnutChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: options.pie ? 'pie' : 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: options.colors || COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: options.pie ? 0 : (options.cutout || '60%'),
      plugins: {
        legend: {
          position: options.legendPosition || 'right',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              const valueStr = options.valueFormat
                ? options.valueFormat(ctx.raw)
                : ctx.raw.toLocaleString();
              return `${ctx.label}: ${valueStr} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}
```

### Usage: Spend Distribution
```javascript
const chart = createDoughnutChart('spendDist', channels, spendValues, {
  valueFormat: v => '$' + v.toLocaleString()
});
```

### Center Text Plugin (for Doughnut)
```javascript
// Add total in the center of a doughnut chart
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, width, height } = chart;
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.save();
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillStyle = '#1F2937';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$' + (total / 1000).toFixed(1) + 'K', width / 2, height / 2 - 10);
    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Total Spend', width / 2, height / 2 + 14);
    ctx.restore();
  }
};

// Register globally or per-chart
Chart.register(centerTextPlugin);
```

---

## Mixed Chart (Bar + Line)

```javascript
function createMixedChart(canvasId, labels, barDatasets, lineDatasets) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        ...barDatasets.map((ds, i) => ({
          type: 'bar',
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.color || COLORS[i],
          borderRadius: 4,
          yAxisID: 'y',
          order: 2
        })),
        ...lineDatasets.map((ds, i) => ({
          type: 'line',
          label: ds.label,
          data: ds.data,
          borderColor: ds.color || COLORS[barDatasets.length + i],
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3,
          yAxisID: 'y1',
          order: 1
        }))
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true } }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          position: 'left',
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: { display: false }
        }
      }
    }
  });
}
```

### Usage: Installs (Bar) + CPI (Line)
```javascript
const chart = createMixedChart('uaChart', dates,
  [{ label: 'Installs', data: installValues, color: '#4F46E5' }],
  [{ label: 'CPI', data: cpiValues, color: '#EF4444' }]
);
```

---

## Chart Update Pattern

When filters change, destroy and recreate charts rather than using `chart.update()` for complex data changes:

```javascript
updateChart(chartKey, canvasId, createFn) {
  if (this.charts[chartKey]) {
    this.charts[chartKey].destroy();
  }
  this.charts[chartKey] = createFn(canvasId);
}

// Usage in renderCharts()
renderCharts() {
  this.updateChart('revenue', 'revenueChart', (id) => {
    const grouped = this.groupByDate(this.filteredData);
    const labels = Object.keys(grouped).sort();
    const values = labels.map(d => grouped[d].reduce((s, r) => s + r.revenue, 0));
    return createLineChart(id, labels, [
      { label: 'Revenue', data: values, color: '#4F46E5', fill: true }
    ], { yTickFormat: v => '$' + v.toLocaleString() });
  });

  this.updateChart('channels', 'channelChart', (id) => {
    const grouped = this.groupByChannel(this.filteredData);
    const labels = Object.keys(grouped);
    const values = labels.map(ch => grouped[ch].reduce((s, r) => s + r.installs, 0));
    return createBarChart(id, labels, [
      { label: 'Installs', data: values }
    ]);
  });
}
```

---

## Tooltip Customization

### Currency Tooltip
```javascript
tooltipCallbacks: {
  label: ctx => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
}
```

### Percentage Tooltip
```javascript
tooltipCallbacks: {
  label: ctx => `${ctx.dataset.label}: ${(ctx.raw * 100).toFixed(1)}%`
}
```

### Multi-value Tooltip
```javascript
tooltipCallbacks: {
  afterBody: (items) => {
    const idx = items[0].dataIndex;
    const row = aggregatedData[idx];
    return [
      `Installs: ${row.installs.toLocaleString()}`,
      `CPI: $${row.cpi.toFixed(2)}`,
      `ROAS: ${row.roas.toFixed(2)}x`
    ];
  }
}
```

---

## Axis Formatting

### Date Axis (Auto Grouping)
```javascript
scales: {
  x: {
    type: 'time',
    time: {
      unit: 'day',        // or 'week', 'month'
      displayFormats: { day: 'MM/dd', week: 'MM/dd', month: 'yyyy-MM' }
    }
  }
}
// Requires: <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3"></script>
```

### Currency Axis
```javascript
ticks: { callback: v => '$' + v.toLocaleString() }
```

### Percentage Axis
```javascript
ticks: { callback: v => (v * 100).toFixed(0) + '%' }
// Or for values already in percentage:
ticks: { callback: v => v.toFixed(1) + '%' }
```

### Abbreviated Numbers
```javascript
ticks: {
  callback: v => {
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
    return v;
  }
}
```

---

## Color Palette

```javascript
const COLORS = [
  '#4F46E5', // Indigo (primary)
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Blue-indigo
];

// Generate transparency variants
const withAlpha = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
```

---

## Chart.js CDN

Always include Chart.js from CDN in the HTML head:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>

<!-- Optional: Date adapter for time-series axes -->
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
```
