#!/bin/bash
echo "Updating environment variables"
sed -E -i '' "s%'/[a-zA-Z_-]+'\;%'/$1'\;%g" ./src/environments/environment.non-root.ts
echo "Building non-root version with base-href=/$1/"
ng build --configuration=non-root --base-href=/$1/
echo "Replacing /assets/ with /$1/assets/"
find ./dist -type f \( -name "main*" -o -name "style*" \) -exec sed -i '' s%/assets/%/$1/assets/%g {} + 
echo "Replacing \"assets/ with \"/$1/assets/"
find ./dist -type f -name "main*" -exec sed -i '' s%\"assets/%\"/$1/assets/%g {} +