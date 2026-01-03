# Multi-stage Dockerfile for NestJS application

# Development stage
FROM node:20-alpine AS development

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Set environment variable to skip husky install in Docker
ENV HUSKY=0

# Install all dependencies (including dev dependencies for development)
# Skip scripts to prevent arbitrary script execution
RUN pnpm install --frozen-lockfile --ignore-scripts

# Install NestJS CLI globally for development
# Skip scripts to prevent arbitrary script execution
RUN pnpm add -g @nestjs/cli --ignore-scripts

# Copy source code
# Safe to copy all files because .dockerignore excludes sensitive data
COPY . .

# Expose port
EXPOSE 3000

# Default command for development
CMD ["pnpm", "run", "start:dev"]

# Production build stage
FROM node:20-alpine AS build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (skip prepare scripts to avoid husky issues)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
# Safe to copy all files because .dockerignore excludes sensitive data
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies (skip prepare scripts to avoid husky issues)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts && pnpm store prune

# Copy built application from build stage
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

# Remove write permissions from copied files for security
RUN chmod -R a-w /app/dist

# Install knex globally for running migrations
# Skip scripts to prevent arbitrary script execution
RUN pnpm add -g knex --ignore-scripts

# Set working directory for migrations
WORKDIR /app

# Change to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Start the application (run migrations then start app)
CMD sh -c "pnpx knex migrate:latest --knexfile=./dist/knexfile.js && node dist/src/main.js"
