# n8n-nodes-codechat

Node comunitário do n8n para usar a API do CodeChat WhatsApp em workflows.

Com este pacote você pode conectar instâncias do WhatsApp, enviar mensagens, gerenciar chats, fazer upload e download de mídias, trabalhar com grupos, configurar webhooks e controlar chamadas simples diretamente no n8n.

## Conteúdo

- [Instalação](#instalação)
- [Credenciais](#credenciais)
- [Recursos e operações](#recursos-e-operações)
- [Como usar](#como-usar)
- [Desenvolvimento](#desenvolvimento)
- [Publicação](#publicação)
- [Compatibilidade](#compatibilidade)
- [Links úteis](#links-úteis)

## Instalação

### Pelo Community Nodes do n8n

No n8n:

1. Abra **Settings**.
2. Acesse **Community Nodes**.
3. Clique em **Install**.
4. Informe `n8n-nodes-codechat`.
5. Confirme a instalação.

Veja também o guia oficial de [instalação de community nodes do n8n](https://docs.n8n.io/integrations/community-nodes/installation/).

### Pelo npm

```bash
npm install n8n-nodes-codechat
```

## Credenciais

Crie uma credencial do tipo **CodeChat API** no n8n com os campos abaixo:

- **Base URL**: URL da sua API CodeChat, por exemplo `https://api.example.com`.
- **Instance Name**: instância padrão que será usada pelo node.
- **Instance Token**: token de autenticação da instância.

As operações usam a instância configurada na credencial.

## Recursos e Operações

### Instance

- Buscar uma instância
- Verificar status da conexão
- Conectar com QR code
- Conectar com código no telefone
- Fazer logout

### Message

- Enviar texto
- Enviar mídia por URL ou ID de upload
- Enviar mídia a partir de arquivo binário do n8n
- Enviar link com preview
- Enviar localização
- Enviar contato
- Enviar reação
- Enviar resposta
- Enviar botões, botão de copiar código, botão de URL, PIX, solicitação de pagamento, PPT e carrossel

### Chat

- Arquivar ou desarquivar chat
- Checar contas de WhatsApp por número
- Apagar mensagem
- Editar mensagem
- Buscar foto de perfil
- Marcar mensagens como lidas
- Rejeitar chamada pela API de chat

### Call

- Abrir uma chamada
- Rejeitar chamada
- Desligar chamada
- Listar chamadas com filtros
- Recuperar uma chamada
- Tocar áudio na chamada por URL ou arquivo binário
- Parar áudio da chamada
- Iniciar gravação
- Parar gravação
- Fazer download de gravações e faixas de áudio/vídeo da chamada

### Media

- Fazer upload de mídia por arquivo binário do n8n
- Listar mídias com filtros
- Buscar metadados de uma mídia
- Fazer download do conteúdo de uma mídia
- Fazer download de mídia de mensagem por conteúdo, ID de banco ou ID da chave da mensagem
- Excluir mídia enviada

### Group

- Criar grupo
- Buscar código de convite
- Revogar código de convite
- Sair do grupo
- Adicionar, remover, promover ou rebaixar participantes
- Atualizar imagem do grupo

### Webhook

- Buscar configuração de webhook
- Definir URL do webhook
- Ativar ou desativar webhook
- Configurar eventos inscritos

## Como usar

1. Adicione o node **CodeChat** em um workflow do n8n.
2. Selecione a credencial **CodeChat API**.
3. Escolha o recurso desejado: **Instance**, **Message**, **Chat**, **Call**, **Media**, **Group** ou **Webhook**.
4. Escolha a operação.
5. Preencha os campos obrigatórios e execute o node.

Para operações com arquivos, como upload de mídia ou envio de áudio em chamada, passe dados binários de um node anterior do n8n e informe o nome correto do campo binário.

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Gere o build:

```bash
npm run build
```

Rode o lint:

```bash
npm run lint
```

Inicie o n8n em modo de desenvolvimento:

```bash
npm run dev
```

Confira o conteúdo que será empacotado para o npm:

```bash
npm pack --dry-run
```

## Publicação

Este projeto usa o fluxo oficial do `n8n-node` para release. Publique com:

```bash
npm run release
```

O comando direto `npm publish` é bloqueado pelo `prepublishOnly` e orienta o uso de `npm run release`.

Antes de publicar, confirme que a conta npm está autenticada:

```bash
npm login
npm whoami
```

## Compatibilidade

- API version de community nodes do n8n: `1`
- Strict mode: habilitado
- Node.js recomendado: versão LTS atual ou versão mais nova suportada pelo n8n

## Links Úteis

- [Documentação do CodeChat](https://docs.codechat.dev)
- [Documentação de community nodes do n8n](https://docs.n8n.io/integrations/community-nodes/)
- [Documentação para criação de nodes no n8n](https://docs.n8n.io/integrations/creating-nodes/)
