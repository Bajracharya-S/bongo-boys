#!/bin/bash

# 🐱 BOGO CAT MEME APPLICATION RUN SCRIPT 🐱
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
    🐱 BOGO CAT MEME APPLICATION 🐱
    ================================
    Starting Maximum Redundancy Mode
    ================================
EOF
echo -e "${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[STARTING]${NC} $1"
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

# Default values
MODE="development"
PORT=3000
HOST="localhost"
NODE_ENV="development"
VERBOSE=false
HELP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -h|--host)
            HOST="$2"
            shift 2
            ;;
        -m|--mode)
            MODE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            HELP=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Show help if requested
if [ "$HELP" = true ]; then
    echo -e "${CYAN}BOGO CAT MEME APPLICATION RUN SCRIPT${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --port PORT     Set the port (default: 3000)"
    echo "  -h, --host HOST     Set the host (default: localhost)"
    echo "  -m, --mode MODE     Set the mode: development, production (default: development)"
    echo "  -v, --verbose       Enable verbose logging"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Start in development mode"
    echo "  $0 -p 8080                  # Start on port 8080"
    echo "  $0 -m production            # Start in production mode"
    echo "  $0 -v                       # Start with verbose logging"
    echo ""
    exit 0
fi

# Check if setup has been run
check_setup() {
    print_status "Checking if setup has been completed..."
    
    if [ ! -d "node_modules" ]; then
        print_error "node_modules directory not found!"
        print_info "Please run ./setup.sh first to install dependencies"
        exit 1
    fi
    
    if [ ! -f "server.js" ]; then
        print_error "server.js not found!"
        print_info "Please ensure you're in the correct directory"
        exit 1
    fi
    
    print_info "Setup check passed"
}

# Set environment variables
set_environment() {
    print_status "Setting environment variables..."
    
    export NODE_ENV="$NODE_ENV"
    export PORT="$PORT"
    export HOST="$HOST"
    
    if [ "$VERBOSE" = true ]; then
        export DEBUG="*"
        export VERBOSE_LOGGING="true"
    fi
    
    print_info "Environment: $NODE_ENV"
    print_info "Port: $PORT"
    print_info "Host: $HOST"
    
    if [ "$VERBOSE" = true ]; then
        print_info "Verbose logging enabled"
    fi
}

# Check for optional services
check_services() {
    print_status "Checking for optional services..."
    
    # Check Redis
    if command -v redis-server &> /dev/null; then
        if pgrep -x "redis-server" > /dev/null; then
            print_info "Redis server is running"
        else
            print_warning "Redis server is not running (optional)"
        fi
    else
        print_warning "Redis not installed (optional)"
    fi
    
    # Check MySQL
    if command -v mysql &> /dev/null; then
        if pgrep -x "mysqld" > /dev/null; then
            print_info "MySQL server is running"
        else
            print_warning "MySQL server is not running (optional)"
        fi
    else
        print_warning "MySQL not installed (optional)"
    fi
    
    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        if pgrep -x "postgres" > /dev/null; then
            print_info "PostgreSQL server is running"
        else
            print_warning "PostgreSQL server is not running (optional)"
        fi
    else
        print_warning "PostgreSQL not installed (optional)"
    fi
    
    # Check MongoDB
    if command -v mongod &> /dev/null; then
        if pgrep -x "mongod" > /dev/null; then
            print_info "MongoDB server is running"
        else
            print_warning "MongoDB server is not running (optional)"
        fi
    else
        print_warning "MongoDB not installed (optional)"
    fi
}

# Start the application
start_application() {
    print_status "Starting Bogo Cat Meme Application..."
    print_bogo "🐱 Activating maximum redundancy mode! 🐱"
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Start the application based on mode
    if [ "$MODE" = "production" ]; then
        print_info "Starting in production mode..."
        print_bogo "🐱 Production mode: Maximum efficiency with maximum redundancy! 🐱"
        node server.js
    else
        print_info "Starting in development mode..."
        print_bogo "🐱 Development mode: Hot reload with maximum package overload! 🐱"
        
        # Check if nodemon is available
        if [ -f "node_modules/.bin/nodemon" ]; then
            print_info "Using nodemon for auto-restart..."
            npx nodemon server.js
        else
            print_warning "nodemon not available, using node directly..."
            node server.js
        fi
    fi
}

# Handle signals for graceful shutdown
setup_signal_handlers() {
    trap 'print_info "Received SIGINT, shutting down gracefully..."; exit 0' INT
    trap 'print_info "Received SIGTERM, shutting down gracefully..."; exit 0' TERM
}

# Display startup information
display_startup_info() {
    echo -e "${GREEN}"
    cat << "EOF"
    🚀 BOGO CAT APPLICATION STARTING! 🚀
    ====================================
EOF
    echo -e "${NC}"
    
    print_bogo "🐱 BOGO CAT MEME POWER: MAXIMUM! 🐱"
    print_bogo "🐱 REDUNDANCY LEVEL: INFINITE! 🐱"
    print_bogo "🐱 PACKAGE COUNT: TOO MANY TO COUNT! 🐱"
    echo ""
    print_info "Application will be available at:"
    echo -e "${CYAN}  http://$HOST:$PORT${NC}"
    echo -e "${CYAN}  http://$HOST:$PORT/ui${NC}  (Clunky UI)"
    echo ""
    print_info "API Endpoints:"
    echo -e "${CYAN}  GET  /                    # Application info${NC}"
    echo -e "${CYAN}  GET  /bogo-cat            # Activate bogo cat${NC}"
    echo -e "${CYAN}  GET  /bogo-cat/v1         # Bogo cat v1${NC}"
    echo -e "${CYAN}  GET  /bogo-cat/v2         # Bogo cat v2${NC}"
    echo -e "${CYAN}  GET  /bogo-cat/v3         # Bogo cat v3${NC}"
    echo -e "${CYAN}  POST /bogo-cat/bongo      # Perform bongo action${NC}"
    echo -e "${CYAN}  POST /bogo-cat/dance      # Perform dance action${NC}"
    echo -e "${CYAN}  GET  /bogo-cat/stats      # Get statistics${NC}"
    echo -e "${CYAN}  POST /bogo-cat/process-photo # Process photo with bongo arms${NC}"
    echo ""
    print_bogo "🐱 Press Ctrl+C to stop the application 🐱"
    echo ""
}

# Main function
main() {
    display_startup_info
    check_setup
    set_environment
    check_services
    setup_signal_handlers
    start_application
}

# Run main function
main "$@"
