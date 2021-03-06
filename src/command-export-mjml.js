import { mjmlConvert } from './components/utils.js';

export default (editor, opt = {}) => {
  const config = editor.getConfig();
  const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  const container = document.createElement('div');
  const cmdm = editor.Commands;
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';

  // Init code viewer
  codeViewer.set({
    codeName: 'htmlmixed',
    theme: opt.codeViewerTheme,
  });

  const getMjml = () => {
    const mjml = opt.preMjml + editor.getHtml() + opt.postMjml;
    return mjmlConvert(mjml, opt.fonts);
  };

  // Set the command which could be used outside
  cmdm.add('mjml-get-code', {
    run() {
      return getMjml();
    }
  });

  let htmlCode;

  return {

    buildEditor(label) {
      const config = editor.getConfig();
      const ecm = editor.CodeManager;
      const cm = ecm.getViewer('CodeMirror').clone();
      const txtarea = document.createElement('textarea');
      const el = document.createElement('div');
      el.style.flex = '1 0 auto';
      el.style.padding = '5px';
      el.style.maxWidth = '100%';
      el.style.boxSizing = 'border-box';

      const codeEditor = cm.set({
        label: label,
        codeName: 'htmlmixed',
        theme: opt.codeViewerTheme,
        input: txtarea,
      });

      const elEditor = new ecm.EditorView({ model: codeEditor, config }).render().el;
      el.appendChild(elEditor);
      codeEditor.init(txtarea);

      return { codeEditor, el };
    },

    run(editor, sender = {}) {
      const modal = editor.Modal;
      modal.close();

      modal.setTitle('HTML Code');
      modal.setContent('');
      modal.setContent(container);


      if (!htmlCode) {
        const codeViewer = this.buildEditor();
        htmlCode = codeViewer.codeEditor;
        container.appendChild(codeViewer.el);
      }

      modal.open();


      if (htmlCode) {
        const mjml = getMjml();
        if (mjml.errors.length) {
          mjml.errors.forEach((err) => {
            console.warn(err.formattedMessage);
          });
        }
        htmlCode.setContent(mjml.html);
        //htmlCode.editor.setOption('lineWrapping', 1);
        htmlCode.editor.refresh();
      }

      sender.set && sender.set('active', 0);
    },

  };
};
