---
name: interactive-dashboard-builder
description: |
  Build self-contained, interactive HTML dashboards with Chart.js visualizations,
  KPI cards, filterable tables, and responsive layouts. Generates a single HTML file
  that can be opened directly in any browser - no server required.

  Use cases:
  - Data visualization and reporting dashboards
  - Game analytics dashboards (UA, retention, revenue)
  - Business KPI monitoring panels
  - Interactive reports with filters and drill-downs

  Triggers (EN): "build dashboard", "create dashboard", "interactive report",
  "HTML dashboard", "data dashboard", "KPI dashboard", "analytics dashboard",
  "visualization report"

  Triggers (CN): "做看板", "生成报表", "数据看板", "可视化报告", "HTML报表",
  "分析面板", "数据仪表盘", "交互式报告", "做一个看板", "生成一个报表"
---

# Interactive Dashboard Builder

## /build-dashboard Workflow

### Step 1: Understand Requirements

Ask the user to clarify:
- **Purpose**: What decisions will this dashboard support?
- **Audience**: Who will view it? (executives, analysts, ops team)
- **Key Metrics**: What are the 3-6 most important KPIs?
- **Dimensions**: What filters/breakdowns are needed? (date, region, channel, etc.)
- **Data Source**: Where does the data come from?

### Step 2: Gather Data

Data can come from multiple sources:
- **Direct paste**: User pastes CSV/JSON data
- **Query results**: Output from a database query or the `datain-query` skill
- **Sample data**: Generate realistic sample data for prototyping
- **File read**: Read from local CSV/JSON/Excel files

Embed data directly in the HTML as a JavaScript array:
```javascript
const RAW_DATA = [
  { date: "2026-01-01", channel: "Google", installs: 1200, spend: 3400, revenue: 5100 },
  { date: "2026-01-02", channel: "Google", installs: 1350, spend: 3200, revenue: 4800 },
  // ...
];
```

### Step 3: Design Layout

Follow this standard layout order:
1. **Header** - Title, subtitle, last-updated timestamp
2. **Filter bar** - Date range, dropdowns for dimensions
3. **KPI cards row** - 3-6 key metrics with change indicators
4. **Charts row** - 2-3 charts (trends, distributions, comparisons)
5. **Detail table** - Sortable data table with all records

### Step 4: Build the HTML File

Generate a single self-contained HTML file with:
- All CSS in `<style>` tags
- All JavaScript in `<script>` tags
- Chart.js loaded from CDN
- Data embedded as JS constants
- Responsive layout that works on desktop and mobile

### Step 5: Save and Open

Save the file and open it in the default browser:
```bash
# Windows
start dashboard.html

# macOS
open dashboard.html

# Linux
xdg-open dashboard.html
```

---

## Base HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Title</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <style>
    /* CSS variables and styles - see references/css-themes.md */
  </style>
</head>
<body>
  <div class="dashboard">
    <header class="dashboard-header">
      <div>
        <h1>Dashboard Title</h1>
        <p class="subtitle">Description or date range</p>
      </div>
      <span class="updated">Updated: <span id="lastUpdated"></span></span>
    </header>

    <div class="filter-bar" id="filterBar">
      <!-- Filters go here -->
    </div>

    <div class="kpi-row" id="kpiRow">
      <!-- KPI cards go here -->
    </div>

    <div class="chart-row">
      <!-- Chart containers go here -->
    </div>

    <div class="table-container">
      <!-- Data table goes here -->
    </div>
  </div>

  <script>
    // Embedded data and Dashboard class
  </script>
</body>
</html>
```

---

## Dashboard Class Pattern

The core JavaScript pattern for managing state, filters, and rendering:

```javascript
class Dashboard {
  constructor(rawData) {
    this.rawData = rawData;
    this.filteredData = [...rawData];
    this.charts = {};
    this.init();
  }

  init() {
    this.renderFilters();
    this.applyFilters();
    document.getElementById('lastUpdated').textContent =
      new Date().toLocaleString('zh-CN');
  }

  applyFilters() {
    // Get filter values
    const channel = document.getElementById('filterChannel')?.value || 'all';
    const dateFrom = document.getElementById('filterDateFrom')?.value || '';
    const dateTo = document.getElementById('filterDateTo')?.value || '';

    // Filter data
    this.filteredData = this.rawData.filter(row => {
      if (channel !== 'all' && row.channel !== channel) return false;
      if (dateFrom && row.date < dateFrom) return false;
      if (dateTo && row.date > dateTo) return false;
      return true;
    });

    // Re-render all components
    this.renderKPIs();
    this.renderCharts();
    this.renderTable();
  }

  renderFilters() {
    const channels = [...new Set(this.rawData.map(r => r.channel))].sort();
    const dates = this.rawData.map(r => r.date).sort();

    document.getElementById('filterBar').innerHTML = `
      <div class="filter-group">
        <label>Channel</label>
        <select id="filterChannel" onchange="dashboard.applyFilters()">
          <option value="all">All Channels</option>
          ${channels.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label>From</label>
        <input type="date" id="filterDateFrom" value="${dates[0] || ''}"
               onchange="dashboard.applyFilters()">
      </div>
      <div class="filter-group">
        <label>To</label>
        <input type="date" id="filterDateTo" value="${dates[dates.length-1] || ''}"
               onchange="dashboard.applyFilters()">
      </div>
    `;
  }

  renderKPIs() { /* see KPI Card Pattern below */ }
  renderCharts() { /* see Chart Patterns below */ }
  renderTable() { /* see Table Pattern below */ }
}

// Initialize
const dashboard = new Dashboard(RAW_DATA);
```

---

## KPI Card Pattern

### HTML Structure
```html
<div class="kpi-row" id="kpiRow"></div>
```

### JavaScript Rendering
```javascript
renderKPIs() {
  const data = this.filteredData;

  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0);
  const totalSpend = data.reduce((s, r) => s + r.spend, 0);
  const totalInstalls = data.reduce((s, r) => s + r.installs, 0);
  const avgCPI = totalInstalls > 0 ? totalSpend / totalInstalls : 0;
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const kpis = [
    { label: 'Total Revenue', value: `$${this.formatNumber(totalRevenue)}`, change: '+12.3%', positive: true },
    { label: 'Total Installs', value: this.formatNumber(totalInstalls), change: '+8.7%', positive: true },
    { label: 'Avg CPI', value: `$${avgCPI.toFixed(2)}`, change: '-3.2%', positive: true },
    { label: 'ROAS', value: `${roas.toFixed(2)}x`, change: '+0.15x', positive: true },
  ];

  document.getElementById('kpiRow').innerHTML = kpis.map(kpi => `
    <div class="kpi-card">
      <div class="kpi-label">${kpi.label}</div>
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-change ${kpi.positive ? 'positive' : 'negative'}">
        ${kpi.positive ? '&#9650;' : '&#9660;'} ${kpi.change}
      </div>
    </div>
  `).join('');
}

formatNumber(num) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}
```

---

## Chart Patterns (Concise)

For full Chart.js code patterns, see `references/chart-patterns.md`.

### Line Chart (Trend)
```javascript
renderLineChart() {
  const grouped = this.groupByDate(this.filteredData);
  const labels = Object.keys(grouped).sort();
  const values = labels.map(d => grouped[d].reduce((s, r) => s + r.revenue, 0));

  if (this.charts.line) this.charts.line.destroy();
  this.charts.line = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Revenue',
        data: values,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString() } }
      }
    }
  });
}
```

### Bar Chart (Comparison)
```javascript
renderBarChart() {
  const grouped = this.groupByChannel(this.filteredData);
  const labels = Object.keys(grouped);
  const values = labels.map(ch => grouped[ch].reduce((s, r) => s + r.installs, 0));

  if (this.charts.bar) this.charts.bar.destroy();
  this.charts.bar = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Installs',
        data: values,
        backgroundColor: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}
```

### Doughnut Chart (Distribution)
```javascript
renderDoughnutChart() {
  const grouped = this.groupByChannel(this.filteredData);
  const labels = Object.keys(grouped);
  const values = labels.map(ch => grouped[ch].reduce((s, r) => s + r.spend, 0));

  if (this.charts.doughnut) this.charts.doughnut.destroy();
  this.charts.doughnut = new Chart(document.getElementById('doughnutChart'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return `${ctx.label}: $${ctx.raw.toLocaleString()} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}
```

---

## Filter Implementation

### Combined Filter Logic
```javascript
applyFilters() {
  const filters = {
    channel: document.getElementById('filterChannel')?.value || 'all',
    platform: document.getElementById('filterPlatform')?.value || 'all',
    dateFrom: document.getElementById('filterDateFrom')?.value || '',
    dateTo: document.getElementById('filterDateTo')?.value || '',
  };

  this.filteredData = this.rawData.filter(row => {
    if (filters.channel !== 'all' && row.channel !== filters.channel) return false;
    if (filters.platform !== 'all' && row.platform !== filters.platform) return false;
    if (filters.dateFrom && row.date < filters.dateFrom) return false;
    if (filters.dateTo && row.date > filters.dateTo) return false;
    return true;
  });

  this.renderKPIs();
  this.renderCharts();
  this.renderTable();
}
```

### Dropdown Filter Rendering
```javascript
renderDropdownFilter(containerId, filterId, label, dataKey) {
  const values = [...new Set(this.rawData.map(r => r[dataKey]))].sort();
  document.getElementById(containerId).innerHTML = `
    <div class="filter-group">
      <label>${label}</label>
      <select id="${filterId}" onchange="dashboard.applyFilters()">
        <option value="all">All</option>
        ${values.map(v => `<option value="${v}">${v}</option>`).join('')}
      </select>
    </div>
  `;
}
```

---

## Sortable Table Pattern

```javascript
renderTable() {
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'channel', label: 'Channel' },
    { key: 'installs', label: 'Installs', format: 'number' },
    { key: 'spend', label: 'Spend', format: 'currency' },
    { key: 'revenue', label: 'Revenue', format: 'currency' },
    { key: 'cpi', label: 'CPI', format: 'currency', compute: r => r.installs > 0 ? r.spend / r.installs : 0 },
  ];

  const sortKey = this.sortKey || 'date';
  const sortDir = this.sortDir || 'desc';
  const sorted = [...this.filteredData].sort((a, b) => {
    const aVal = columns.find(c => c.key === sortKey)?.compute?.(a) ?? a[sortKey];
    const bVal = columns.find(c => c.key === sortKey)?.compute?.(b) ?? b[sortKey];
    return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const formatVal = (val, fmt) => {
    if (fmt === 'currency') return '$' + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (fmt === 'number') return val.toLocaleString();
    return val;
  };

  document.getElementById('dataTable').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          ${columns.map(col => `
            <th onclick="dashboard.sortBy('${col.key}')" class="sortable">
              ${col.label} ${sortKey === col.key ? (sortDir === 'asc' ? '&#9650;' : '&#9660;') : ''}
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        ${sorted.map(row => `
          <tr>
            ${columns.map(col => {
              const val = col.compute ? col.compute(row) : row[col.key];
              return `<td>${formatVal(val, col.format)}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

sortBy(key) {
  if (this.sortKey === key) {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortKey = key;
    this.sortDir = 'desc';
  }
  this.renderTable();
}
```

---

## Utility Methods

```javascript
groupByDate(data) {
  return data.reduce((acc, row) => {
    (acc[row.date] = acc[row.date] || []).push(row);
    return acc;
  }, {});
}

groupByChannel(data) {
  return data.reduce((acc, row) => {
    (acc[row.channel] = acc[row.channel] || []).push(row);
    return acc;
  }, {});
}

groupBy(data, key) {
  return data.reduce((acc, row) => {
    (acc[row[key]] = acc[row[key]] || []).push(row);
    return acc;
  }, {});
}
```

---

## Performance Guidelines

### Large Datasets (1000+ rows)
- **Aggregate before charting**: Don't plot 10,000 individual points. Group by date/week/month.
- **Paginate tables**: Show 50-100 rows per page with navigation.
- **Debounce filters**: Use `setTimeout` to avoid re-rendering on every keystroke.
- **Destroy charts before recreating**: Always call `chart.destroy()` before `new Chart()`.

### Pagination Helper
```javascript
renderPaginatedTable(page = 1, pageSize = 50) {
  const totalPages = Math.ceil(this.filteredData.length / pageSize);
  const pageData = this.filteredData.slice((page - 1) * pageSize, page * pageSize);
  this.currentPage = page;
  // Render table with pageData instead of full filteredData
  // Add pagination controls at bottom
}
```

### Debounce Helper
```javascript
debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

---

## Game Industry Dashboard Examples

### Example 1: UA Performance Dashboard

**Purpose**: Track user acquisition efficiency across channels and creatives.

**KPIs**: Total Spend, Total Installs, Avg CPI, D7 ROAS, Active Campaigns

**Charts**:
- Line chart: Daily install volume by channel (stacked)
- Bar chart: CPI comparison by channel
- Doughnut: Spend distribution by channel

**Filters**: Date range, Channel, Platform (iOS/Android), Country

**Data structure**:
```javascript
const RAW_DATA = [
  {
    date: "2026-01-15", channel: "Google", platform: "Android", country: "US",
    installs: 1200, spend: 3400, revenue_d7: 4200, impressions: 85000,
    clicks: 4200, campaign: "winter_sale_v2"
  },
  // ...
];
```

**Key computed metrics**:
- CPI = spend / installs
- CTR = clicks / impressions
- CVR = installs / clicks
- D7 ROAS = revenue_d7 / spend

**Tip**: Use the `datain-query` skill to pull UA data from your analytics database, then pipe it into this dashboard builder.

---

### Example 2: Retention & Engagement Dashboard

**Purpose**: Monitor player retention curves and engagement health.

**KPIs**: DAU, D1 Retention, D7 Retention, D30 Retention, Avg Session Length, Stickiness (DAU/MAU)

**Charts**:
- Line chart: Retention curves (D1, D3, D7, D14, D30, D60, D90) by cohort
- Line chart: DAU trend over time
- Bar chart: Avg sessions per day by platform
- Doughnut: DAU distribution by player segment

**Filters**: Date range, Cohort week, Platform, Country

**Data structure**:
```javascript
const COHORT_DATA = [
  {
    cohort_date: "2026-01-06", platform: "iOS", country: "US",
    cohort_size: 5000,
    d1: 0.42, d3: 0.28, d7: 0.18, d14: 0.12, d30: 0.08, d60: 0.05, d90: 0.03
  },
  // ...
];

const DAILY_DATA = [
  {
    date: "2026-01-15", platform: "iOS",
    dau: 125000, wau: 310000, mau: 580000,
    avg_sessions: 3.2, avg_session_length: 840, // seconds
    new_users: 4200, returning_users: 120800
  },
  // ...
];
```

**Key computed metrics**:
- Stickiness = DAU / MAU
- Avg Session Length (formatted as mm:ss)
- Retention rate = retained_users / cohort_size

---

### Example 3: Revenue Dashboard

**Purpose**: Track monetization performance and revenue trends.

**KPIs**: Daily Revenue, ARPU, ARPPU, Paying Conversion Rate, LTV D30

**Charts**:
- Line chart: Daily revenue trend (with 7-day moving average)
- Line chart: ARPU and ARPPU trend (dual axis)
- Bar chart: Revenue by source (IAP, Ads, Subscription)
- Doughnut: Revenue distribution by product/SKU

**Filters**: Date range, Platform, Country, Revenue source

**Data structure**:
```javascript
const REVENUE_DATA = [
  {
    date: "2026-01-15", platform: "iOS", country: "US",
    dau: 125000, paying_users: 3750,
    revenue_iap: 18500, revenue_ads: 4200, revenue_sub: 2800,
    transactions: 5100, avg_transaction: 5.02
  },
  // ...
];

const LTV_DATA = [
  {
    cohort_date: "2025-12-01", platform: "iOS",
    cohort_size: 8000, paying_users: 320,
    ltv_d1: 0.12, ltv_d7: 0.85, ltv_d14: 1.42, ltv_d30: 2.15, ltv_d60: 3.10
  },
  // ...
];
```

**Key computed metrics**:
- Total Revenue = revenue_iap + revenue_ads + revenue_sub
- ARPU = total_revenue / DAU
- ARPPU = total_revenue / paying_users
- Paying Conversion = paying_users / DAU
- 7-day Moving Average for trend smoothing
