# syntax=docker/dockerfile:1.6

# Multi-stage image for Next.js (App Router) production

FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates git && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
# Install all deps (incl. dev) for building
RUN npm ci --include=dev

# Ensure the correct lightningcss native binary is present (handles linux arm64/x64)
RUN OS=$(node -p "process.platform") ARCH=$(node -p "process.arch") \
		&& echo "Detected platform: ${OS}-${ARCH}" \
		&& if [ "$OS" = "linux" ] && [ "$ARCH" = "arm64" ]; then \
				 npm i --no-save lightningcss-linux-arm64-gnu; \
				 if [ -d node_modules/@tailwindcss/oxide ]; then \
					 npm i --no-save --prefix node_modules/@tailwindcss/oxide @tailwindcss/oxide-linux-arm64-gnu; \
				 fi; \
			 elif [ "$OS" = "linux" ] && [ "$ARCH" = "x64" ]; then \
				 npm i --no-save lightningcss-linux-x64-gnu; \
				 if [ -d node_modules/@tailwindcss/oxide ]; then \
					 npm i --no-save --prefix node_modules/@tailwindcss/oxide @tailwindcss/oxide-linux-x64-gnu; \
				 fi; \
			 else \
				 echo "Non-linux or unsupported arch for explicit native installs; skipping"; \
			 fi

FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_LIGHTNINGCSS=1
ENV TAILWIND_DISABLE_LIGHTNINGCSS=1
ENV TAILWIND_DISABLE_OXIDE=1

# Cloudinary public values (passed at build time) so Next can inline them
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
# Ensure native bindings for lightningcss are present for this stage/arch
RUN npm rebuild lightningcss --verbose || true
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_LIGHTNINGCSS=1
ENV TAILWIND_DISABLE_LIGHTNINGCSS=1
ENV TAILWIND_DISABLE_OXIDE=1
ENV HOST=0.0.0.0
ENV PORT=3000

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy build artifacts and runtime assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "run", "start"]
