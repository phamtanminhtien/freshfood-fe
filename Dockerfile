# build stage
FROM node:16-alpine as build-stage
WORKDIR /app

ARG VITE_APP_BASE_URL
ENV VITE_APP_BASE_URL ${VITE_APP_BASE_URL}

ARG VITE_APP_CONTRACT_ADDRESS
ENV VITE_APP_CONTRACT_ADDRESS ${VITE_APP_CONTRACT_ADDRESS}

ARG VITE_PINATA_JWT
ENV VITE_PINATA_JWT ${VITE_PINATA_JWT}

ARG VITE_GOOGLE_MAP_API_KEY
ENV VITE_GOOGLE_MAP_API_KEY ${VITE_GOOGLE_MAP_API_KEY}

COPY . .
RUN npm install
RUN npm run build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]