# Dashboard CSS Themes Reference

Complete CSS system for self-contained HTML dashboards.

## CSS Variable System

```css
:root {
  /* Colors */
  --color-primary: #4F46E5;
  --color-primary-light: #EEF2FF;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #06B6D4;

  /* Text */
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;

  /* Backgrounds */
  --bg-page: #F3F4F6;
  --bg-card: #FFFFFF;
  --bg-hover: #F9FAFB;

  /* Borders */
  --border-color: #E5E7EB;
  --border-radius: 8px;
  --border-radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
}
```

---

## Reset & Base

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-page);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

---

## Layout: Dashboard Container

```css
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}
```

---

## Layout: Header

```css
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.dashboard-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard-header .subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.dashboard-header .updated {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
}
```

---

## Layout: KPI Row

```css
.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

---

## Component: KPI Cards

```css
.kpi-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: box-shadow 0.2s, transform 0.2s;
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.kpi-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.kpi-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: var(--spacing-sm) 0;
  line-height: 1.2;
}

.kpi-change {
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.kpi-change.positive {
  color: var(--color-success);
}

.kpi-change.negative {
  color: var(--color-danger);
}

.kpi-change.neutral {
  color: var(--text-muted);
}
```

---

## Layout: Chart Row

```css
.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

/* For 2/3 + 1/3 split layouts */
.chart-row.split {
  grid-template-columns: 2fr 1fr;
}

/* For full-width chart */
.chart-row.full {
  grid-template-columns: 1fr;
}
```

---

## Component: Chart Containers

```css
.chart-container {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.chart-container h3 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.chart-container .chart-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: -8px;
  margin-bottom: var(--spacing-md);
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

/* Taller chart variant */
.chart-wrapper.tall {
  height: 400px;
}

/* Shorter chart variant */
.chart-wrapper.compact {
  height: 220px;
}
```

---

## Component: Filter Bar

```css
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-end;
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-group select,
.filter-group input[type="date"],
.filter-group input[type="text"] {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: var(--font-size-sm);
  font-family: var(--font-family);
  color: var(--text-primary);
  background: var(--bg-card);
  min-width: 140px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.filter-group select:hover,
.filter-group input:hover {
  border-color: #D1D5DB;
}

/* Reset button */
.filter-reset {
  padding: 6px 16px;
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s;
}

.filter-reset:hover {
  background: var(--border-color);
}
```

---

## Component: Data Tables

```css
.table-container {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow-x: auto;
}

.table-container h3 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.data-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table th {
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-page);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
  user-select: none;
}

.data-table th.sortable {
  cursor: pointer;
}

.data-table th.sortable:hover {
  color: var(--color-primary);
}

.data-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.data-table tbody tr:hover {
  background: var(--bg-hover);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* Numeric columns right-aligned */
.data-table td.num,
.data-table th.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Status badges in tables */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.good { background: #D1FAE5; color: #065F46; }
.status-badge.warn { background: #FEF3C7; color: #92400E; }
.status-badge.bad  { background: #FEE2E2; color: #991B1B; }
```

---

## Pagination

```css
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.pagination button {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--color-primary);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination button.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.pagination .page-info {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
```

---

## Responsive Breakpoints

```css
/* Tablet (768px and below) */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .dashboard-header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    grid-template-columns: 1fr;
  }

  .chart-row.split {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group select,
  .filter-group input {
    width: 100%;
  }
}

/* Mobile (480px and below) */
@media (max-width: 480px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }

  .kpi-value {
    font-size: var(--font-size-2xl);
  }

  .chart-wrapper {
    height: 250px;
  }

  .data-table {
    font-size: 0.75rem;
  }

  .data-table th,
  .data-table td {
    padding: 8px 6px;
  }
}
```

---

## Print Styles

```css
@media print {
  body {
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .dashboard {
    max-width: none;
    padding: 0;
  }

  .filter-bar {
    display: none;
  }

  .kpi-card,
  .chart-container,
  .table-container {
    box-shadow: none;
    border: 1px solid #ddd;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .chart-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-wrapper {
    height: 250px;
  }

  /* Force background colors in print */
  .kpi-change.positive { color: #059669 !important; }
  .kpi-change.negative { color: #DC2626 !important; }
  .status-badge.good { background: #D1FAE5 !important; }
  .status-badge.warn { background: #FEF3C7 !important; }
  .status-badge.bad  { background: #FEE2E2 !important; }
}
```

---

## Dark Mode

Apply dark mode via class on `<html>` or via `prefers-color-scheme`:

```css
/* Option A: System preference */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #818CF8;
    --color-primary-light: #312E81;
    --color-success: #34D399;
    --color-warning: #FBBF24;
    --color-danger: #F87171;
    --color-info: #22D3EE;

    --text-primary: #F9FAFB;
    --text-secondary: #D1D5DB;
    --text-muted: #9CA3AF;

    --bg-page: #111827;
    --bg-card: #1F2937;
    --bg-hover: #374151;

    --border-color: #374151;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  }
}

/* Option B: Manual toggle via class */
html.dark {
  --color-primary: #818CF8;
  --color-primary-light: #312E81;
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-danger: #F87171;
  --color-info: #22D3EE;

  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --text-muted: #9CA3AF;

  --bg-page: #111827;
  --bg-card: #1F2937;
  --bg-hover: #374151;

  --border-color: #374151;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
}
```

### Dark Mode Toggle Button
```html
<button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">
  <span id="themeIcon">&#9789;</span>
</button>
```

```css
.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 1000;
}

.theme-toggle:hover {
  transform: scale(1.1);
}
```

```javascript
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const icon = document.getElementById('themeIcon');
  icon.textContent = document.documentElement.classList.contains('dark') ? '\u2600' : '\u263D';
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// Restore saved preference
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
  document.getElementById('themeIcon').textContent = '\u2600';
}
```

---

## Loading State

```css
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-lg);
  z-index: 10;
}

html.dark .loading-overlay {
  background: rgba(31, 41, 55, 0.8);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Empty State

```css
.empty-state {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  color: var(--text-muted);
}

.empty-state .icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state .message {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.empty-state .hint {
  font-size: var(--font-size-sm);
}
```

---

## Component: Export Buttons

Style export buttons for CSV/PNG downloads. Place them in the filter bar or table header.

```css
.export-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-left: auto;
  align-items: center;
}

.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.export-btn:hover {
  background: var(--bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.export-btn:active {
  transform: scale(0.97);
}
```

### HTML Usage
```html
<!-- Inside filter-bar or table-container header -->
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

## Complete Minimal Stylesheet

Copy this as a starting point for any dashboard:

```css
:root {
  --color-primary: #4F46E5; --color-primary-light: #EEF2FF;
  --color-success: #10B981; --color-warning: #F59E0B; --color-danger: #EF4444;
  --text-primary: #1F2937; --text-secondary: #6B7280; --text-muted: #9CA3AF;
  --bg-page: #F3F4F6; --bg-card: #FFFFFF; --bg-hover: #F9FAFB;
  --border-color: #E5E7EB; --border-radius: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-family); background: var(--bg-page); color: var(--text-primary); line-height: 1.5; }
.dashboard { max-width: 1400px; margin: 0 auto; padding: 24px; }
.dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
.dashboard-header h1 { font-size: 1.5rem; font-weight: 700; }
.dashboard-header .subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; }
.dashboard-header .updated { font-size: 0.875rem; color: var(--text-muted); }
.filter-bar { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; background: var(--bg-card); border-radius: 12px; padding: 16px 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); }
.filter-group { display: flex; flex-direction: column; gap: 4px; }
.filter-group label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }
.filter-group select, .filter-group input { padding: 6px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.875rem; }
.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.kpi-card { background: var(--bg-card); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); }
.kpi-label { font-size: 0.875rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
.kpi-value { font-size: 1.875rem; font-weight: 700; margin: 8px 0; }
.kpi-change { font-size: 0.875rem; font-weight: 600; }
.kpi-change.positive { color: var(--color-success); }
.kpi-change.negative { color: var(--color-danger); }
.chart-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; margin-bottom: 24px; }
.chart-container { background: var(--bg-card); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); }
.chart-container h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
.chart-wrapper { position: relative; height: 300px; }
.table-container { background: var(--bg-card); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow-x: auto; }
.table-container h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table th { text-align: left; padding: 10px 12px; font-weight: 600; color: var(--text-secondary); background: var(--bg-page); border-bottom: 2px solid var(--border-color); cursor: pointer; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); }
.data-table tbody tr:hover { background: var(--bg-hover); }
@media (max-width: 768px) {
  .dashboard { padding: 16px; }
  .dashboard-header { flex-direction: column; }
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .chart-row, .chart-row.split { grid-template-columns: 1fr; }
  .filter-bar { flex-direction: column; }
}
@media (max-width: 480px) {
  .kpi-row { grid-template-columns: 1fr; }
  .chart-wrapper { height: 250px; }
}
@media print {
  .filter-bar { display: none; }
  .kpi-card, .chart-container, .table-container { box-shadow: none; break-inside: avoid; }
}
```
