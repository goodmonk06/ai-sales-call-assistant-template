# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 3 - Deep Expansion (In Progress)

#### Added
- **Domain Model Expansion**: 7 new entities (User, Team, Tag, ScriptVersion, CoachingNote, etc.)
- **Extensibility Framework**: Adapter pattern for Notifications, Analytics, CRM, AI
- **Event System**: Domain events with pub/sub pattern
- **Logging**: Structured logging with correlation IDs and context
- **Metrics**: Performance monitoring with counters, gauges, and histograms
- **Phase 3 Documentation**: docs/PHASE3_OVERVIEW.md with roadmap and goals

#### Changed
- OpenAI integration now uses adapter pattern
- All AI calls now tracked with metrics and logging
- Database schema significantly expanded with relationships and metadata

## [0.2.0] - Phase 2 Complete

### Added
- **Complete Vertical Slice**: CallLog list and detail pages
- **Input Validation**: Zod schemas for all API inputs
- **Error Handling**: Centralized error handler with consistent responses
- **Testing**: Vitest with 17 passing tests
- **Docker Support**: Multi-stage Dockerfile and docker-compose files
- **Seed Data**: Realistic demo data for 3 business types
- **DX Improvements**: Standardized npm scripts
- **Documentation**: Comprehensive README with setup instructions

### Technical Improvements
- Type-safe API endpoints end-to-end
- Prisma error handling (P2002, P2025)
- Production-ready Docker configuration
- Development Docker Compose for PostgreSQL
- Test coverage for validation and error handling

## [0.1.0] - Initial Implementation

### Added
- Next.js 15 with App Router and TypeScript
- PostgreSQL database with Prisma ORM
- ScriptTemplate and CallLog entities
- AI feedback generation with OpenAI
- Basic CRUD operations for scripts
- Call log creation with AI feedback
- Tailwind CSS styling
- React Markdown rendering

### Features
- Script template management (create, edit, list)
- Call log registration
- AI-powered feedback (strengths, improvements, phrases)
- Japanese language support

