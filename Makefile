# Droptext Makefile

.PHONY: dev build start lint test clean db-migrate install upgrade generate-env

# Run development server (uses turbopack)
dev:
	npm run dev

# Build production-ready app
build:
	npm run build

# Start production server
start:
	npm run start

# Run ESLint
lint:
	npm run lint

# Run Jest tests
test:
	npm run test

# Clean generated files (optional; you can customize this)
clean:
	rm -rf .next

# Run DB migration script (customize if using Kysely migrations or your own script)
db-migrate:
	npx tsx scripts/migrate.ts

# Generate .env file interactively from .env.example
generate-env:
	npx tsx scripts/generate-env.ts

# Install all dependencies
install:
	npm install

# Upgrade all packages (optional)
upgrade:
	npm update
