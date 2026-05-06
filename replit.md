# Vitrine Streetwear

Uma vitrine de loja streetwear online com carrinho de compras e pedidos via WhatsApp.

## Run & Operate

- `pnpm --filter @workspace/vitrine-streetwear run dev` — roda o frontend (usa PORT env var)
- `pnpm run typecheck` — typecheck completo em todos os pacotes
- `pnpm run build` — typecheck + build em todos os pacotes
- Não requer banco de dados — app frontend-only

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS
- Animações: Framer Motion
- Fontes: Bebas Neue (títulos), Inter (corpo)
- Routing: wouter

## Where things live

- `artifacts/vitrine-streetwear/src/App.tsx` — componente principal com toda lógica da vitrine
- `artifacts/vitrine-streetwear/src/index.css` — tema dark (preto + laranja #FF5733 + dourado #FFC300)
- `artifacts/vitrine-streetwear/src/assets/images/` — imagens dos produtos geradas por IA

## Architecture decisions

- App 100% frontend-only, sem backend — pedidos vão direto para WhatsApp via URL formatada
- Carrinho gerenciado com React useState local (sem persistência)
- Imagens de produtos geradas por IA e salvas localmente no repositório
- Bairros e fretes hardcoded no componente (fácil de expandir)

## Product

- Vitrine de produtos streetwear com grid de 2 colunas
- Produto em destaque (TN sunset) ocupa largura total com borda dourada e glow
- Carrinho com botões +/- por produto
- Seleção de bairro para cálculo de frete
- Totalizador em tempo real (Subtotal + Frete + Total)
- Botão fixo "Finalizar Pedido no WhatsApp" com mensagem pré-formatada

## User preferences

- Idioma: Português (pt-BR)
- WhatsApp: 551140028922
- Bairros: Jardim Boa Vista e Jardim do Lago — R$49,99 frete

## Gotchas

- O @import do Google Fonts em index.css DEVE ser a primeira linha (antes de @import "tailwindcss")
- CSS custom properties usam HSL separado por espaços: --background: 0 0% 0%

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `react-vite` skill for frontend build guidelines
