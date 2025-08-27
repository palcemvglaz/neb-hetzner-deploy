#!/bin/bash

# 📚 Project Manager for Nebachiv Content App
# Manages mini-projects lifecycle with proper documentation and Git integration

set -e

PROJECTS_DIR="./projects"
PROJECT_INDEX="$PROJECTS_DIR/PROJECT_INDEX.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Ensure projects directory exists
ensure_projects_dir() {
    if [[ ! -d "$PROJECTS_DIR" ]]; then
        mkdir -p "$PROJECTS_DIR"
        log_info "Created projects directory"
    fi
}

# Get current timestamp
timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Get current date
current_date() {
    date '+%Y-%m-%d'
}

# Create new project
create_project() {
    local project_name="$1"
    local priority="${2:-Medium}"
    
    if [[ -z "$project_name" ]]; then
        log_error "Project name is required"
        echo "Usage: $0 create PROJECT_NAME [Priority]"
        exit 1
    fi
    
    # Sanitize project name for directory
    local project_dir="$PROJECTS_DIR/$(echo $project_name | tr '[:lower:]' '[:upper:]')"
    
    if [[ -d "$project_dir" ]]; then
        log_error "Project $project_name already exists"
        exit 1
    fi
    
    # Create project directory
    mkdir -p "$project_dir"
    
    # Create project files from templates
    create_project_files "$project_dir" "$project_name" "$priority"
    
    # Update project index
    update_project_index "$project_name" "$priority" "🆕 Created" "$(current_date)" "$(current_date)" "New project"
    
    # Create feature branch
    git checkout -b "feature/$(echo $project_name | tr '[:upper:]' '[:lower:]' | tr '_' '-')" 2>/dev/null || true
    
    log_success "Created project: $project_name"
    log_info "Project directory: $project_dir"
    log_info "Feature branch: feature/$(echo $project_name | tr '[:upper:]' '[:lower:]' | tr '_' '-')"
}

# Create project template files
create_project_files() {
    local project_dir="$1"
    local project_name="$2"
    local priority="$3"
    local date_created="$(current_date)"
    
    # project.md
    cat > "$project_dir/project.md" << EOF
# 🎯 PROJECT: $project_name

## 📊 Metadata
- **Status**: 🆕 Created
- **Priority**: $priority
- **Created**: $date_created
- **Updated**: $date_created
- **Branch**: feature/$(echo $project_name | tr '[:upper:]' '[:lower:]' | tr '_' '-')

## 🎯 Problem Statement
*Describe the problem this project solves*

## 🎯 Project Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## 🔗 Dependencies
- **Blocking**: None
- **Blocked by**: None
- **Related**: None

## 📊 Success Metrics
- [ ] Specific measurable outcome 1
- [ ] Performance criteria met
- [ ] No regressions introduced

## 🧠 Context & Background
*Additional context, links to issues, discussions, etc.*

## ⚖️ Trade-offs & Decisions
*Document key decisions made during the project*

## 🚨 Risks & Mitigation
- **Risk 1**: Description → Mitigation strategy
- **Risk 2**: Description → Mitigation strategy

---
*Project created on $date_created*
EOF

    # plan.md
    cat > "$project_dir/plan.md" << EOF
# 📋 PROJECT PLAN: $project_name

## 🎯 Project Phases

### Phase 1: Analysis & Investigation
- [ ] Investigate current state
- [ ] Identify root causes
- [ ] Research possible solutions
- [ ] Define scope and boundaries

### Phase 2: Design & Planning
- [ ] Design solution architecture
- [ ] Plan implementation steps
- [ ] Identify testing requirements
- [ ] Document technical decisions

### Phase 3: Implementation
- [ ] Implement core functionality
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Update documentation

### Phase 4: Testing & Validation
- [ ] Run comprehensive tests
- [ ] Validate success metrics
- [ ] Performance testing
- [ ] User acceptance testing

### Phase 5: Deployment & Cleanup
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Clean up temporary files
- [ ] Update documentation

## 📅 Timeline
- **Start Date**: $date_created
- **Target Completion**: TBD
- **Actual Completion**: TBD

## 🎯 Current Sprint Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## 🔄 Next Actions
*Updated at the end of each work session*
- [ ] Next action 1
- [ ] Next action 2
EOF

    # journal.md
    cat > "$project_dir/journal.md" << EOF
# 📝 PROJECT JOURNAL: $project_name

## Project Timeline
**Created**: $date_created
**Status**: 🆕 Created

---

## Session Template
Copy this template for each work session:

### $(current_date) Session 1: [Phase Name]
**Time**: HH:MM-HH:MM
**Goal**: What you plan to accomplish
**Status**: 🔍 Investigation / 🔨 Implementation / ✅ Testing

#### Done:
- ✅ Completed task 1
- ✅ Completed task 2

#### Problems:
- ❌ Problem 1: Description → Solution
- ⚠️ Blocker: What's blocking progress

#### Discoveries:
- 💡 Key insight 1
- 💡 Key insight 2

#### Next Session:
- [ ] Next task 1
- [ ] Next task 2

#### Time Spent: X hours

---

*Add new session entries above this line*
EOF

    # tests.md
    cat > "$project_dir/tests.md" << EOF
# 🧪 PROJECT TESTS: $project_name

## Test Strategy
*Describe overall testing approach*

## Test Checklist

### 🔧 Unit Tests
- [ ] Core functionality tests
- [ ] Edge case handling
- [ ] Error condition tests
- [ ] Input validation tests

### 🔄 Integration Tests  
- [ ] API endpoint tests
- [ ] Database integration
- [ ] External service integration
- [ ] End-to-end workflows

### 🎭 Manual Testing
- [ ] UI functionality
- [ ] User experience flows
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

### 📊 Performance Tests
- [ ] Load testing
- [ ] Memory usage
- [ ] Response time benchmarks
- [ ] Stress testing

## Test Results

### Test Run: $(current_date)
- **Status**: Not Started
- **Tests Passed**: 0/0
- **Coverage**: 0%
- **Performance**: Not measured

*Add test results for each run*

## Known Issues
*Document any known test failures or issues*

## Test Environment Setup
*Instructions for setting up test environment*

EOF
}

# Update project index
update_project_index() {
    local project_name="$1"
    local priority="$2"
    local status="$3"
    local created="$4"
    local updated="$5"
    local description="$6"
    
    # This is a simplified version - in a real implementation,
    # you'd want to properly parse and update the markdown table
    log_info "Project index update would happen here"
    log_info "Project: $project_name, Status: $status"
}

# Start working on project
start_project() {
    local project_name="$1"
    local project_dir="$PROJECTS_DIR/$(echo $project_name | tr '[:lower:]' '[:upper:]')"
    
    if [[ ! -d "$project_dir" ]]; then
        log_error "Project $project_name does not exist"
        exit 1
    fi
    
    # Switch to project branch
    local branch_name="feature/$(echo $project_name | tr '[:upper:]' '[:lower:]' | tr '_' '-')"
    git checkout "$branch_name" 2>/dev/null || {
        log_warning "Branch $branch_name doesn't exist, creating it"
        git checkout -b "$branch_name"
    }
    
    # Update project status
    local timestamp="$(timestamp)"
    sed -i '' "s/- \*\*Status\*\*:.*/- **Status**: 🔴 Active/" "$project_dir/project.md"
    sed -i '' "s/- \*\*Updated\*\*:.*/- **Updated**: $(current_date)/" "$project_dir/project.md"
    
    log_success "Started working on project: $project_name"
    log_info "Branch: $branch_name"
    log_info "Remember to update journal.md with your session"
}

# Show project status
show_status() {
    local project_name="$1"
    
    if [[ -n "$project_name" ]]; then
        # Show specific project status
        local project_dir="$PROJECTS_DIR/$(echo $project_name | tr '[:lower:]' '[:upper:]')"
        if [[ -d "$project_dir" ]]; then
            echo -e "${PURPLE}📊 Project Status: $project_name${NC}"
            echo "========================="
            head -20 "$project_dir/project.md"
        else
            log_error "Project $project_name not found"
        fi
    else
        # Show all active projects
        echo -e "${PURPLE}📊 Active Projects${NC}"
        echo "=================="
        if [[ -f "$PROJECT_INDEX" ]]; then
            cat "$PROJECT_INDEX"
        else
            log_warning "No project index found"
        fi
    fi
}

# Close project
close_project() {
    local project_name="$1"
    local resolution="$2"
    local project_dir="$PROJECTS_DIR/$(echo $project_name | tr '[:lower:]' '[:upper:]')"
    
    if [[ ! -d "$project_dir" ]]; then
        log_error "Project $project_name does not exist"
        exit 1
    fi
    
    if [[ -z "$resolution" ]]; then
        log_error "Resolution description is required"
        echo "Usage: $0 close PROJECT_NAME \"Resolution description\""
        exit 1
    fi
    
    # Update project status
    sed -i '' "s/- \*\*Status\*\*:.*/- **Status**: ✅ Completed/" "$project_dir/project.md"
    sed -i '' "s/- \*\*Updated\*\*:.*/- **Updated**: $(current_date)/" "$project_dir/project.md"
    
    # Add resolution to project file
    echo "" >> "$project_dir/project.md"
    echo "## ✅ Resolution" >> "$project_dir/project.md"
    echo "**Completed**: $(current_date)" >> "$project_dir/project.md"
    echo "**Resolution**: $resolution" >> "$project_dir/project.md"
    
    # Commit final changes
    git add "$project_dir/"
    git commit -m "[$project_name] COMPLETED: $resolution

Project: $project_name
Status: Completed
Resolution: $resolution
See: projects/$(echo $project_name | tr '[:lower:]' '[:upper:]')/journal.md"
    
    log_success "Closed project: $project_name"
    log_info "Resolution: $resolution"
    log_warning "Don't forget to merge the feature branch to main!"
}

# List all projects
list_projects() {
    echo -e "${PURPLE}📚 All Projects${NC}"
    echo "==============="
    
    if [[ ! -d "$PROJECTS_DIR" ]] || [[ -z "$(ls -A $PROJECTS_DIR)" ]]; then
        log_info "No projects found"
        return
    fi
    
    for project_dir in "$PROJECTS_DIR"/*; do
        if [[ -d "$project_dir" ]] && [[ -f "$project_dir/project.md" ]]; then
            local project_name=$(basename "$project_dir")
            local status=$(grep "Status" "$project_dir/project.md" | head -1 | sed 's/.*Status\*\*: //')
            local priority=$(grep "Priority" "$project_dir/project.md" | head -1 | sed 's/.*Priority\*\*: //')
            echo "📁 $project_name - $status (Priority: $priority)"
        fi
    done
}

# Show help
show_help() {
    echo -e "${PURPLE}📚 Project Manager Help${NC}"
    echo "======================="
    echo ""
    echo "Commands:"
    echo "  create PROJECT_NAME [Priority]  - Create new project"
    echo "  start PROJECT_NAME              - Start working on project"
    echo "  status [PROJECT_NAME]           - Show project status"
    echo "  close PROJECT_NAME \"Resolution\" - Close project"
    echo "  list                            - List all projects"
    echo "  active                          - Show active projects only"
    echo ""
    echo "Examples:"
    echo "  $0 create \"CONSOLE_ERRORS\" \"Critical\""
    echo "  $0 start CONSOLE_ERRORS"
    echo "  $0 status CONSOLE_ERRORS"
    echo "  $0 close CONSOLE_ERRORS \"Fixed by updating dependency\""
}

# Show only active projects
show_active() {
    echo -e "${PURPLE}🔴 Active Projects${NC}"
    echo "=================="
    
    local found_active=false
    
    if [[ -d "$PROJECTS_DIR" ]]; then
        for project_dir in "$PROJECTS_DIR"/*; do
            if [[ -d "$project_dir" ]] && [[ -f "$project_dir/project.md" ]]; then
                if grep -q "🔴 Active" "$project_dir/project.md"; then
                    local project_name=$(basename "$project_dir")
                    local priority=$(grep "Priority" "$project_dir/project.md" | head -1 | sed 's/.*Priority\*\*: //')
                    echo "📁 $project_name (Priority: $priority)"
                    found_active=true
                fi
            fi
        done
    fi
    
    if [[ "$found_active" == false ]]; then
        log_info "No active projects"
    fi
}

# Main command handler
main() {
    ensure_projects_dir
    
    case "${1:-help}" in
        "create")
            create_project "$2" "$3"
            ;;
        "start")
            start_project "$2"
            ;;
        "status")
            show_status "$2"
            ;;
        "close")
            close_project "$2" "$3"
            ;;
        "list")
            list_projects
            ;;
        "active")
            show_active
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"