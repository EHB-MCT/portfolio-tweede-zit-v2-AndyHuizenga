#!/bin/bash

# Iterate over all .css files in the current directory
for file in *.css; do
  # Skip files that already have 'module' in their names
  if [[ $file == *".module.css" ]]; then
    continue
  fi

  # Extract the base name of the file (without the .css extension)
  baseName=$(basename "$file" .css)

  # Rename the file to include 'module' before the .css extension
  mv "$file" "${baseName}.module.css"

  echo "Renamed $file to ${baseName}.module.css"
done