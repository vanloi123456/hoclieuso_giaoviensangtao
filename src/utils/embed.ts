/**
 * Smart URL and embed code parser for interactive educational content
 */

export interface EmbedValidationResult {
  isValid: boolean;
  type: 'iframe' | 'html' | 'url' | 'youtube' | 'invalid';
  srcDoc?: string;
  srcUrl?: string;
  errorMessage?: string;
}

export function parseYouTubeUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Match youtube formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
  }

  return null;
}

export function validateAndFormatEmbed(input: string): EmbedValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      type: 'invalid',
      errorMessage: 'Vui lòng dán mã nhúng iframe, mã HTML trò chơi hoặc đường dẫn URL.',
    };
  }

  const raw = input.trim();

  // Check if it's a direct YouTube URL
  const youtubeEmbed = parseYouTubeUrl(raw);
  if (youtubeEmbed) {
    return {
      isValid: true,
      type: 'youtube',
      srcUrl: youtubeEmbed,
    };
  }

  // Check if it's an iframe tag
  const iframeMatch = raw.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (iframeMatch) {
    // Has a valid src
    return {
      isValid: true,
      type: 'iframe',
      srcDoc: raw,
      srcUrl: iframeMatch[1],
    };
  }

  // Check if it's general HTML (e.g., game written in HTML/CSS/JS exported by Gemini or AI Studio)
  if (
    raw.includes('<html') ||
    raw.includes('<div') ||
    raw.includes('<canvas') ||
    raw.includes('<script') ||
    raw.includes('<style') ||
    raw.includes('<!DOCTYPE')
  ) {
    // Complete or partial HTML game
    return {
      isValid: true,
      type: 'html',
      srcDoc: raw,
    };
  }

  // Check if it's a valid http/https URL
  try {
    const urlObj = new URL(raw);
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return {
        isValid: true,
        type: 'url',
        srcUrl: raw,
      };
    }
  } catch {
    // not a pure URL
  }

  return {
    isValid: false,
    type: 'invalid',
    errorMessage: 'Mã nhúng không đúng định dạng. Bạn có thể dán mã thẻ <iframe>, toàn bộ mã HTML trò chơi hoặc liên kết URL hợp lệ.',
  };
}

/**
 * Wraps raw HTML or embed code into a self-contained responsive sandbox document
 */
export function generateSandboxHtml(code: string): string {
  // If it's already a full HTML document, return as is
  if (code.toLowerCase().includes('<!doctype') || code.toLowerCase().includes('<html')) {
    return code;
  }

  // If it's an iframe, center it and ensure responsive 100% width and height
  if (code.toLowerCase().includes('<iframe')) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; }
    iframe { width: 100% !important; height: 100% !important; border: none !important; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  }

  // Otherwise, wrap in standard container
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; font-family: system-ui, -apple-system, sans-serif; background: #ffffff; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
}
