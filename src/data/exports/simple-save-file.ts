/**
 * For testing purposes. Should probably use Electron's file save
 * dialog for the real thing.
 * @param data
 * @param path
 */
export const simpleSaveFile = async (data: string, path: string) => {
  const link = document.createElement('a');
  link.download = path;
  link.href = URL.createObjectURL(
    new Blob([data], { type: 'application/json' })
  );

  link.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(link.href), 30 * 1000);
  });
  link.click();
};
