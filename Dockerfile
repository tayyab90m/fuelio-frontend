# syntax=docker/dockerfile:1

# ---- build the static bundle ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# CRA bakes REACT_APP_* values into the bundle at build time, so the backend
# URL must be provided here, not when the container starts:
#   docker build --build-arg REACT_APP_API_URL=https://api.example.com -t fuelio-frontend .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN test -n "$REACT_APP_API_URL" || (echo "Set --build-arg REACT_APP_API_URL=<backend url>" && exit 1)
RUN yarn build

# ---- serve it ----
FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
