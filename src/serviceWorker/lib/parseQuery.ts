export const parseQuery = (query: string) => {
  query = query.trim();
  const separatorIndex = query.indexOf(":");
  const filter = query.substring(0, separatorIndex);
  const pattern = query.substring(separatorIndex + 1);
  return { filter, pattern };
};
