# Status API VTEX

Servidor local (Node + Express) que consulta o status das APIs de Produção e Homologação da VTEX e serve a página de monitoramento — sem expor as credenciais no navegador e sem bloqueio de CORS, já que a chamada real sai do servidor, não do front-end.

## Requisitos

- Node.js 18 ou superior (usa o `fetch` nativo do Node)

## Como rodar

```bash
cd status-api-server
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador.

## Configuração

As credenciais ficam no arquivo `.env` (já preenchido com as chaves atuais):

```
PORT=3000
PROD_AUTH_HEADER=Basic <token>
HOM_API_KEY=<chave>
```

Se as chaves forem rotacionadas no futuro, só atualizar esse arquivo — não é preciso mexer no código. O `.env` está no `.gitignore`, então não é versionado caso você suba este projeto pra um repositório.

## Estrutura

```
status-api-server/
├── server.js         # proxy: recebe /api/status/:env, chama a AWS com as credenciais e devolve o resultado
├── public/index.html # página de monitoramento (front-end), sem nenhuma credencial
├── .env               # credenciais reais (não versionar)
├── .env.example        # modelo do .env
└── package.json
```

## Hospedar fora da sua máquina

Se quiser deixar isso rodando em um servidor (não só localhost), dá pra subir em qualquer serviço que rode Node (Render, Railway, uma VM, etc.). Nesse caso, troque `cors()` em `server.js` por algo restrito à sua origem, por exemplo:

```js
app.use(cors({ origin: 'https://seu-dominio.com' }));
```
