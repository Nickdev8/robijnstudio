# syntax=docker/dockerfile:1.7

FROM node:20-bookworm AS builder
WORKDIR /work
COPY app/package*.json ./
RUN npm ci
COPY app/ ./
RUN npm run build

FROM node:20-bookworm AS runtime
RUN useradd -r -s /usr/sbin/nologin nodeuser
WORKDIR /app
RUN mkdir -p /app/storage
COPY app/package*.json ./
RUN npm ci --omit=dev
COPY app/defaults.json ./defaults.json
COPY --from=builder /work/build ./build
RUN chown nodeuser:nodeuser defaults.json && chown -R nodeuser:nodeuser build && chown nodeuser:nodeuser /app/storage
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CONTENT_DIR=/app/storage
VOLUME /app/storage
USER nodeuser
EXPOSE 3000
CMD ["node", "build"]
