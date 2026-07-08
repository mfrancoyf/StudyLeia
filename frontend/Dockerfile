# ============================================================================
# StudyLeia — Frontend (React + Vite)
#
# Build multi-stage: primeiro compila os assets estáticos com Node, depois
# serve o resultado com Nginx (imagem final enxuta, sem toolchain Node).
#
# VITE_API_URL é lida em build-time pelo Vite (import.meta.env). Como o
# bundle roda no NAVEGADOR do usuário (não dentro do container), o valor
# padrão "http://localhost:8080" funciona out-of-the-box em dev/local:
# o backend expõe a porta 8080 no host via docker-compose. Para apontar
# para outro host/domínio em produção, passe --build-arg VITE_API_URL=...
# ============================================================================

FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=5 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
