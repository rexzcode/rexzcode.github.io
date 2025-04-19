#!/bin/bash

echo "🟣 Solace Auto Sync is now watching for changes..."
echo "🔁 Press Ctrl+C to stop."

fswatch -o . | xargs -n1 -I{} sh -c '
  echo "📦 Detected change. Syncing with GitHub...";
  git add . && git commit -m "auto update" && git push
  echo "✅ Site updated!"
'
