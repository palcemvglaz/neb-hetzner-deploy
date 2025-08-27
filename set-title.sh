#!/bin/bash

# Set terminal title for Hetzner deployment project
echo -ne "\033]0;🚀 №HETZ-SESSION-Deployment $1\007"

# Also show in shell prompt
export PS1="🚀 Hetzner Deploy> "