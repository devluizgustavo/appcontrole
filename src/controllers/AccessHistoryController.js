const { dialog } = require('electron');
const AccessModel = require('../models/AccessHistoryModel.js');
const windowManager = require('../../windows.js');

async function accessHistoryController(deptoAndAssunto, idRecord) {
  try {
    if (!deptoAndAssunto || !idRecord) return;

    const getAccess = new AccessModel(deptoAndAssunto, idRecord);
    await getAccess.initAccess();

    let string = 'Confira os campos abaixo:\n';
    getAccess.errors.forEach(val => string += val);

    if (getAccess.errors.length > 0) {
      return dialog.showErrorBox('Acesso não liberado', `\n${string}`);
    }

    await dialog.showMessageBox(windowManager.releaseAccessWindow, {
      type: 'info',
      title: 'Atenção',
      message: `Acesso Concedido`,
    });

    windowManager.releaseAccessWindow.close();
    //Sinal dizendo ao front-end que atualize a tabela 
    windowManager.homeWindow.webContents.send('updateTable');

    return getAccess.accessIsTrue;
  } catch(e) {
    console.error('Erro ao tentar armazenar o histórico:', e);
  }
}

module.exports = accessHistoryController;
