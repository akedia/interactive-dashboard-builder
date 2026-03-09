/**
 * Dashboard Class Pattern
 *
 * Core JavaScript pattern for managing state, filters, and rendering.
 * Copy this into the <script> tag of the base-dashboard.html template,
 * after your RAW_DATA constant.
 */

class Dashboard {
  constructor(rawData) {
    this.rawData = rawData;
    this.filteredData = [...rawData];
    this.charts = {};
    this.sortKey = 'date';
    this.sortDir = 'desc';
    this.init();
  }

  init() {
    this.renderFilters();
    this.applyFilters();
    document.getElementById('lastUpdated').textContent =
      new Date().toLocaleString('zh-CN');
  }

  // ── Filters ──────────────────────────────────────────────

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

  // ── KPI Cards ────────────────────────────────────────────

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

  // ── Charts ───────────────────────────────────────────────
  // See references/chart-patterns.md for full Chart.js patterns.

  renderCharts() {
    this.renderLineChart();
    this.renderBarChart();
    this.renderDoughnutChart();
  }

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

  // ── Sortable Table ───────────────────────────────────────

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

  // ── Utility Methods ──────────────────────────────────────

  formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  }

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

  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}

// ── Export Functions ──────────────────────────────────────

function exportCSV(data, columns, filename) {
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.field];
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename || 'export.csv';
  a.click(); URL.revokeObjectURL(url);
}

function exportChartPNG(chartInstance, filename) {
  const url = chartInstance.toBase64Image('image/png', 1);
  const a = document.createElement('a');
  a.href = url; a.download = filename || 'chart.png';
  a.click();
}

// ── Paginated Table (for 100+ rows) ─────────────────────

class PaginatedTable {
  constructor(containerId, data, columns, pageSize = 50) {
    this.containerId = containerId;
    this.data = data;
    this.columns = columns;
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.totalPages = Math.ceil(data.length / pageSize);
    this.renderPage();
  }

  setData(newData) {
    this.data = newData;
    this.currentPage = 1;
    this.totalPages = Math.ceil(newData.length / this.pageSize);
    this.renderPage();
  }

  renderPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, this.data.length);
    const pageData = this.data.slice(start, end);

    const formatVal = (val, fmt) => {
      if (fmt === 'currency') return '$' + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (fmt === 'number') return val.toLocaleString();
      if (fmt === 'percent') return (val * 100).toFixed(1) + '%';
      return val;
    };

    const tableHTML = `
      <table class="data-table">
        <thead>
          <tr>
            ${this.columns.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${pageData.map(row => `
            <tr>
              ${this.columns.map(col => {
                const val = col.compute ? col.compute(row) : row[col.field];
                return `<td>${formatVal(val, col.format)}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.getElementById(this.containerId).innerHTML = tableHTML + this.renderPagination(start, end);
  }

  renderPagination(start, end) {
    return `
      <div class="pagination">
        <button class="pagination-btn" onclick="paginatedTable.goToPage(${this.currentPage - 1})"
                ${this.currentPage <= 1 ? 'disabled' : ''}>
          &#8592; Prev
        </button>
        <span class="pagination-info">
          Showing ${(start + 1).toLocaleString()}-${end.toLocaleString()} of ${this.data.length.toLocaleString()}
        </span>
        <button class="pagination-btn" onclick="paginatedTable.goToPage(${this.currentPage + 1})"
                ${this.currentPage >= this.totalPages ? 'disabled' : ''}>
          Next &#8594;
        </button>
      </div>
    `;
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.renderPage();
  }
}

// ── Initialize ───────────────────────────────────────────
// const dashboard = new Dashboard(RAW_DATA);
