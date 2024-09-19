#!/bin/sh

echo "DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}" > .env

npx prisma migrate dev
npx prisma generate

npm run dev