// textFormatting.ts
export const FORMAT_MARKERS = {
  bold: { start: "**", end: "**" },
  italic: { start: "_", end: "_" },
  strikethrough: { start: "~~", end: "~~" },
  monospace: { start: "`", end: "`" },
} as const;

export   const insertFormatting = (
    format: keyof typeof FORMAT_MARKERS,
    messageBody: string,
    setMessageBody: (value: string) => void
  ) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // If there's no text selected, preserve cursor position
    if (start === end) {
      const marker = FORMAT_MARKERS[format];
      const newText =
        messageBody.slice(0, start) +
        marker.start +
        marker.end +
        messageBody.slice(end);

      setMessageBody(newText);

      // Set cursor position between markers
      setTimeout(() => {
        textarea.selectionStart = start + marker.start.length;
        textarea.selectionEnd = start + marker.start.length;
        textarea.focus();
      }, 0);
      return;
    }

    const selectedText = messageBody.substring(start, end);
    const marker = FORMAT_MARKERS[format];

    // Check if selection already has this formatting
    const hasFormatting =
      selectedText.startsWith(marker.start) &&
      selectedText.endsWith(marker.end);

    let newText;
    if (hasFormatting) {
      // Remove formatting
      newText =
        messageBody.slice(0, start) +
        selectedText.slice(marker.start.length, -marker.end.length) +
        messageBody.slice(end);
    } else {
      // Add formatting
      newText =
        messageBody.slice(0, start) +
        marker.start +
        selectedText +
        marker.end +
        messageBody.slice(end);
    }

    setMessageBody(newText);

    // Preserve selection
    setTimeout(() => {
      const newSelectionStart = start;
      const newSelectionEnd = hasFormatting
        ? end - (marker.start.length + marker.end.length)
        : end + (marker.start.length + marker.end.length);

      textarea.selectionStart = newSelectionStart;
      textarea.selectionEnd = newSelectionEnd;
      textarea.focus();
    }, 0);
  };

  // Convert Markdown to HTML for preview
  