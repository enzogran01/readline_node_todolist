module.exports = () => {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
}