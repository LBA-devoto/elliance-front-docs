# Documentation frontend e.lliance Angular

## 📚 Sommaire
* [1. Description des branches du repo](#1-description-des-branches-du-repo)
* [2. Structure du code Angular](#2-structure-du-code-angular)
* [3. Installation de l’application en local](#3-installation-de-lapplication-en-local)
    * [3.1 Prérequis](#31-prérequis)
    * [3.2 Étapes](#32-étapes)
* [4. Déploiement en production](#4-déploiement-en-production)
    * [4.1 Manuel — Soparco & Ironside Prod](#41-manuel--soparco--ironside-prod)
    * [4.2 Déploiement automatique (CI/CD)](#42-déploiement-automatique-cicd)
    * [4.3 Synthèse](#43-synthèse)
* [5 Configuration Nginx — Exemple type](#5-configuration-nginx--exemple-type)
    * [Activation](#activation)
* [6. Initialiser un nouveau client sur e.lliance](#6-initialiser-un-nouveau-client-sur-elliance)
    * [6.1 Frontend Angular](#61-frontend-angular)
    * [6.2 Serveur Nginx (configuration type)](#62-serveur-nginx-configuration-type)
    * [6.3 Réseau et Infrastructure (cas particuliers)](#63-réseau-et-infrastructure-cas-particuliers)
* [7. Architecture backend & workflow](#7-architecture-backend--workflow)
    * [7.1 Chaînage général](#71-chaînage-général)
    * [7.2 Branche dynamique (Adisco, Ironside Dev/Test, Befor)](#72-branche-dynamique-adisco-ironside-devtest-befor)
    * [7.3 Branche statique (Soparco)](#73-branche-statique-soparco)
    * [7.4 Résumé des échanges Backend ↔ Kafka ↔ Workflow ↔ Stockage](#74-résumé-des-échanges-backend--kafka--workflow--stockage)
 

> Version utilisée : Angular 14

## 1. Description des branches du repo

Le dépôt comporte actuellement deux branches actives :

| Nom des branches | Description |
|----------------|-----|
| **main** | branche principale utilisée par Soparco |
| **Elliance-PIM-Dev** | branche de développement utilisée par Adisco, Ironside et Befor |

Chaque branche est associée à un environnement client distinct.

---

## 2. Structure du code Angular

```bash
elliance-frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── core/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   │   └── ...
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── ...
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── ...
```

---

## 3. Installation de l’application en local

### 3.1 Prérequis

- Node.js 18+
- Angular CLI installé globalement :
```bash
npm install -g @angular/cli
```

### 3.2 Étapes

#### Étape 1 : Cloner
```bash
git clone https://github.com/GEOLANE/Elliance-frontend.git
cd Elliance-frontend
```

#### Étape 2 : Installer
```bash
npm install
```

#### Étape 3 : Configurer
Modifier `src/environments/environment.ts` :
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

#### Étape 4 : Lancer
```bash
ng serve --configuration=ironside
ng serve --configuration=adisco
ng serve --configuration=befor
```

#### Étape 5 : Accéder
http://localhost:4200

---

## 4. Déploiement en production
```
                         +-----------------------+
                         |     Frontend Angular  |
                         +-----------+-----------+
                                     |
                                     v
                           +---------+---------+
                           |   Backend API     |
                           |   (Spring Boot)   |
                           +---------+---------+
                                     |
                        Publie des événements Kafka
                                     |
                                     v
                           +---------+---------+
                           |       Kafka       |
                           +---------+---------+
                                     |
                   Consommation des événements par le workflow
                                     |
                                     v
                           +---------+---------+
                           |  Workflow Service |
                           |  (Traitements &   |
                           |  synchronisation) |
                           +---------+---------+
                                     |
             +-----------------------+--------------------------+
             |                                                      |
             v                                                      v
   +--------------------+                               +----------------------+
   |  MinIO (S3-like)   |                               |   FTP Externe        |
   | (Clients dynamiques)|                               |    (Soparco)        |
   +---------+----------+                               +----------+-----------+
             |                                                      |
             | Téléversement                                         | Téléchargement
             v                                                      v
   +---------------------+                              +-----------------------+
   |  Ressources stockées|                              |   Système de fichiers |
   |   (images, docs…)   |                              |  local (Soparco)      |
   +---------------------+                              +----------+------------+
                                                                   |
                                                                   v
                                                          +-----------------+
                                                          |     MongoDB     |
                                                          | (Import Soparco)|
                                                          +--------+--------+
                                                                   |
                                                                   v
                                                          +-----------------+
                                                          |  BPM Camunda    |
                                                          | (Orchestration) |
                                                          +-----------------+

```
Notes :
- Le backend **ne communique jamais directement** avec MinIO ou le FTP.
- Toute action de stockage, import, synchronisation passe par le **Workflow Service** via Kafka.
- Pour les clients dynamiques (Adisco, Ironside Dev/Test, Befor), le workflow envoie les fichiers vers **MinIO**.
- Pour Soparco, le workflow télécharge les fichiers depuis le **FTP** et utilise le **système de fichiers local**.
- Le workflow Soparco exécute en plus des **workflows Camunda BPM**.

### 4.1 Manuel — Soparco & Ironside Prod

### Soparco
- Branche : main  
- Déploiement : `/usr/share/nginx/html`

Build :
```bash
ng build
```

Reload nginx :
```bash
sudo systemctl reload nginx
```

### Ironside Production

⚠️ **Note importante :** Le serveur hôte de production pour **Ironside** est **géré directement par le client**. Ce serveur est situé **derrière un autre serveur placé en zone démilitarisée (DMZ)**. Cela implique :
- Un accès réseau filtré ou restreint
- Le passage obligatoire par un serveur intermédiaire (reverse proxy du client)
- Des contraintes supplémentaires lors des déploiements et du diagnostic réseau

- Si c'est pour IRONSIDE : Modifier le fichier `environment.ironside.ts`  Décommenter signifie enlever les // avant une ligne de code pour l'activer. Commenter signifie ajouter des // devant une ligne de code pour la désactiver.
```bash
wsURL: 'wss://dev-ironside-elliance.geolane.fr/ws' et décommenté celle avec wsURL: 'wss://www.ironsideinternational.com/ws'.
```
- Build :
```bash
ng build --configuration=ironside
```
- Déploiement :
```
/var/www/html
```

Reload nginx :
```bash
sudo systemctl reload nginx
```

---

## 4.2 Déploiement automatique (CI/CD)

Projets : Adisco, Befor, Ironside Dev/Test

Étapes : Merge PR → pipeline GitHub → déploiement auto

---

## 4.3 Synthèse

| Projet | Type | Environnement | Méthode |
|--------|------|----------------|---------|
| Soparco | Manuel | Prod | Build + SSH |
| Ironside | Manuel (Prod) | Prod | Build ironside + SSH |
| Adisco | Auto | Dev+Prod | CI/CD |
| Befor | Auto | Dev+Prod | CI/CD |
| Ironside Dev/Test | Auto | Dev/Test | CI/CD |






## 5 Configuration Nginx — Exemple type

Le front-end Angular est servi par Nginx, qui agit également comme reverse proxy vers le backend e.lliance-backend.

### Exemple de configuration Nginx complète

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name client-elliance.example.fr;
    return 301 https://client-elliance.example.fr;
}

server {
    listen 443 ssl;
    server_name client-elliance.example.fr;
    client_max_body_size 100M;

    ssl_certificate     /opt/certificats/wildcard.geolane.fr.crt;
    ssl_certificate_key /opt/certificats/wildcard.geolane.fr.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    location /produit            { proxy_pass http://elliance-backend:8083/produit; }
    location /task               { proxy_pass http://elliance-backend:8083/task; }
    location /user               { proxy_pass http://elliance-backend:8083/user; }
    location /role               { proxy_pass http://elliance-backend:8083/role; }
    location /menu               { proxy_pass http://elliance-backend:8083/menu; }
    location /entite             { proxy_pass http://elliance-backend:8083/entite; }
    location /email              { proxy_pass http://elliance-backend:8083/email; }
    location /template           { proxy_pass http://elliance-backend:8083/template; }
    location /resource-files     { proxy_pass http://elliance-backend:8083/resource-files; }
    location /oci                { proxy_pass http://elliance-backend:8083/oci; }

    location /ws {
        proxy_pass http://elliance-backend:8083/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_buffering off;
    }

    location /topic {
        proxy_pass http://elliance-backend:8083/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_buffering off;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html { root /usr/share/nginx/html; }
}
```

### Activation

```bash
ln -s /etc/nginx/sites-available/clientX.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```



## 6. Initialiser un nouveau client sur e.lliance

L’initialisation d’un nouveau client nécessite de configurer :
- le backend (propriétés, CORS, scripts),
- le frontend Angular (environnements, build),
- le serveur Nginx (reverse proxy, SSL),
- l’infrastructure réseau selon le client.

---


## 6.1 Frontend Angular

#### ✔️ Créer le fichier d’environnement Angular

Exemple :

```
src/environments/environment.clientX.ts
```

#### ✔️ Ajouter la configuration dans `angular.json`

Ajouter une entrée sous :

```
"configurations": {
    "clientX": { ... }
}
```

#### ✔️ Effectuer le build Angular

```bash
ng build --configuration=clientX
```

#### ✔️ Déployer le build Angular dans Nginx

Chemins courants :

```
/usr/share/nginx/html
```

ou :

```
/var/www/html
```

Copier le contenu du dossier `dist/` dans le chemin de déploiement du client.

---
## 6.2 Serveur Nginx (configuration type)

#### ✔️ Créer un fichier de configuration Nginx

```
/etc/nginx/sites-available/clientX.conf
```

#### ✔️ Ajouter le certificat SSL

- Certificat wildcard  
- ou certificat spécifique au domaine client

#### ✔️ Activer le site

```bash
ln -s /etc/nginx/sites-available/clientX.conf /etc/nginx/sites-enabled/
```

#### ✔️ Tester et recharger Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```
---

##  Configuration Nginx — Exemple type

Le front-end Angular est servi par Nginx, qui agit également comme reverse proxy vers le backend e.lliance-backend.

### Exemple de configuration Nginx complète

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name client-elliance.example.fr;
    return 301 https://client-elliance.example.fr;
}

server {
    listen 443 ssl;
    server_name client-elliance.example.fr;
    client_max_body_size 100M;

    ssl_certificate     /opt/certificats/wildcard.geolane.fr.crt;
    ssl_certificate_key /opt/certificats/wildcard.geolane.fr.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    location /produit            { proxy_pass http://elliance-backend:8083/produit; }
    location /task               { proxy_pass http://elliance-backend:8083/task; }
    location /user               { proxy_pass http://elliance-backend:8083/user; }
    location /role               { proxy_pass http://elliance-backend:8083/role; }
    location /menu               { proxy_pass http://elliance-backend:8083/menu; }
    location /entite             { proxy_pass http://elliance-backend:8083/entite; }
    location /email              { proxy_pass http://elliance-backend:8083/email; }
    location /template           { proxy_pass http://elliance-backend:8083/template; }
    location /resource-files     { proxy_pass http://elliance-backend:8083/resource-files; }
    location /oci                { proxy_pass http://elliance-backend:8083/oci; }

    location /ws {
        proxy_pass http://elliance-backend:8083/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_buffering off;
    }

    location /topic {
        proxy_pass http://elliance-backend:8083/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_buffering off;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html { root /usr/share/nginx/html; }
}
```

### Activation

```bash
ln -s /etc/nginx/sites-available/clientX.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```



## 6.3 Réseau et Infrastructure (cas particuliers)

#### ✔️ Ironside Production
- Le serveur hôte est **géré par le client**
- Hébergé derrière un serveur intermédiaire en **zone DMZ**
- Ports et flux réseau filtrés
- Déploiement et diagnostic dépendants de l’équipe IT cliente

#### ✔️ Soparco
- Aucun MinIO
- Les fichiers sont stockés localement :

```
/home/app/elliance/files/images
```

---


## 7. Architecture backend & workflow (

L’architecture e.lliance repose sur plusieurs composants distincts :
- **Frontend Angular** (servi par Nginx)
- **Backend e.lliance-backend** (API REST & WebSocket)
- **Kafka** (bus d’événements interne entre services)
- **Service e.lliance-workflow** (imports, synchronisation, stockage)
- **Stockage** (MinIO ou FTP → système de fichiers local)

---

### 7.1 Chaînage général

Le backend **ne communique jamais directement** avec MinIO ou un serveur FTP.  
Toutes les opérations passent par le service workflow via Kafka.

```
Frontend Angular
      ↓
Backend (Spring Boot)
      ↓  (Events Kafka)
Kafka Broker
      ↓
Workflow Service
      ↓
( MinIO  |  FTP → Local filesystem )
```

---

### 7.2 Branche dynamique (Adisco, Ironside Dev/Test, Befor)

Ces clients utilisent des **modèles dynamiques** et un stockage basé sur **MinIO**.

Flux complet :

1. Le backend publie un événement Kafka.
2. Le workflow consomme l’événement.
3. Le workflow :
   - traite les données,
   - met à jour MongoDB,
   - stocke les fichiers dans **MinIO**.
4. Le backend récupère les informations via ses propres endpoints.

Backend → Kafka → Workflow → MinIO  
(Le backend n’écrit jamais directement dans MinIO.)

---

### 7.3 Branche statique (Soparco)

Soparco utilise un modèle statique et un stockage local.

Flux complet :

1. Le backend publie un événement Kafka.
2. Le workflow consomme cet événement.
3. Le workflow télécharge les données depuis le **FTP externe**.
4. Les fichiers sont stockés **localement** dans :

```
/home/app/elliance/files/images
```

Ni MinIO ni stockage cloud ne sont utilisés.

---

### 7.4 Résumé des échanges Backend ↔ Kafka ↔ Workflow ↔ Stockage

| Client | Communication backend → workflow | Stockage géré par le workflow | Source workflow |
|--------|----------------------------------|-------------------------------|------------------|
| Soparco | Kafka | Système de fichiers local | FTP externe |
| Adisco | Kafka | MinIO | Modèles dynamiques |
| Ironside Dev/Test | Kafka | MinIO | Modèles dynamiques |
| Befor | Kafka | MinIO | Modèles dynamiques |

---


