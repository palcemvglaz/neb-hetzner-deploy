#!/bin/bash
# Shortcut для project-manager.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/project-manager.sh" "$@"