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

Esse comando já vai rodar o comando de setup da base, com migrações e seed. Sor for necessário executar novamente, no container backend rode:

```
npm run setup:dev
```

Acesse o front end em localhost:8000 e teste o back em localhost:3000
