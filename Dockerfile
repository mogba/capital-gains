FROM denoland/deno:alpine
WORKDIR /app
COPY . .
ENV ENVIRONMENT=production
ENTRYPOINT ["deno", "run", "--allow-env", "main.ts"]
