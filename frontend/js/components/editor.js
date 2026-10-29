/**
 * CodeRoyale — Monaco Code Editor Wrapper
 * Integrates Monaco Editor with custom cyberpunk theme and fallback resilient textarea.
 */

export class CodeEditorManager {
  constructor(containerId = 'monaco-editor-container') {
    this.containerId = containerId;
    this.editorInstance = null;
    this.currentLanguage = 'java';
    this.fallbackElement = null;
    this.isMonacoReady = false;
  }

  async init(initialCode = '', initialLanguage = 'java') {
    this.currentLanguage = initialLanguage;
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Check if Monaco is already loaded via require
    if (window.monaco) {
      this.createMonacoInstance(initialCode, initialLanguage);
      return;
    }

    if (window.require) {
      window.require.config({
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }
      });

      window.require(['vs/editor/editor.main'], () => {
        this.defineCyberTheme();
        this.createMonacoInstance(initialCode, initialLanguage);
      });
      return;
    }

    // Resilient Fallback: Create cyber textarea editor
    this.createFallbackEditor(container, initialCode);
  }

  defineCyberTheme() {
    if (!window.monaco) return;
    window.monaco.editor.defineTheme('coderoyale-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00f0ff', fontStyle: 'bold' },
        { token: 'string', foreground: '00f59b' },
        { token: 'number', foreground: 'ffd700' },
        { token: 'type', foreground: 'a855f7' }
      ],
      colors: {
        'editor.background': '#0d1222',
        'editor.foreground': '#f0f4ff',
        'editorCursor.foreground': '#00f0ff',
        'editor.lineHighlightBackground': '#16203c',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#00f0ff',
        'editor.selectionBackground': '#00f0ff33'
      }
    });
  }

  createMonacoInstance(code, language) {
    const container = document.getElementById(this.containerId);
    if (!container || !window.monaco) return;

    container.innerHTML = '';
    const monacoLang = language === 'cpp' ? 'cpp' : (language === 'python' ? 'python' : 'java');

    this.editorInstance = window.monaco.editor.create(container, {
      value: code,
      language: monacoLang,
      theme: 'coderoyale-dark',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      tabSize: 4,
      smoothScrolling: true,
      cursorBlinking: 'smooth'
    });

    this.isMonacoReady = true;
  }

  createFallbackEditor(container, code) {
    container.innerHTML = '';
    const textarea = document.createElement('textarea');
    textarea.className = 'cyber-textarea-editor';
    textarea.value = code;
    textarea.spellcheck = false;

    // Support Tab indentation in fallback textarea
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }
    });

    container.appendChild(textarea);
    this.fallbackElement = textarea;
  }

  getValue() {
    if (this.editorInstance) {
      return this.editorInstance.getValue();
    }
    if (this.fallbackElement) {
      return this.fallbackElement.value;
    }
    return '';
  }

  setValue(code) {
    if (this.editorInstance) {
      this.editorInstance.setValue(code);
    } else if (this.fallbackElement) {
      this.fallbackElement.value = code;
    }
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    if (this.editorInstance && window.monaco) {
      const monacoLang = lang === 'cpp' ? 'cpp' : (lang === 'python' ? 'python' : 'java');
      window.monaco.editor.setModelLanguage(this.editorInstance.getModel(), monacoLang);
    }
  }

  layout() {
    if (this.editorInstance) {
      this.editorInstance.layout();
    }
  }
}
