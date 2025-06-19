FROM node:22.3.0-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピー
COPY ./app/package*.json ./

# 依存関係をインストール
RUN rm -rf node_modules package-lock.json
RUN npm install

# その他のファイルをコピー
COPY ./app .

ENTRYPOINT [ "npm","run","dev" ]