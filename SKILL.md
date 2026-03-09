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

Data sources: direct paste (CSV/JSON), query results (from `datain-query` skill), sample data for prototyping, or local file read.

Embed data directly in the HTML as a JavaScript array:
```javascript
const RAW_DATA = [
  { date: "2026-01-01", channel: "Google", installs: 1200, spend: 3400, revenue: 5100 },
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

Use template: `assets/templates/base-dashboard.html`

Generate a single self-contained HTML file with all CSS in `<style>` tags, all JavaScript in `<script>` tags, Chart.js loaded from CDN, and data embedded as JS constants.

Use class pattern: `assets/templates/dashboard-class.js`

The Dashboard class handles state management, filter logic, KPI rendering, chart creation/destruction, sortable tables, and utility methods. Copy it into the template's `<script>` tag after your `RAW_DATA` constant.

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

## Key Patterns Reference

### CSS Themes & Styles

See `references/css-themes.md` for the complete CSS system including:
- CSS variable system (colors, spacing, typography)
- Component styles (KPI cards, filter bar, charts, tables)
- Responsive breakpoints, print styles, dark mode

### Chart.js Patterns

See `references/chart-patterns.md` for copy-pasteable Chart.js code:
- Line chart (trend/time series, dual axis)
- Bar chart (grouped, horizontal, stacked)
- Doughnut/pie chart (with center text plugin)
- Mixed chart (bar + line)
- Chart update/destroy pattern
- Tooltip customization, axis formatting
- Color palette and CDN links

### Dashboard Class & Components

See `assets/templates/dashboard-class.js` for the full implementation:
- `Dashboard` class with filter, KPI, chart, and table rendering
- `exportCSV()` and `exportChartPNG()` for data/chart export
- `PaginatedTable` class for tables with 100+ rows
- Utility methods: `groupBy`, `formatNumber`, `debounce`

### Export Buttons (HTML)

Add to filter bar or table header:
```html
<div class="export-group">
  <button class="export-btn" onclick="exportCSV(dashboard.filteredData, columns, 'report.csv')">
    &#128190; Export CSV
  </button>
  <button class="export-btn" onclick="exportChartPNG(dashboard.charts.line, 'trend.png')">
    &#128247; Export Chart
  </button>
</div>
```

---

## Performance Guidelines

For large datasets (1000+ rows):
- **Aggregate before charting**: Group by date/week/month instead of plotting individual points
- **Paginate tables**: Use the `PaginatedTable` class (50-100 rows per page)
- **Debounce filters**: Use the `debounce()` utility to avoid re-rendering on every keystroke
- **Destroy charts before recreating**: Always call `chart.destroy()` before `new Chart()`

---

## Game Industry Dashboard Examples

See `references/chart-patterns.md` (Game Industry Dashboard Examples section) for three complete examples:

1. **UA Performance Dashboard** - Track user acquisition across channels (CPI, CTR, CVR, D7 ROAS)
2. **Retention & Engagement Dashboard** - Monitor retention curves and engagement (DAU, stickiness, session length)
3. **Revenue Dashboard** - Track monetization (ARPU, ARPPU, paying conversion, LTV)

Each example includes: purpose, KPIs, chart recommendations, filter dimensions, data structure, and computed metrics.

**Tip**: Use the `datain-query` skill to pull data from your analytics database, then pipe it into this dashboard builder.
