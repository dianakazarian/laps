'use strict';

const path = require('path');
const vscode = require('vscode');

const CONFIG_SECTION = 'courseNotesPreview';
const VIEW_TYPE = 'courseNotesPreview.preview';
const DEFAULT_UPDATE_DELAY = 120;
const MAX_SELECTED_TEXT_LENGTH = 256;

function activate(context) {
  const manager = new PreviewManager(context);

  context.subscriptions.push(
    manager,
    vscode.commands.registerCommand(
      'courseNotesPreview.openPreview',
      () => manager.openPreviewForActiveEditor()
    ),
    vscode.commands.registerCommand(
      'courseNotesPreview.refreshPreview',
      () => manager.refreshPreview()
    )
  );
}

function deactivate() {}

class PreviewManager {
  constructor(context) {
    this.context = context;
    this.controllers = new Map();
    this.disposables = [
      vscode.workspace.onDidChangeTextDocument((event) => this.onDocumentChanged(event)),
      vscode.window.onDidChangeTextEditorSelection((event) => this.onEditorSelectionChanged(event)),
      vscode.window.onDidChangeVisibleTextEditors((editors) => this.onVisibleEditorsChanged(editors)),
      vscode.workspace.onDidChangeConfiguration((event) => this.onConfigurationChanged(event))
    ];
  }

  async openPreviewForActiveEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
      await vscode.window.showInformationMessage(
        'Open a Markdown file first, then run “Course Notes: Open Preview to the Side”.'
      );
      return;
    }

    const key = editor.document.uri.toString();
    const existing = this.controllers.get(key);
    if (existing) {
      existing.updateSourceViewColumn(editor.viewColumn);
      existing.reveal();
      existing.scheduleRender(0);
      return;
    }

    const controller = new PreviewController(this, this.context, editor);
    this.controllers.set(key, controller);
    controller.scheduleRender(0);
  }

  async refreshPreview() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.languageId === 'markdown') {
      const controller = this.controllers.get(activeEditor.document.uri.toString());
      if (controller) {
        controller.scheduleRender(0);
        return;
      }

      await this.openPreviewForActiveEditor();
      return;
    }

    const activeController = Array.from(this.controllers.values()).find(
      (controller) => controller.panel.active
    );
    if (activeController) {
      activeController.scheduleRender(0);
      return;
    }

    if (this.controllers.size) {
      for (const controller of this.controllers.values()) {
        controller.scheduleRender(0);
      }
      return;
    }

    await this.openPreviewForActiveEditor();
  }

  onDocumentChanged(event) {
    if (!event.contentChanges.length) return;

    const sourceController = this.controllers.get(event.document.uri.toString());
    if (sourceController) {
      sourceController.scheduleRender(sourceController.updateDelay());
      return;
    }

    for (const controller of this.controllers.values()) {
      if (controller.usesWorkspaceStylesheet(event.document.uri)) {
        controller.scheduleRender(controller.updateDelay());
      }
    }
  }

  onEditorSelectionChanged(event) {
    const controller = this.controllers.get(event.textEditor.document.uri.toString());
    if (controller) controller.onEditorSelectionChanged(event);
  }

  onVisibleEditorsChanged(editors) {
    for (const editor of editors) {
      const controller = this.controllers.get(editor.document.uri.toString());
      if (controller) controller.updateSourceViewColumn(editor.viewColumn);
    }
  }

  onConfigurationChanged(event) {
    for (const controller of this.controllers.values()) {
      if (event.affectsConfiguration(CONFIG_SECTION, controller.sourceUri)) {
        controller.scheduleRender(0);
      }
    }
  }

  forget(controller) {
    const key = controller.sourceUri.toString();
    if (this.controllers.get(key) === controller) this.controllers.delete(key);
  }

  dispose() {
    for (const disposable of this.disposables.splice(0)) disposable.dispose();
    for (const controller of Array.from(this.controllers.values())) controller.dispose();
    this.controllers.clear();
  }
}

class PreviewController {
  constructor(manager, context, sourceEditor) {
    this.manager = manager;
    this.context = context;
    this.sourceUri = sourceEditor.document.uri;
    this.sourceViewColumn = sourceEditor.viewColumn || vscode.ViewColumn.One;
    this.workspaceFolder = vscode.workspace.getWorkspaceFolder(this.sourceUri);
    this.ready = false;
    this.disposed = false;
    this.renderTimer = undefined;
    this.renderGeneration = 0;
    this.suppressedSelection = undefined;
    this.disposables = [];

    const mediaRoot = vscode.Uri.joinPath(context.extensionUri, 'media');
    const localResourceRoots = [mediaRoot];
    if (this.workspaceFolder) localResourceRoots.push(this.workspaceFolder.uri);

    this.panel = vscode.window.createWebviewPanel(
      VIEW_TYPE,
      previewTitle(sourceEditor.document),
      {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true
      },
      {
        enableFindWidget: true,
        enableScripts: true,
        localResourceRoots
      }
    );

    this.panel.webview.html = createWebviewHtml(
      this.panel.webview,
      context.extensionUri,
      this.workspaceFolder
    );

    this.disposables.push(
      this.panel.webview.onDidReceiveMessage((message) => {
        this.onWebviewMessage(message).catch((error) => this.reportError(error));
      }),
      this.panel.onDidChangeViewState((event) => {
        if (event.webviewPanel.visible) this.scheduleRender(0);
      }),
      this.panel.onDidDispose(() => this.onPanelDisposed())
    );
  }

  reveal() {
    if (!this.disposed) this.panel.reveal(vscode.ViewColumn.Beside, true);
  }

  updateSourceViewColumn(viewColumn) {
    if (viewColumn && viewColumn > 0) this.sourceViewColumn = viewColumn;
  }

  updateDelay() {
    const configured = this.configuration().get('updateDelay', DEFAULT_UPDATE_DELAY);
    if (!Number.isFinite(configured)) return DEFAULT_UPDATE_DELAY;
    return Math.min(1000, Math.max(25, Math.round(configured)));
  }

  scheduleRender(delayMilliseconds) {
    if (this.disposed) return;

    this.renderGeneration += 1;
    const generation = this.renderGeneration;
    if (this.renderTimer) clearTimeout(this.renderTimer);

    this.renderTimer = setTimeout(() => {
      this.renderTimer = undefined;
      this.render(generation).catch((error) => this.reportError(error));
    }, Math.max(0, delayMilliseconds));
  }

  async render(generation) {
    if (this.disposed || !this.ready || generation !== this.renderGeneration) return;

    const document = await this.sourceDocument();
    const cssText = await this.readWorkspaceCss();
    if (this.disposed || generation !== this.renderGeneration) return;

    const configuration = this.configuration();
    const payload = {
      type: 'render',
      uri: this.sourceUri.toString(),
      version: document.version,
      markdown: document.getText(),
      cssText,
      sectionNumber: this.sectionNumber(document, configuration),
      autoNumberCallouts: configuration.get('autoNumberCallouts', true),
      openCollapsedProofs: configuration.get('openCollapsedProofs', false)
    };

    this.panel.title = previewTitle(document);
    await this.panel.webview.postMessage(payload);
  }

  async onWebviewMessage(message) {
    if (!message || typeof message !== 'object' || this.disposed) return;

    if (message.type === 'ready') {
      this.ready = true;
      this.scheduleRender(0);
      return;
    }

    if (message.type !== 'revealSource') return;
    await this.revealSource(message);
  }

  onEditorSelectionChanged(event) {
    if (this.disposed || !this.ready || event.selections.length !== 1) return;

    const selection = event.selections[0];
    if (this.consumeSuppressedSelection(event.textEditor.document, selection)) return;
    if (event.kind !== vscode.TextEditorSelectionChangeKind.Mouse || selection.isEmpty) return;
    if (selection.start.line !== selection.end.line) return;

    const selectedText = event.textEditor.document.getText(selection);
    if (!isSafeSelectedText(selectedText) || selectedText !== selectedText.trim()) return;
    if (/\s/u.test(selectedText)) return;

    this.panel.webview.postMessage({
      type: 'revealPreview',
      uri: this.sourceUri.toString(),
      version: event.textEditor.document.version,
      line: selection.start.line,
      word: selectedText
    });
  }

  async revealSource(message) {
    if (message.uri !== this.sourceUri.toString()) return;
    if (!Number.isInteger(message.version) || message.version < 0) return;
    if (!Number.isInteger(message.line) || message.line < 0 || message.line > 10_000_000) return;
    if (typeof message.word !== 'string') return;
    if (message.word && !isSafeSelectedText(message.word)) return;

    const document = await this.sourceDocument();
    if (message.version > document.version) {
      this.scheduleRender(0);
      return;
    }

    const approximateLine = Math.min(message.line, Math.max(0, document.lineCount - 1));
    const range = findClosestSourceRange(document, message.word.trim(), approximateLine);
    const editor = await this.showSourceDocument(document);

    this.suppressedSelection = {
      version: document.version,
      start: document.offsetAt(range.start),
      end: document.offsetAt(range.end),
      expiresAt: Date.now() + 1000
    };

    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
  }

  consumeSuppressedSelection(document, selection) {
    const suppressed = this.suppressedSelection;
    if (!suppressed) return false;
    if (Date.now() > suppressed.expiresAt) {
      this.suppressedSelection = undefined;
      return false;
    }

    const matches =
      document.version === suppressed.version &&
      document.offsetAt(selection.start) === suppressed.start &&
      document.offsetAt(selection.end) === suppressed.end;

    if (matches) this.suppressedSelection = undefined;
    return matches;
  }

  async showSourceDocument(document) {
    const visible = vscode.window.visibleTextEditors.find(
      (editor) => sameUri(editor.document.uri, this.sourceUri)
    );
    const viewColumn = visible?.viewColumn || this.sourceViewColumn || vscode.ViewColumn.One;
    const editor = await vscode.window.showTextDocument(document, {
      viewColumn,
      preserveFocus: false,
      preview: false
    });
    this.updateSourceViewColumn(editor.viewColumn);
    return editor;
  }

  async sourceDocument() {
    const openDocument = vscode.workspace.textDocuments.find(
      (document) => sameUri(document.uri, this.sourceUri)
    );
    return openDocument || vscode.workspace.openTextDocument(this.sourceUri);
  }

  configuration() {
    return vscode.workspace.getConfiguration(CONFIG_SECTION, this.sourceUri);
  }

  sectionNumber(document, configuration) {
    const noteFiles = configuration.get('noteFiles', []);
    if (!this.workspaceFolder || !Array.isArray(noteFiles)) return 1;

    const relativeDocumentPath = normalizeRelativePath(
      path.relative(this.workspaceFolder.uri.fsPath, document.uri.fsPath)
    );
    const index = noteFiles.findIndex(
      (noteFile) => normalizeRelativePath(noteFile) === relativeDocumentPath
    );
    return index >= 0 ? index + 1 : 1;
  }

  configuredStylesheetUris() {
    if (!this.workspaceFolder) return [];

    const cssFiles = this.configuration().get('workspaceCssFiles', ['styles.css']);
    if (!Array.isArray(cssFiles)) return [];

    return cssFiles
      .map((cssFile) => resolveWorkspaceRelative(this.workspaceFolder, cssFile))
      .filter(Boolean);
  }

  usesWorkspaceStylesheet(uri) {
    return this.configuredStylesheetUris().some((stylesheetUri) => sameUri(stylesheetUri, uri));
  }

  async readWorkspaceCss() {
    const cssFiles = this.configuration().get('workspaceCssFiles', ['styles.css']);
    if (!this.workspaceFolder || !Array.isArray(cssFiles)) return '';

    const chunks = [];
    for (const configuredPath of cssFiles) {
      const uri = resolveWorkspaceRelative(this.workspaceFolder, configuredPath);
      if (!uri) continue;

      try {
        const openDocument = vscode.workspace.textDocuments.find(
          (document) => sameUri(document.uri, uri)
        );
        const css = openDocument ? openDocument.getText() : await readText(uri);
        const label = normalizeRelativePath(configuredPath).replaceAll('*/', '* /');
        chunks.push(`/* ${label} */\n${css}`);
      } catch (_error) {
        // Workspace styles are optional; an absent file should not stop Markdown rendering.
      }
    }

    return chunks.join('\n\n');
  }

  reportError(error) {
    if (this.disposed) return;
    const detail = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Course Notes Preview could not update: ${detail}`);
  }

  onPanelDisposed() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.renderTimer) clearTimeout(this.renderTimer);
    this.renderTimer = undefined;
    for (const disposable of this.disposables.splice(0)) disposable.dispose();
    this.manager.forget(this);
  }

  dispose() {
    if (this.disposed) return;
    this.panel.dispose();
    if (!this.disposed) this.onPanelDisposed();
  }
}

function createWebviewHtml(webview, extensionUri, workspaceFolder) {
  const nonce = createNonce();
  const previewCssUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'preview.css')
  );
  const previewScriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'preview.js')
  );
  const baseTag = workspaceFolder
    ? `<base href="${escapeHtmlAttribute(withTrailingSlash(webview.asWebviewUri(workspaceFolder.uri).toString()))}">`
    : '';

  const contentSecurityPolicy = [
    "default-src 'none'",
    `base-uri ${webview.cspSource}`,
    `img-src ${webview.cspSource} https: data:`,
    `media-src ${webview.cspSource} https: data:`,
    `font-src ${webview.cspSource} https://fonts.gstatic.com data:`,
    `style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com`,
    `script-src ${webview.cspSource} 'nonce-${nonce}' https://cdn.jsdelivr.net`,
    "form-action 'none'",
    "frame-src 'none'"
  ].join('; ');

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta http-equiv="Content-Security-Policy" content="${escapeHtmlAttribute(contentSecurityPolicy)}">
  ${baseTag}
  <title>Course Notes Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&amp;display=swap" rel="stylesheet">
  <link href="${previewCssUri}" rel="stylesheet">
  <style id="workspace-style" nonce="${nonce}"></style>
  <script nonce="${nonce}">
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
        tags: 'ams'
      },
      options: { ignoreHtmlClass: 'tex2jax_ignore' },
      svg: { fontCache: 'global' },
      startup: { typeset: false }
    };
  </script>
  <script nonce="${nonce}" defer src="https://cdn.jsdelivr.net/npm/marked@18.0.11/lib/marked.umd.min.js"></script>
  <script nonce="${nonce}" defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>
  <script nonce="${nonce}" defer src="${previewScriptUri}"></script>
</head>
<body>
  <main id="app">
    <div id="preview-status" role="status">Loading preview…</div>
    <article id="content" aria-live="polite" aria-busy="true"></article>
  </main>
</body>
</html>`;
}

function findClosestSourceRange(document, selectedText, approximateLine) {
  if (selectedText) {
    const selectedLower = selectedText.toLocaleLowerCase();
    const startsWithWordCharacter = isWordCharacter(selectedText[0]);
    const endsWithWordCharacter = isWordCharacter(selectedText[selectedText.length - 1]);
    let bestMatch;

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber += 1) {
      const lineText = document.lineAt(lineNumber).text;
      const lineLower = lineText.toLocaleLowerCase();
      let character = lineLower.indexOf(selectedLower);

      while (character >= 0) {
        const before = character > 0 ? lineText[character - 1] : '';
        const afterIndex = character + selectedText.length;
        const after = afterIndex < lineText.length ? lineText[afterIndex] : '';
        const validStart = !startsWithWordCharacter || !isWordCharacter(before);
        const validEnd = !endsWithWordCharacter || !isWordCharacter(after);

        if (validStart && validEnd) {
          const exactCase = lineText.slice(character, afterIndex) === selectedText;
          const score =
            Math.abs(lineNumber - approximateLine) * 1_000_000 +
            (exactCase ? 0 : 100_000) +
            character;

          if (!bestMatch || score < bestMatch.score) {
            bestMatch = { lineNumber, character, score };
          }
        }

        character = lineLower.indexOf(selectedLower, character + Math.max(1, selectedText.length));
      }
    }

    if (bestMatch) {
      const start = new vscode.Position(bestMatch.lineNumber, bestMatch.character);
      const end = new vscode.Position(
        bestMatch.lineNumber,
        bestMatch.character + selectedText.length
      );
      return new vscode.Range(start, end);
    }
  }

  const fallbackLine = document.lineAt(approximateLine);
  const firstTextCharacter = fallbackLine.text.search(/\S/);
  const character = firstTextCharacter >= 0 ? firstTextCharacter : 0;
  const position = new vscode.Position(approximateLine, character);
  return new vscode.Range(position, position);
}

function isSafeSelectedText(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= MAX_SELECTED_TEXT_LENGTH &&
    !/[\r\n]/.test(value)
  );
}

function isWordCharacter(character) {
  return Boolean(character) && /[\p{L}\p{N}_]/u.test(character);
}

function resolveWorkspaceRelative(workspaceFolder, configuredPath) {
  if (typeof configuredPath !== 'string' || !configuredPath.trim()) return undefined;
  if (path.isAbsolute(configuredPath)) return undefined;

  const pieces = normalizeRelativePath(configuredPath)
    .split('/')
    .filter((piece) => piece && piece !== '.');
  if (!pieces.length || pieces.includes('..')) return undefined;

  return vscode.Uri.joinPath(workspaceFolder.uri, ...pieces);
}

async function readText(uri) {
  const bytes = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(bytes).toString('utf8');
}

function previewTitle(document) {
  const fileName = document.fileName || document.uri.path || 'Untitled';
  return `Preview: ${path.basename(fileName)}`;
}

function normalizeRelativePath(value) {
  return String(value || '')
    .replaceAll('\\', '/')
    .replace(/^\.\//, '');
}

function sameUri(first, second) {
  return Boolean(first && second) && first.toString() === second.toString();
}

function withTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function createNonce() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let index = 0; index < 32; index += 1) {
    nonce += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return nonce;
}

module.exports = { activate, deactivate };
