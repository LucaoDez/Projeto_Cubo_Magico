# Cubo Mágico 3D com Three.js

Projeto desenvolvido para a atividade de Programação 3D com Three.js. A proposta é simular um cubo mágico em ambiente 3D, com cubinhos coloridos, câmera orbital e animações suaves para rotação das faces.

## Integrantes

- Integrante 1: ______________________________
- Integrante 2: ______________________________
- Integrante 3: ______________________________

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador moderno, como Chrome, Edge ou Firefox.
3. Mantenha conexão com a internet, pois o projeto usa Three.js e OrbitControls via CDN.

Também é possível executar com a extensão **Live Server** do VS Code.

## Controles

| Tecla | Ação |
|---|---|
| `Q` | Gira a face superior no sentido principal |
| `W` | Gira a face superior no sentido inverso |
| `A` | Gira a face frontal no sentido principal |
| `S` | Gira a face frontal no sentido inverso |
| `Z` | Gira a face direita no sentido principal |
| `X` | Gira a face direita no sentido inverso |
| `R` | Reinicia o cubo |
| `E` | Embaralha o cubo |

A câmera pode ser movimentada com o mouse usando OrbitControls.

## Funcionalidades implementadas

- Cubo mágico 3D formado por 27 cubinhos.
- Cores diferentes nas faces externas do cubo.
- Rotação suave das faces por interpolação de ângulo.
- Controle da câmera com mouse usando OrbitControls.
- Rotação das seis faces por botões na interface.
- Atalhos de teclado para as faces superior, frontal e direita.
- Botão de embaralhamento.
- Botão de reinício.
- Contador de movimentos.
- Detecção de vitória.
- Temas de cores customizáveis.
- Legenda de controles na tela.

## Requisitos atendidos

### Requisitos mínimos

- Cubo 3 × 3 × 3 construído com 27 cubinhos coloridos.
- Rotação de faces do cubo.
- Animação suave durante a rotação.
- Câmera orbital com mouse.
- Cores corretas por face.

### Requisitos opcionais

- Todas as seis faces podem ser rotacionadas pelos botões da interface.
- Botão de embaralhar com animação.
- Detecção de vitória.
- Contador de movimentos.
- Temas de cor customizáveis.

## Estrutura do projeto

```text
cubo-magico-threejs-github/
├── index.html
├── README.md
├── COMO_COMMITAR.md
├── .gitignore
├── assets/
│   └── .gitkeep
├── docs/
│   ├── prompt-utilizado.md
│   ├── relatorio_cubo_magico_3d.pdf
│   └── relatorio_cubo_magico_3d.docx
└── src/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## Divisão sugerida de tarefas

### Integrante 1

Responsável pela estrutura visual do projeto, incluindo `index.html`, painel de informações, legenda de teclas, botões de controle e organização do layout com CSS.

### Integrante 2

Responsável pela lógica principal do cubo mágico em `src/js/app.js`, incluindo criação dos 27 cubinhos, identificação das faces, agrupamento temporário dos cubinhos e rotação suave das faces.

### Integrante 3

Responsável pelas funcionalidades complementares, documentação e entrega, incluindo contador de movimentos, embaralhamento, detecção de vitória, README, relatório e registro do uso de IA.

## Uso de IA

O uso de IA foi empregado como apoio na construção e organização do projeto.

### Ferramenta utilizada

- ChatGPT, modelo GPT-5.5 Thinking.

### Prompt principal utilizado

> Faça um cubo mágico que cumpra os requisitos mínimos e opcionais do arquivo PDF e use como base os outros arquivos HTML anexados.

### Ajustes posteriores solicitados à IA

> Mude as teclas para rotacionar o cubo para algo mais convencional: Q/W para face superior, A/S para face frontal, Z/X para face direita, R para reset e E para embaralhar. Fazer uma legenda falando qual botão gira qual lado do cubo.

> Faça também o relatório pedido no PDF.

> Organize o arquivo para que possa ser commitado por 3 pessoas em um GitHub e um README do projeto, levando em conta que o README deve ter o uso de IA.

### Partes do projeto em que a IA auxiliou

- Estrutura inicial do código Three.js.
- Implementação do cubo 3D com 27 cubinhos.
- Lógica de rotação das faces com animação suave.
- Inclusão dos atalhos de teclado.
- Organização do painel visual e da legenda.
- Criação do README.
- Criação do relatório do projeto.
- Sugestão de divisão de tarefas entre três integrantes.

### Revisão humana

O código deve ser testado pelos integrantes antes da entrega. A equipe deve conferir se os comandos funcionam corretamente no navegador, se o embaralhamento executa sem travamentos e se os arquivos foram commitados por todos os integrantes no GitHub.

## Observação

Para a entrega final, recomenda-se que cada integrante realize ao menos um commit real no GitHub, respeitando a divisão de tarefas indicada no arquivo `COMO_COMMITAR.md`.
