// modulos do node
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
const fs = require('fs');

// meus modulos
const escrever = require('./modules/escrever');
const ler = require('./modules/ler');
const concluir = require('./modules/concluir');
const Tarefa = require('./modules/Tarefa');
const Usuario = require('./modules/Usuario');
const data = require('./modules/data');
const mesFormatado = require('./modules/mesFormatado');
const horaFormatada = require('./modules/horaFormatada');
const { setTimeout } = require('node:timers/promises');

let tarefas = [];

// se usuario.json estiver vazio, cadastra usuário
async function iniciar() {
    console.clear();
    if (fs.statSync('./usuario.json').size == 0) {
        console.log("=================");
        const resposta = await rl.question("Qual o seu nome? ");
        const usuario = new Usuario(resposta);
        await escrever('./usuario.json', JSON.stringify(usuario));
    }
    exibeMenu();
}

async function criaTarefa() {
    const descricao = await rl.question("Digite uma DESCRIÇÃO para sua tarefa? ");
    const tarefa = new Tarefa(descricao);
    tarefas.push(tarefa);
    escrever('./tarefas.json', JSON.stringify(tarefas));
    await exibeMsg("Tarefa registrada :D ", 2);
    exibeMenu();
}

async function exibeTarefas(tarefasARR) {
    console.clear();
    
    if (tarefasARR.length === 0) {
        erro("Não existem tarefas.");
    }
    
    console.log("| ==========================");
    tarefasARR.forEach(tarefa => {
        console.log(`| ${tarefa.id} [${tarefa.concluida ? "X" : ""}] ${tarefa.descricao}`);
    });
    console.log("| ==========================");

    const press = await rl.question("Pressione ENTER para resumir. ");
    console.clear();
    exibeMenu();
}

async function completaTarefa(tarefasARR) {
    console.clear();

    if (tarefasARR.length === 0) {
        await erro("Não existem tarefas.");
        return;
    }

    console.log("| ==========================");
    tarefasARR.forEach(tarefa => {
        console.log(`| ${tarefa.id} [${tarefa.concluida ? "X" : ""}] ${tarefa.descricao}`);
    });
    console.log("| ==========================");

    const num = await rl.question("Qual o NÚMERO da tarefa que deseja concluir? ");
    if (isNaN(Number(num))) {
        await erro("Caractér inválido.");
        return;
    }
    const id = Number(num);
    const tarefa = tarefasARR.find(tarefa => tarefa.id === id);

    if (tarefa) {
        tarefa.concluida = true;
        exibeMsg(`Tarefa "${tarefa.descricao}" marcada como concluída.`, 2);
        await escrever('./tarefas.json', JSON.stringify(tarefasARR));
    } else {
        await erro("Tarefa não encontrada.");
    }

    exibeMenu();
}

async function excluiConta({ nome } = usuarioOBJ) {
    do {
        console.clear();
        resposta = (await rl.question(`Tem certeza que deseja excluir sua conta ${nome}? S/N:`)).toUpperCase();
    } while (resposta !== "S" && resposta !== "N");
    if (resposta === "S") {
        escrever('./usuario.json', '');
        console.clear();
        fechaPrograma();
    } else {
        exibeMenu();
    }
}

async function fechaPrograma() {
    console.clear();
    rl.close();
}

async function exibeMenu() {
    console.clear();

    const usuarioJSON = await ler('./usuario.json');
    const usuarioOBJ = usuarioJSON ? JSON.parse(usuarioJSON) : null
    const tarefasJSON = await ler('./tarefas.json');
    const tarefasARR = tarefasJSON ? JSON.parse(tarefasJSON) : [];

    console.log("| ========================");
    console.log(`| ${horaFormatada()}, ${usuarioOBJ.nome}!`);
    console.log(`| Hoje é dia ${data.getDate()} de ${mesFormatado()} de ${data.getFullYear()}`);
    console.log(`| São ${zeroAEsquerda(data.getHours())}:${zeroAEsquerda(data.getMinutes())}`);
    console.log("| ========================");
    console.log("| [1] Criar tarefa");
    console.log("| [2] Visualizar tarefas");
    console.log("| [3] Completar tarefa");
    console.log("| [4] Excluir conta");
    console.log("| [5] Fechar programa");
    console.log("| ========================");

    do {
        rl.clearLine();
        selectedOption = await rl.question("O que deseja fazer, mestre? ");
    } while (selectedOption !== "1" && selectedOption !== "2" && selectedOption !== "3" && selectedOption !== "4" && selectedOption !== "5")
    
    switch (selectedOption) {
        case "1":
            await criaTarefa();
            break;
        case "2":
            exibeTarefas(tarefasARR);
            break;
        case "3":
            completaTarefa(tarefasARR);
            break;
        case "4":
            excluiConta(usuarioOBJ);
            break;
        default:
            fechaPrograma();
            break;
    }
}

async function erro(erro = "Erro nulo") {
    await exibeMsg(erro, 2);
    exibeMenu();
    return;
}

async function exibeMsg(msg = "Mensagem nula", segundos = 1) {
    console.log(msg);
    await setTimeout(segundos * 1000);
    return;
}

const zeroAEsquerda = n => n < 10 ? "0" + n : n;

iniciar();
