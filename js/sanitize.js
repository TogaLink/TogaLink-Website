// sanitize Firebase fields against possible XSS attacks
const sanitize = (strings, ...values) => {
  const dirty = strings.reduce((prev, next, i) => `${prev}${next}${values[i]} || ''}`, '');
  return DomPurify.sanitize(dirty);
}
