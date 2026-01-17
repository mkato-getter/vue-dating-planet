# 開発用 Dockerfile
FROM node:20-alpine

WORKDIR /app

# 依存関係インストール
COPY package*.json ./
RUN npm install

# アプリ本体をコピー
COPY . .

# Nuxt 3はデフォルトで3000ポートを使用
EXPOSE 3000

# ホットリロード対応で外部アクセス可能に
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
