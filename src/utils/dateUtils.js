// Tarih yardımcı fonksiyonları
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getMonthName = (monthIndex, t) => {
  const monthKeys = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  return t ? t(monthKeys[monthIndex]) : monthKeys[monthIndex];
};

export const getMonthYear = (date, t) => {
  const d = new Date(date);
  return `${getMonthName(d.getMonth(), t)} ${d.getFullYear()}`;
};

export const isSameMonth = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

export const getDaysInMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

export const getStartOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const getEndOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
};
