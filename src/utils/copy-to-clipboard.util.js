export const copyToClipboard = async (text) => {
  if (!text) {
    return false;
  }

  try {
    // Используем современный Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback для старых браузеров
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  } catch (error) {
    console.error("Ошибка копирования в буфер обмена:", error);
    return false;
  }
};
