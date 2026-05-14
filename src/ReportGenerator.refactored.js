export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    let report = this._generateHeader(reportType, user);
    let total = 0;

    const filteredItems = this._filterItems(user, items);

    for (const item of filteredItems) {
      if (user.role === 'ADMIN' && item.value > 1000) {
        item.priority = true;
      }

      report += this._generateRow(reportType, user, item);
      total += item.value;
    }

    report += this._generateFooter(reportType, total);

    return report.trim();
  }

  _generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }
    if (reportType === 'HTML') {
      return `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
    }
    return '';
  }

  _filterItems(user, items) {
    if (user.role === 'ADMIN') {
      return items;
    }
    return items.filter(item => item.value <= 500);
  }

  _generateRow(reportType, user, item) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    
    if (reportType === 'HTML') {
      // Código limpo: o espaço só é adicionado junto com o style. 
      // Se não tiver prioridade, gera <tr> perfeitamente.
      const styleAttr = item.priority ? ' style="font-weight:bold;"' : '';
      return `<tr${styleAttr}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }
    return '';
  }

  _generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }
    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return '';
  }
}