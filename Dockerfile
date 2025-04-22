# Etapa de construcción
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production --project=SistemaVentasV1

# Etapa de producción con serve
FROM node:18-alpine
WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar el build
COPY --from=builder /app/dist/sistema-ventas-v1/browser ./

# Healthcheck opcional (para CI)
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

EXPOSE 3000

# Servir en producción
CMD ["serve", "-s", ".", "-l", "3000", "--single"]
