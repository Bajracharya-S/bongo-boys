#!/bin/bash

# 🐱 BOGO CAT MEME APPLICATION SETUP SCRIPT 🐱
# Maximum redundancy and over-engineering for maximum package utilization

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${CYAN}"
cat << "EOF"
    🐱 BOGO CAT MEME APPLICATION SETUP 🐱
    =====================================
    Maximum Redundancy & Package Overload
    =====================================
EOF
echo -e "${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[SETUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_bogo() {
    echo -e "${PURPLE}[BOGO CAT]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_info "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js version $NODE_VERSION detected. Version 18+ is recommended."
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_info "npm version: $NPM_VERSION"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies (this might take a while)..."
    print_bogo "🐱 Installing over 100 packages for maximum redundancy! 🐱"
    
    if [ -f "package-lock.json" ]; then
        print_info "Using package-lock.json for consistent installs"
        npm ci
    else
        print_info "Installing from package.json"
        npm install
    fi
    
    print_status "Dependencies installed successfully!"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p uploads
    mkdir -p public/generated
    mkdir -p logs
    
    print_info "Created directories: uploads/, public/generated/, logs/"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_info "Creating .env file from template..."
        cat > .env << EOF
# BOGO CAT MEME APPLICATION ENVIRONMENT CONFIGURATION
# Maximum redundancy and over-engineering for maximum package utilization

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration (Optional - app works without databases)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bogo_cat

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_DATABASE=bogo_cat

MONGODB_URI=mongodb://localhost:27017/bogo_cat

# Security Configuration
JWT_SECRET=bogo-cat-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=*

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined

# Feature Flags
BONGO_ENABLED=true
DANCE_ENABLED=true
UI_ENABLED=true
CLUNKY_MODE=true

# Development Settings
HOT_RELOAD=true
DEBUG_MODE=true
VERBOSE_LOGGING=true
EOF
        print_info "Created .env file with default configuration"
    else
        print_info ".env file already exists, skipping creation"
    fi
}

# Validate configuration files
validate_config() {
    print_status "Validating configuration files..."
    
    # Check if at least one config file exists
    if [ -f "config.json" ] || [ -f "config.yaml" ] || [ -f "config.toml" ] || [ -f "config.ini" ]; then
        print_info "Configuration files found"
    else
        print_warning "No configuration files found, using defaults"
    fi
    
    # Validate JSON config if it exists
    if [ -f "config.json" ]; then
        if command -v jq &> /dev/null; then
            if jq empty config.json 2>/dev/null; then
                print_info "config.json is valid JSON"
            else
                print_warning "config.json contains invalid JSON"
            fi
        else
            print_info "jq not available, skipping JSON validation"
        fi
    fi
}

# Check for optional dependencies
check_optional_deps() {
    print_status "Checking for optional dependencies..."
    
    # Check for Redis
    if command -v redis-server &> /dev/null; then
        print_info "Redis server found"
    else
        print_warning "Redis not found (optional)"
    fi
    
    # Check for MySQL
    if command -v mysql &> /dev/null; then
        print_info "MySQL client found"
    else
        print_warning "MySQL not found (optional)"
    fi
    
    # Check for PostgreSQL
    if command -v psql &> /dev/null; then
        print_info "PostgreSQL client found"
    else
        print_warning "PostgreSQL not found (optional)"
    fi
    
    # Check for MongoDB
    if command -v mongod &> /dev/null; then
        print_info "MongoDB server found"
    else
        print_warning "MongoDB not found (optional)"
    fi
}

# Run linting and formatting
run_quality_checks() {
    print_status "Running quality checks..."
    
    # Check if ESLint is available
    if [ -f "node_modules/.bin/eslint" ]; then
        print_info "Running ESLint..."
        npm run lint || print_warning "ESLint found issues (non-critical)"
    else
        print_info "ESLint not available, skipping"
    fi
    
    # Check if Prettier is available
    if [ -f "node_modules/.bin/prettier" ]; then
        print_info "Running Prettier..."
        npm run format || print_warning "Prettier formatting applied"
    else
        print_info "Prettier not available, skipping"
    fi
}

# Display setup completion
display_completion() {
    echo -e "${GREEN}"
    cat << "EOF"
    🎉 SETUP COMPLETE! 🎉
    ====================
EOF
    echo -e "${NC}"
    
    print_bogo "🐱 BOGO CAT APPLICATION IS READY TO RUN! 🐱"
    echo ""
    print_info "To start the application, run:"
    echo -e "${CYAN}  ./run.sh${NC}"
    echo ""
    print_info "Or use npm commands:"
    echo -e "${CYAN}  npm start${NC}     # Start production server"
    echo -e "${CYAN}  npm run dev${NC}    # Start development server with auto-restart"
    echo ""
    print_info "The application will be available at:"
    echo -e "${CYAN}  http://localhost:3000${NC}"
    echo -e "${CYAN}  http://localhost:3000/ui${NC}  (Clunky UI)"
    echo ""
    print_bogo "🐱 Enjoy the maximum redundancy and package overload! 🐱"
}

# Main setup function
main() {
    print_status "Starting Bogo Cat Meme Application setup..."
    
    check_node
    check_npm
    install_dependencies
    create_directories
    setup_environment
    validate_config
    check_optional_deps
    run_quality_checks
    display_completion
}

# Run main function
main "$@"
