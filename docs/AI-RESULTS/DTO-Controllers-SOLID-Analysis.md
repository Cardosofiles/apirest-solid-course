---
title: 'DTOs na Camada de Controllers — Análise SOLID'
author: 'Staff Engineer (simulado)'
date: 2026-06-08
---

![architecture](https://img.shields.io/badge/Layering-Clean%20Architecture-blue)
![solid](https://img.shields.io/badge/Principles-SOLID-yellowgreen)
![typescript](https://img.shields.io/badge/Language-TypeScript-3178c6)

**Resumo executivo**

- Esta análise avalia se o uso de DTOs (por exemplo `UserRequestDTO` e `UserResponseDTO`) diretamente na camada de `Controllers` viola o Princípio da Responsabilidade Única (SRP) do SOLID.
- Conclusão: usar DTOs como _tipos simples_ ou _esquemas de validação_ na camada de controllers é aceitável e comum; entretanto, responsabilidades maiores (mapeamentos complexos, regras de negócio, formatação rica) devem ser extraídas para camadas dedicadas (mappers/presenters/use-cases). Seguir esta separação preserva SRP.

**Contexto técnico**

- Aplicação: Node.js + Fastify + TypeScript, com estrutura em camadas (http/controllers -> use-cases -> repositories).
- Tipos de DTOs em foco:
  - Request DTO: forma/contrato esperado na entrada HTTP (ex.: `UserRequestDTO`).
  - Response DTO: forma serializada da saída (ex.: `UserResponseDTO`).

**Pergunta central**

O controller deve conter/definir os DTOs e ser responsável por construir e transformar entre domain models e DTOs? Isso viola SRP?

**Princípio Aplicado (SRP)**

SRP (Responsibility Single Principle) afirma: "Uma classe/objeto deve ter apenas uma razão para mudar." Em aplicações web isso costuma mapear assim:

- Controller: responsabilidade por orquestrar a chamada HTTP → validação superficial → delegação ao caso de uso, e formar a resposta HTTP (código de status, headers, serialização simples).
- Use-case (application service): responsabilidade por lógica de negócio e orquestração entre repositórios e outras dependências.
- Repository: responsabilidade por persistência.
- Presenter / Mapper / Serializer: responsabilidade por transformar domain models em formatos de saída adequados para APIs.

Colocar DTOs na controller não viola SRP por si só quando:

1. DTOs são apenas _tipos/contratos_ ou _esquemas de validação_ (Zod, Joi, class-validator). Eles não contêm lógica de negócio.
2. O controller não implementa regras ou transformações complexas — apenas valida e mapeia minimamente para o formato aceito pelo use-case.

Violação ocorre quando:

- O controller contém lógica de mapeamento extensa (ex.: montagem de agregados, decisões condicionais sobre campos, enriquecimento via serviços externos).
- O controller realiza regras de negócio (por exemplo, cálculos, políticas, verificações não relacionadas ao protocolo HTTP).
- O controller define DTOs que também contêm comportamento (métodos, validações dependentes de contexto de negócio) — tais responsabilidades deveriam estar nos use-cases ou em objetos de domínio.

**Padrões recomendados (práticos)**

1. Tipos e esquemas (DTOs) em um lugar neutro e importáveis

- Arquivar seus tipos / schemas em `src/http/schemas` (ou `src/dtos`) deixa claro que são contratos da camada de apresentação. Já o domínio usa tipos próprios (models) quando necessário.

2. Validação no controller, regra no use-case

- Use `zod`/`fastify-type-provider-zod` para validação no controller (já presente no projeto). A validação converte e garante a forma de entrada; não resolve regras de negócio.

Exemplo (controller):

```ts
// http/controllers/users/register.ts (pseudocódigo)
const body = registerBodySchema.parse(request.body); // -> Body é do shape do RequestDTO
await registerUseCase.execute(body); // body convertido/puro, sem lógica adicional
return reply.status(201).send({ message: 'Usuário criado' });
```

3. Mapeamento Domain -> Response

- Quando o domínio entrega uma entidade com detalhes técnicos, delegue a transformação para um `presenter` ou `serializer`:

```ts
// presenter/users-presenter.ts
export function toUserResponseDto(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at.toISOString(),
  };
}

// controller
const { user } = await registerUseCase.execute(...);
return reply.status(201).send({ user: toUserResponseDto(user) });
```

4. Onde armazenar DTOs

- `src/http/schemas` — para validação e tipos de entrada (request).
- `src/http/serializers` ou `src/presenters` — para mappers de saída (response).
- Evite misturar DTOs de apresentação com objetos do domínio ou interfaces de repositório.

**Casos práticos e trade-offs**

- Simples: Quando DTOs são apenas aliases de tipos e o mapeamento é direto, mantê-los no controller (ou próximo a ele) é prático e não viola SRP.
- Complexo: Se as respostas precisam de mapeamentos condicionais, composições ou máscaras (por exemplo esconder campos, formar URLs, montar relações), extraia um presenter; caso contrário o controller sofre creep and becomes hard to test.

**Referências & boas práticas**

- Clean Architecture (Robert C. Martin) — separação de responsabilidade por camada e uso de presenters/adapters.
- Martin Fowler — Data Transfer Object pattern (DTO) — explicado como um objeto simples para transportar dados entre processos.
- Artigos sobre API design e apresentação: recomenda-se sempre ter uma camada de serialização/presenter para convergência de formatos.

**Checklist prático (aplicar no repositório atual)**

1. DTOs de request: manter em `src/http/schemas` (já presente). Controller valida via `registerBodySchema` — OK.
2. DTOs de response: criar `src/http/presenters` ou `src/http/serializers` e mover lógica de formatação para lá, se houver mais que mapeamento trivial.
3. Mapeamentos e lógica -> preferir `presenters` (apenas transformação), `use-cases` (lógica de negócio), `repositories` (persistência).
4. Tipagem TypeScript: usar `ReturnType` e `z.infer<>` para evitar duplicação e garantir consistência.

**Conclusão — posição do Staff Engineer**

Usar `UserRequestDTO` e `UserResponseDTO` na camada de controllers é válido e não, por si só, quebra o SRP — desde que esses DTOs permaneçam contratos/estruturas de dados e não acumulem responsabilidades (validação de negócio, lógica de mapeamento pesada, comunicação com infra). Controllers devem delegar comportamento e apenas orquestrar entrada/saída. Para projetos que crescerão, recomendo formalizar uma camada de `presenters/serializers` e um local claro para `dtos/schemas` (por exemplo `src/http/schemas` e `src/http/presenters`), mantendo o domínio e os use-cases livres de acoplamento com formatos de transporte.

Se quiser, eu posso:

- sugerir um layout de pastas e nomes de arquivos para `schemas` e `presenters` com base no repositório atual;
- aplicar refatoração minimalista para extrair presenters dos controllers existentes (PR com mudanças pequenas e testes).

---

Arquivo gerado automaticamente por análise solicitada.
