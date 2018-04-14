## Start mongodb
mongod --dbpath ~/data/db

## Koble til mongodb
mongo --host 127.0.0.1:27017

## Bygge frontend
kjør følgende kommando i frontend-mappen: npm run build

## Kjøre opp heroku lokalt
```gradlew stage```

```heroku local web -f Procfile.local --env local.env```