# CardForge 🃏

> **Estúdio Dinâmico de Criação, Design e Exportação de Cartas**

O **CardForge** é uma ferramenta web desenvolvida para criadores de jogos de tabuleiro, card games, RPGs e materiais didáticos. Permite desenhar o layout de uma carta visualmente e gerar centenas de cartas automaticamente a partir de uma planilha CSV.

---

## ✨ Funcionalidades

- **🎴 Criação e Customização de Cartas:**
  - Predefinições de tamanhos populares: Pôquer (400×560 e 750×1050 HD), Bridge (360×560), Tarot (420×720), Mini Card (280×430) e Quadrado (500×500).
  - Dimensões manuais customizadas (largura e altura em pixels).
  - Cor de fundo customizada e controle de raio de borda arredondada (0 a 40px).
  - Upload de imagem de fundo com ajuste automático de proporção.

- **📊 Integração Dinâmica com Planilhas CSV:**
  - Carregue arquivos `.csv` e mapeie qualquer coluna como texto dinâmico.
  - Navegue entre cartas com pré-visualização instantânea e paginação.
  - Selecione a coluna desejada para nomear os arquivos ao exportar.

- **🎨 Elementos de Design Ricos:**
  - **Textos:** Estáticos ou variáveis vinculadas ao CSV.
  - **Tipografia:** Múltiplas famílias de fontes, controle de tamanho, alinhamento (esquerda, centro, direita, justificado), negrito, itálico, espaçamento de letras e altura de linha.
  - **Efeitos de Texto:** Contorno (Text Stroke com cor e espessura configuráveis), sombras suaves e efeito 3D em camadas com profundidade ajustável.
  - **Imagens e Ícones:** Upload de imagens locais com conversão automática para Base64 (persistência total nos arquivos de projeto), bloqueio de proporção (aspect ratio lock), opacidade e arredondamento de bordas.

- **📑 Gerenciamento de Camadas & Alinhamento:**
  - Lista visual de camadas com botões de reordenação (Subir, Descer, Trazer para Frente, Enviar para Trás).
  - Botões rápidos de alinhamento ao centro horizontal e vertical (↔ Centralizar X, ↕ Centralizar Y).
  - Duplicação rápida de elementos.

- **⌨️ Atalhos de Teclado & Histórico:**
  - `Ctrl + Z` ou `Cmd + Z`: Desfazer última ação (Undo).
  - `Ctrl + Shift + Z`, `Ctrl + Y` ou `Cmd + Shift + Z`: Refazer ação desfeita (Redo).
  - Botões visuais de **Desfazer (↩)** e **Refazer (↪)** na barra superior do editor.
  - `Delete` ou `Backspace`: Exclui o elemento selecionado.
  - `Esc`: Deseleciona o elemento atual.
  - `Setas do Teclado (↑, ↓, ←, →)`: Move o elemento em passos de 1px.
  - `Shift + Setas`: Move o elemento em passos de 10px.
  - `Ctrl + D` ou `Cmd + D`: Duplica o elemento selecionado.

- **💾 Salvar & Carregar Projetos (.cardforge):**
  - Salva o estado completo do projeto (dimensões, fundo, cores, dados CSV, fontes e imagens) em um arquivo `.cardforge`.
  - Reabertura sem perda de imagens (graças ao armazenamento persistente em Data URL).

- **📦 Exportação Flexível:**
  - **Exportar Carta Atual (.PNG):** Baixa instantaneamente a carta em visualização como imagem de alta resolução.
  - **Exportar Todas as Cartas (.ZIP):** Gera um arquivo compactado contendo todas as cartas geradas a partir do CSV, devidamente nomeadas.

---

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ (recomendado Node 20+)
- npm ou pnpm

### Instalação

```bash
npm install
```

### Modo de Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para usar o CardForge.

### Testes

Executar a suíte de testes unitários com Vitest:

```bash
npm test
```

### Linter & Verificação de Tipos

```bash
npm run lint
```

### Build de Produção

```bash
npm run build
npm start
```

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Manipulação de Imagem & Canvas:** `html-to-image`
- **Interatividade & Drag:** `react-draggable`
- **Manipulação de Dados:** `papaparse`
- **Exportação de Arquivos:** `jszip`, `file-saver`
- **Testes Unitários:** `vitest`
