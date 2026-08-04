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
  if (!range || range === 'All' || !Array.isArray(items)) return items;
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (range === 'Today') {
    return items.filter((item) => String(item?.invoiceDate || item?.date || '').slice(0, 10) === todayStr);
  }
  if (range === 'Yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().slice(0, 10);
    return items.filter((item) => String(item?.invoiceDate || item?.date || '').slice(0, 10) === yestStr);
  }
  if (range === 'This Week') {
    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay());
    const firstStr = first.toISOString().slice(0, 10);
    return items.filter((item) => String(item?.invoiceDate || item?.date || '').slice(0, 10) >= firstStr);
  }
  if (range === 'This Month') {
    const monthStr = todayStr.slice(0, 7);
    return items.filter((item) => String(item?.invoiceDate || item?.date || '').slice(0, 7) === monthStr);
  }
  if (range === 'This Year') {
    const yearStr = todayStr.slice(0, 4);
    return items.filter((item) => String(item?.invoiceDate || item?.date || '').slice(0, 4) === yearStr);
  }
  return items;
};
