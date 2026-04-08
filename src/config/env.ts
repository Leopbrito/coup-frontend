export const IS_TEST_MODE = (() => {
  // Safe extraction for SSR
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  
  return (
    import.meta.env.VITE_TEST_MODE === 'true' ||
    urlParams.get('test') === 'true' ||
    localStorage.getItem('COUP_TEST_MODE') === 'true'
  );
})();
