
document.addEventListener('DOMContentLoaded', carregarEstoque);
setInterval(carregarEstoque, 1000);

function adicionarProdutoEstoque() {
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    const valor = document.getElementById('valor').value;

    if (produto && quantidade && valor) {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${produto}</td>
            <td>${quantidade}</td>
            <td>R$ ${valor}</td>
            <td>
                <button onclick="editarProduto(this)">Editar</button>
                <button onclick="removerProduto(this)">Remover</button>
            </td>
        `;
        document.getElementById('tabela-estoque').appendChild(novaLinha);
        salvarEstoque(produto, quantidade, valor);
        limparCamposEstoque();
    }
}

function limparCamposEstoque() {
    document.getElementById('produto').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor').value = '';
}

function salvarEstoque(produto, quantidade, valor) {
    let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    estoque.push({ produto, quantidade, valor });
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

function carregarEstoque() {
    const estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    document.getElementById('tabela-estoque').innerHTML = '';
    estoque.forEach(item => {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${item.produto}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.valor}</td>
            <td>
                <button onclick="editarProduto(this)">Editar</button>
                <button onclick="removerProduto(this)">Remover</button>
            </td>
        `;
        document.getElementById('tabela-estoque').appendChild(novaLinha);
    });
}

function removerProduto(button) {
    const linha = button.parentNode.parentNode;
    const produto = linha.children[0].innerText;
    const quantidade = parseInt(linha.children[1].innerText);
    linha.remove();
    removerDoEstoque(produto, quantidade);
}

function removerDoEstoque(produto, quantidade) {
    let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    estoque = estoque.filter(item => item.produto !== produto);
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

function editarProduto(button) {
    const linha = button.parentNode.parentNode;
    const produto = linha.children[0].innerText;
    const quantidade = linha.children[1].innerText;
    const valor = linha.children[2].innerText;

    document.getElementById('produto').value = produto;
    document.getElementById('quantidade').value = quantidade;
    document.getElementById('valor').value = valor.replace('R$ ', '');

    removerProduto(button);
}

function adicionarProdutoOrcamento() {
    const produto = document.getElementById('produtoOrcamento').value;
    const quantidade = document.getElementById('quantidadeOrcamento').value;

    if (produto && quantidade) {
        const estoque = JSON.parse(localStorage.getItem('estoque')) || [];
        const itemEstoque = estoque.find(item => item.produto === produto);
        const valor = itemEstoque ? itemEstoque.valor : 0;

        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${produto}</td>
            <td>${quantidade}</td>
            <td>R$ ${valor}</td>
        `;
        document.getElementById('tabela-orcamento-body').appendChild(novaLinha);
        atualizarTotalOrcamento();
        limparCamposOrcamento();
    }
}

function limparCamposOrcamento() {
    document.getElementById('produtoOrcamento').value = '';
    document.getElementById('quantidadeOrcamento').value = '';
    document.getElementById('sugestoes').innerHTML = '';
    document.getElementById('sugestoes').style.display = 'none';
}

function atualizarTotalOrcamento() {
    const orcamento = document.getElementById('tabela-orcamento-body').children;
    let total = 0;
    for (let i = 0; i < orcamento.length; i++) {
        const valor = parseFloat(orcamento[i].children[2].innerText.replace('R$ ', '').replace(',', '.'));
        const quantidade = parseInt(orcamento[i].children[1].innerText);
        total += valor * quantidade;
    }
    document.getElementById('totalOrcamento').innerText = total.toFixed(2).replace('.', ',');
}

function confirmarVenda() {
    const orcamento = document.getElementById('tabela-orcamento-body').children;
    for (let i = 0; i < orcamento.length; i++) {
        const produto = orcamento[i].children[0].innerText;
        const quantidade = parseInt(orcamento[i].children[1].innerText);
        atualizarEstoque(produto, quantidade);
    }
    document.getElementById('tabela-orcamento-body').innerHTML = '';
    atualizarTotalOrcamento();
}

function atualizarEstoque(produto, quantidade) {
    let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    estoque = estoque.map(item => {
        if (item.produto === produto) {
            item.quantidade = Math.max(0, item.quantidade - quantidade);
        }
        return item;
    });
    localStorage.setItem('estoque', JSON.stringify(estoque));
    carregarEstoque();
}

function removerTodoEstoque() {
    localStorage.removeItem('estoque');
    carregarEstoque();
}

function mostrarSugestoes() {
    const input = document.getElementById('produtoOrcamento').value;
    const estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    const sugestoes = estoque.filter(item => item.produto.toLowerCase().includes(input.toLowerCase()));
    const sugestoesDiv = document.getElementById('sugestoes');
    sugestoesDiv.innerHTML = '';

    if (sugestoes.length > 0) {
        sugestoesDiv.style.display = 'block';
        sugestoes.forEach(item => {
            const div = document.createElement('div');
            div.className = 'sugestao';
            div.innerText = item.produto;
            div.onclick = () => {
                document.getElementById('produtoOrcamento').value = item.produto;
                sugestoesDiv.innerHTML = '';
                sugestoesDiv.style.display = 'none';
            };
            sugestoesDiv.appendChild(div);
        });
    } else {
        sugestoesDiv.style.display = 'none';
    }
}
