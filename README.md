# Solarspell

## Development server

Prerequisites:

1. Docker 
2. Docker compose

To start the app:

- `docker compose up` (Windows/Mac OS)
- `docker-compose up` (Linux)

## Dev 
Start a php server 
```php -c backend/php.ini -S localhost:8080```

Start the dev server ```npm start```


## Build

<!-- ### This might be useful?
To build the angular app for production:
- `docker exec solarspell-app npm build`
Output will be in `dist/` folder -->

## to build normally
Ensure node version 16
```
nvm use 16
```
Run build command
```
ng build --prod --base-href=/
```

## to build for non-root
Ensure node version 16
```
nvm use 16
```

run build script
```
sh ./non-root_build.sh destination_path
```
For example `sh ./non-root_build.sh ag`
<!-- old instructions
>Example build for non-root east-africa library

>*If you have time maybe look into --deploy-url as a ng build option*

Change environment.non-root.ts

From:
```
apiUrl: '/example/backend/',
contentUrl: '/example/content/',
moduleUrl: '/example/',
```

To:
```
apiUrl: '/east-africa/backend/',
contentUrl: '/east-africa/content/',
moduleUrl: '/east-africa/',
```

Then run the following in the root directory
```
nvm use 16
```
```
ng build --configuration=non-root --base-href=/east-africa/
```
```
find ./dist -type f \( -name "main*" -o -name "style*" \) -exec sed -i '' s%/assets/%/east-africa/assets/%g {} +
```
```
find ./dist -type f -name "main*" -exec sed -i '' s%\"assets/%\"/east-africa/assets/%g {} +
``` -->


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
