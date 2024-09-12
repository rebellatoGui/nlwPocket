const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;

let mensagem = "Bem-vindo ao App de Metas.";

let metas;

async function carregarMetas() {
  try {
    const dados = await fs.readFile("metas.json", "utf8");
    metas = JSON.parse(dados);
  } catch (erro) {
    metas = [];
  }
}

async function salvarMetas() {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

async function cadastrarMeta() {
  const meta = await input({ message: "Digite a meta:" });

  if (meta.length == 0) {
    mensagem = "A meta não pode ser vazia.";
    return;
  }

  metas.push({ value: meta, checked: false });

  mensagem = "Meta cadastrada com sucesso!";
}

async function listarMetas() {
  if (metas.length == 0) {
    mensagem = "Nenhuma meta cadastrada.";
    return;
  }

  const respostas = await checkbox({
    message:
      "Use as Setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa.",
    choices: [...metas],
    instructions: false,
  });

  metas.forEach((meta) => {
    meta.checked = false;
  });

  if (respostas.length == 0) {
    mensagem = "Nenhuma meta selecionada!";
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((meta) => {
      return meta.value == resposta;
    });

    meta.checked = true;
  });

  mensagem = "Meta(s) concluída(s).";
}

async function metasRealizadas() {
  if (metas.length == 0) {
    mensagem = "Nenhuma meta cadastrada.";
    return;
  }

  const realizadas = metas.filter((meta) => {
    return meta.checked == true;
  });

  if (realizadas.length == 0) {
    mensagem = "Não existem metas realizadas! =[ ";
    return;
  }

  await select({
    message: "Metas Realizdas: " + realizadas.length,
    choices: [...realizadas],
  });
}

async function metasAbertas() {
  if (metas.length == 0) {
    mensagem = "Nenhuma meta cadastrada.";
    return;
  }

  const abertas = metas.filter((meta) => {
    return meta.checked != true;
  });

  if (abertas.length == 0) {
    mensagem = "Não existem metas abertas! =] ";
    return;
  }

  await select({
    message: "Metas Abertas: " + abertas.length,
    choices: [...abertas],
  });
}
async function deletarMetas() {
  if (metas.length == 0) {
    mensagem = "Nenhuma meta cadastrada.";
    return;
  }

  const aDeletar = await checkbox({
    message: "Selecione item para deletar",
    choices: metas.map((meta) => ({ name: meta.value, value: meta.value })),
    instructions: false,
  });

  if (aDeletar.length === 0) {
    mensagem = "Nenhum item selecionado!";
    return;
  }

  aDeletar.forEach((item) => {
    metas = metas.filter((meta) => meta.value !== item);
  });

  mensagem = "Meta(s) deletada(s) com sucesso!";
}

function mostrarMensagem() {
  console.clear();

  if (mensagem != "") {
    console.log(mensagem);
    console.log("");
    mensagem = "";
  }
}

async function start() {
  await carregarMetas();

  while (true) {
    mostrarMensagem();
    await salvarMetas();

    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar",
        },
        {
          name: "Listar metas",
          value: "listar",
        },
        {
          name: "Metas realizadas",
          value: "realizadas",
        },
        {
          name: "Metas abertas",
          value: "abertas",
        },
        {
          name: "Deletar metas",
          value: "deletar",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ],
    });
    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        break;
      case "listar":
        await listarMetas();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "deletar":
        await deletarMetas();
        break;
      case "sair":
        console.log("Até a próxima!");
        return;
    }
  }
}

start();
