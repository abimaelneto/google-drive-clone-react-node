# Google Drive Clone - React/Node

O projeto Google Drive Clone - React/Node é um projeto full stack com linguagem principal de desenvolvimento Typescript, que busca simular, de forma simplificada algumas funcionalidades do Google Drive. 

## Requisitos do projeto

- A solução deve disponibilizar ao usuário final uma interface na qual ele possa interagir com estruturas de diretórios e arquivos (visualmente similar ao Google Drive);
- Autenticação de usuários utilizando JWT para comunicação entre frontend e o backend, como o emprego de cookies;
- Permissionamento, contemplando o seguintes perfis: 
  - Administrador: acesso de leitura, escrita, deleção e compartilhamento sobre todos os arquivos e diretórios;
  - Criador: acesso de leitura, escrita, deleção e compartilhamento sobre todos os objetos criados por ele;
  - Convidado: acessos de acordo com as permissões que os perfis acima concederem  a ele (possíveis leitura, escrita e deleção)
- Em todos os casos anteriores, consideramos que teremos diversos níveis de recursividade nos diretórios e as permissões podem contemplar ou impedir a recursividade.
- Meios para criarmos usuários e configurarmos permissões para os existentes e novos;
- Meios para criarmos diretórios e arquivos dentro da estrutura de arquivos - os arquivos e diretórios não precisam ser reais, mas devem estar corretamente associados na base de dados.
- Scripts / seeds com massa de dados para testes iniciais;

*Observação:* fiquei em dúvida com relação a criar usuários com permissões. Conforme desenvolvia, pensei que as permissões estão muito relacionadas aos arquivos/pastas e não ao usuário em si, exceto por haver um modo ADMIN que permite gerenciamento de outros usuários. Assim, ao criar o usuário, defini a escolha entre usuário admin e comum. No momento do compartilhamento de arquivo/pasta, escolhe-se quais permissões serão concedidas(além de leitura, escrita e deleção) e se elas serão recursivas.

## Tecnologias

### Frontend

- React
- Typescript
- Material UI
- Vite

#### Comentários
- Optei por utilizar a biblioteca Redux para gerenciamento de estado, já que é comumente utilizada e ajuda na criação de alguns padrões. Ultimamente tenho utilizado bastante bibliotecas de gerenciamento no Vue 3, e percebi que o modo como se trata actions assíncronas no Redux é bem mais verboso se comparado ao Pinia, do Vue, por exemplo.
- Não utilizei Next.JS porque não vi necessidade de suas principais features - renderização do lado do servidor - nesse momento do projeto.

Tentei estabelecer uma arquitetura simples de:
- view - uma tela
- layouts - componente importante utilizado em mais de uma tela
- componente - conjunto de UI e lógica a ser reutilizado ou criado para encapsular uma parte do app
- services - classes de comunicação com o backend
- stores - stores do Redux, que gerenciam o estado a ser compartilhado entre telas
- thunks - são funções assíncronas utilizadas pelo Redux para se comunicar com o back e depois atualizar o estado.

Além disso, separei os módulos Auth, Files e Users, e acima deles(na raiz) deixei o que seria compartilhado. 

#### Próximos passos 
- tratar estado de carregamento das telas e de dados em componentes - spinner e skeletons
- melhorar o feedback para o usuário - em forma de toast, por exemplo
- Reorganizar o código:
  - o layout Base do módulo Files ficou muito inchado por ser tudo feito em uma mesma tela, mas suas responsabilidades(criar, editar, etc), devem ser delegadas para componentes menores. 
  - alguns arquivos estão com padrão de nome diferente de outros. A ideia é que o nome de arquivo seja o mesmo do export principal
- Realizar testes de comportamento/integração utilizando Cypress, a fim de garantir o sucesso dos fluxos base do app
- Adicionar e utilizar uma biblioteca para formulários, como Formik ou React Hook Form

### Backend

- Node
- Typescript
- Express
- Prisma

#### Comentários

- A principal decisão foi utilizar o Prisma como ORM, por se tratar de uma ferramenta bem utilizada no mercado e já bem mais madura do que tempos atrás, quando já havia testado. Isso acaba guiando um pouco do desenvolvimento, no sentido de definição de modelos e criação de serviços que dependam do Prisma Client.
- Busquei criar as camadas de controller para tratar das requisições, services para se comunicar com o repositório(Prisma) e router para definir a relação das rotas com as funções do controller.
- No back também separei os módulos Auth, Files e Users, e acima deles deixei o que seria compartilhado. 

Próximos passos:
- adicionar swagger para documentação da API(urgente)
- adicionar encriptação de senhas com bcrypt(essencial)
- garantir injeção de dependência em todas as classes, para facilitar os testes
- testar as funcionalidades principais com jest(unitários) e supertest(e2e)
- rever a separação entre o domínio de permissões e o domínio de arquivos. 
- separar listagem de arquivos próprios e compartilhados

### Infraestrutura

- Frontend: armazenado em um bucket do S3 e servido via AWS CloudFront. - Backend servido via AWS Lambda usando o framework Serverless.
- Banco de Dados: relacional PostgreSQL na AWS(RDS)

#### Descrição
- Por meio de um docker compose de desenvolvimento podemos levantar um ambiente de desenvolvimento com front, back, banco de dados e pgAdmin.
- Por meio de um docker compose de produção podemos levantar front e back localmente, porém utilizando a base de produção.
- O front end está publicado em um bucket do S3 da AWS, sendo servido por meio do CloudFront, o que é uma configuração comum para garantir alta escalabilidade e disponibilidade. 
- O back end é publicado por meio do framework serverless, que se baseia em um arquivo de configuração para levantar a infraestrutura na aws e publicar o app como uma função Lambda. A ideia é se utilizar da arquitetura serverless, que garante alta escalabilidade e disponibilidade, e diminuição de custos por só se pagar pelo que se usa. 

### Como testar

Na raiz do projeto rode o comando para inicializar front, back e banco locais:

```
docker compose -f docker-compose-dev.yml up -d
```

Acesse o front end em localhost:8000 e teste o back em localhost:3000.

Credenciais:

- email: admin@admin.com
- senha: password

Esse comando já vai ter rodado as migrações do banco e o script de seed. Porém, se não conseguir logar, teste rodar novamente:

1 - Rode o comando para encontrar os containers ativos:

```
docker ps
```

2 - Use o id do container do backend para rodar os comandos de migrações e seed:

```
docker exec -it <CONTAINER_ID> npm run setup:dev
```

### Seed
O scrip de seed faz o seguinte:
- cria 2 usuários, 1 admin e 1 comum
- cria para o usuário admin a estrutura abaixo:
```
file1
folder1
  file2
  file3
  folder2
    folder3
      file5
    file4
  folder4
    file6
    folder5
      file7
```
- compartilha com o usuário comum:
*folder2*: recursiva só leitura
*folder4*: não recursiva, leitura, escrita e deleção
*file3*: só leitura
*file5*: escrita e leitura

Dessa forma, testes interessantes para se fazer com o usuário comum são:
- a impossibilidade de criar arquivos dentro de folder2
- a impossibilidade de acessar a folder5, já que a permissão para folder4 não é recursiva
- ler detalhes do file3
- alterar o conteúdo de file5

Com o usuário admin, é interessante:
- criar novos usuários e compartilhar arquivos existentes com eles
- deletar usuários
- acessar arquivos criados pelo usuário comum mesmo que ele não tenha compartilhado

### Conclusão

Com certeza esse projeto foi um desafio bem excitante, no que diz respeito a trabalhar com um case real de necessidade - gerenciamento de arquivos. Além disso, foi possível rever conceitos fundamentais como autenticação com jwt e cookies, modelagem via ORM coexistente a queries customizadas, gerenciamento de estado com actions assíncronas no front end e gerenciamento de tempo.


