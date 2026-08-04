export const formatCurrency = (value) => {
  if (Number.isNaN(Number(value))) return 'Rs 0';
  return `Rs ${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const formatCount = (value) => Number(value).toLocaleString('en-IN');

export const buildTrendText = (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const sortByKey = (data, key, direction = 'desc') => {
  return [...data].sort((a, b) => {
    const left = a[key] ?? '';
    const right = b[key] ?? '';
    if (typeof left === 'string') {
      return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    }
    return direction === 'asc' ? left - right : right - left;
  });
};

export const getMonthLabel = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const getRecentDateLabel = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const filterByDateRange = (items, range) => {
  if (!range || range === 'All') return items;
  const now = new Date();
  const start = new Date();
  if (range === 'Today') {
    return items.filter((item) => item.invoiceDate === now.toISOString().slice(0, 10));
  }
  if (range === 'Yesterday') {
    start.setDate(now.getDate() - 1);
    return items.filter((item) => item.invoiceDate === start.toISOString().slice(0, 10));
  }
  if (range === 'This Week') {
    const first = new Date(now.setDate(now.getDate() - now.getDay()));
    return items.filter((item) => new Date(item.invoiceDate) >= first);
  }
  if (range === 'This Month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return items.filter((item) => new Date(item.invoiceDate) >= first);
  }
  if (range === 'This Year') {
    const first = new Date(now.getFullYear(), 0, 1);
    return items.filter((item) => new Date(item.invoiceDate) >= first);
  }
  return items;
};
