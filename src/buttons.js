import { mjmlConvert } from './components/utils.js';

export default (editor, opt = {}) => {
  const tltAttr = 'title';
  const tltPosAttr = 'data-tooltip-pos';
  const pnm = editor.Panels;
  const optPanel = pnm.getPanel('options');
  const cmdPanel = pnm.getPanel('options');
  const viewsPanel = pnm.getPanel('views');
  const HOST = "rp78.zeroxcc.com";
  const PORT = "7821";
  const API_HOST = "rp78.zeroxcc.com";
  const API_PORT = "8881";
  const API_PATH_TOPICS = "/api/newsletter/topics";
  const API_PATH_PUBLISH = "/api/newsletter/publish";
  const API_PATH_CONTENT = "/api/newsletter/content";
  let publisherId;
  let publishProcess = false;

  const updateTooltip = (coll) => {
    coll.each((item) => {
      var attrs = item.get('attributes');
      attrs[tltPosAttr] = 'bottom';
      item.set('attributes', attrs);
    });
  };

  if (viewsPanel) {
    const cmdBtns = viewsPanel.get('buttons');

    const layers = pnm.addButton('views', 'open-layers');
    layers && cmdBtns.remove(layers);

    let contentHTML;

    const commands = editor.Commands;
    commands.add('publish', {
      resPublishNewsletter(msg) {
        const contentUrl = 'http://' + API_HOST + API_PATH_CONTENT + '/' + msg;

        const container = document.createElement('div');
        container.style.display = 'flex';

        const linkLabel = document.createElement('label');
        linkLabel.innerHTML = "Link: &nbsp;";

        const link = document.createElement('a');
        link.style.color = 'PowderBlue';
        link.href = contentUrl;
        link.innerHTML = msg;

        container.appendChild(linkLabel);
        container.appendChild(link);

        const modal = editor.Modal;
        modal.setTitle('Newsletter published successfully' );
        modal.setContent(container);
        modal.open();
      },
      reqPublishNewsletter(theUrl) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            this.resPublishNewsletter(xmlHttp.response);
        };
        xmlHttp.open("POST", theUrl, true);
        xmlHttp.send(contentHTML);
      },
      run() {

        if (topicId == undefined) {
          alert(" A newsletter topic is required before publishing! \n Please select one from the list (in the top left section).");
        } else if (publisherId == undefined) {
          publishProcess = true;
          editor.runCommand('publisherSettings');
        } else {
          const mjml = opt.preMjml + editor.getHtml() + opt.postMjml;
          const content = mjmlConvert(mjml, opt.fonts);
          contentHTML = content.html;

          const publishUrl = 'http://' + API_HOST + API_PATH_PUBLISH + '/' + publisherId + '/topic/' + topicId;
          this.reqPublishNewsletter(publishUrl);
        }
      }
    });

    updateTooltip(cmdBtns);
  }

  if (optPanel) {
    // Fix tooltip position
    const cmdBtns = optPanel.get('buttons');

    cmdBtns.each((btn) => {
      const attrs = btn.get('attributes');
      attrs[tltPosAttr] = 'bottom';
      btn.set('attributes', attrs);
    });

    // remove fullscreen
    const fullscreen = pnm.addButton('options', 'fullscreen');
    fullscreen && cmdBtns.remove(fullscreen);

    updateTooltip(cmdBtns);
  }

  // Clean commands panel
  if (cmdPanel) {
    const cmdBtns = cmdPanel.get('buttons');
    // cmdBtns.reset();
    cmdBtns.add([{
      id: 'undo',
      className: 'fa fa-undo',
      command: 'undo',
      attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.undo') }
    }, {
      id: 'redo',
      className: 'fa fa-repeat',
      command: 'redo',
      attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.redo') }
    }]);
    updateTooltip(cmdBtns);
  }
  // Turn off default devices select and create new one
  editor.getConfig().showDevices = 0;
  const devicePanel = pnm.addPanel({ id: 'devices-c' });
  const deviceBtns = devicePanel.get('buttons');
  devicePanel.get('buttons').add([{
    id: 'deviceDesktop',
    command: 'set-device-desktop',
    className: 'fa fa-desktop',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.desktop') }
  }, {
    id: 'deviceTablet',
    command: 'set-device-tablet',
    className: 'fa fa-tablet',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.tablet') }
  }, {
    id: 'deviceMobile',
    command: 'set-device-mobile',
    className: 'fa fa-mobile',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.mobile') }
  }]);

  updateTooltip(deviceBtns);

  // Modal to get the application settings
  const container = document.createElement('div');
  container.style.display = 'flex';

  const appKeyInput = document.createElement('input');
  appKeyInput.style.width = '300px';
  appKeyInput.style.height = '19px';
  appKeyInput.style.padding = '5px 10px';
  appKeyInput.style.marginTop = '0px';
  appKeyInput.style.marginRight = '5px';
  appKeyInput.style.marginBottom = '0px';
  appKeyInput.style.borderRadius = '3px';
  appKeyInput.style.border = '1px';
  appKeyInput.style.verticalAlign = 'bottom';
  appKeyInput.id = "PublisherKey";
  appKeyInput.name = "PublisherKey";
  appKeyInput.value = 'Key';
  appKeyInput.style.color = "rgba(0,0,0,0.6)";

  const verifyButton = document.createElement('button');
  verifyButton.style.width = '125px';
  verifyButton.style.cursor = 'pointer';
  verifyButton.style.padding = '5px 10px';
  verifyButton.style.marginTop = '0px';
  verifyButton.style.marginLeft = '5px';
  verifyButton.style.marginBottom = '0px';
  verifyButton.style.borderRadius = '3px';
  verifyButton.style.fontFamily = 'inherit';
  verifyButton.style.fontSize = '0.875rem';
  verifyButton.style.color = "#BBBBBB";
  verifyButton.style.backgroundColor = "inherit";
  verifyButton.style.border = '1px solid #2A2A2A';
  verifyButton.style.verticalAlign = 'bottom';
  verifyButton.value = 'Submit';
  verifyButton.name = "Submit";
  verifyButton.innerHTML = "Validate";

  const paragraph = document.createElement('div');
  paragraph.style.verticalAlign = 'bottom';

  paragraph.appendChild(appKeyInput);
  paragraph.appendChild(verifyButton);

  const verifyMessage = document.createElement('span');
  verifyMessage.id = 'verifyMessage';
  verifyMessage.style.color = 'red';
  verifyMessage.style.verticalAlign = 'middle';
  verifyMessage.style.marginTop = '8px';
  verifyMessage.style.display = 'block';
  verifyMessage.innerHTML = " &nbsp; ";

  paragraph.appendChild(verifyMessage);

  editor.Commands.add('publisherSettings', {

    resCheckPublisherKey(response) {
      if (response == "false") {
        verifyMessage.style.color = 'red';
        verifyMessage.innerHTML = "The key provided is invalid!";
      } else {
        verifyMessage.style.color = '#90ee90';
        verifyMessage.innerHTML = "The key provided is valid ... publishing";
        publisherId = appKeyInput.value;

        if (publishProcess) {
          editor.runCommand('publish');
          publishProcess = false;
        }
      }
    },
    reqCheckPublisherKey(theUrl) {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          this.resCheckPublisherKey(xmlHttp.response);

        if (xmlHttp.status == 400) {
          verifyMessage.style.color = 'red';
          verifyMessage.innerHTML = "The key provided is invalid!";
        }

      };
      xmlHttp.open("GET", theUrl, true);
      xmlHttp.send(null);
    },
    run() {
      verifyButton.onclick = () => {
        if (appKeyInput == undefined || appKeyInput.value == "Key"  || appKeyInput.value === "")
          verifyMessage.innerHTML = "A valid application key is required.";
        else
          this.reqCheckPublisherKey('http://' + API_HOST + '/api/newsletter/publisher/' + appKeyInput.value);
      };

      appKeyInput.onfocus = () => {
        appKeyInput.value = '';
      };

      container.append(paragraph);

      const modal = editor.Modal;
      modal.setTitle('Application Key: ');
      modal.setContent('');
      modal.setContent(paragraph);
      modal.open();
    }
  });

};
