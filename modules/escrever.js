const fs = require('fs').promises;

module.exports = (caminho, dados) => {
    return fs.writeFile(caminho, dados, { flag: 'w' });
}