# Google Drive Clone - React/Node

Esse projeto é um clone simplificado do Google Drive.

## Tecnologias

### Frontend

- React
- Typescript
- Material UI
- Vite

### Backend

- Node
- Typescript
- Express
- Prisma

### Infraestrutura

- Frontend: armazenado em um bucket do S3 e servido via AWS CloudFront. - Backend servido via AWS Lambda usando o framework Serverless.
- Banco de Dados: relacional PostgreSQL e estará na AWS(RDS)

### Como testar

Na raiz do projeto rode o comando para inicializar front, back e banco locais:

```
docker compose -f docker-compose-dev.yml up -d
```

Após isso, rode o comando para encontrar os containers ativos:

```
docker ps
```

Use o id do container do backend para rodar os comandos de migrações e seed:

```
docker exec -it <CONTAINER_ID> npm run setup:dev
```

Acesse o front end em localhost:8000 e teste o back em localhost:3000
