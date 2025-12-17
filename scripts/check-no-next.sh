#!/bin/sh
# Fail the commit if any staged files are inside .next
if git diff --cached --name-only | grep -qE '^.next/'; then
  echo "Error: Staged files in .next detected. Please remove them before committing."
  exit 1
fi
exit 0
