# 📦 Project Overview
This project, **3tier-app-in-k8s**, is focused on the **deployment of a full-stack application on Kubernetes** using a 3-tier architecture: frontend, backend, and a MySQL database. While the application itself is not the focus (borrowed from a prebuilt app), the main goal is to gain hands-on experience in containerizing and deploying multi-tier applications with Kubernetes.

The main challenges tackled during this project include:

- Writing Dockerfiles for both frontend and backend to make them production-ready and compatible with Kubernetes services.

- Modifying application endpoints and environment configurations to enable seamless communication between tiers.

- Orchestrating deployments using Kubernetes manifests for deployments, services, config maps, secrets, persistent volumes, and ingress.

- Generating self-signed certificates using OpenSSL to ensure secure communication within the app. The certificates are created and used for encrypting traffic between services deployed within the cluster.

In short, this project is all about deploying a pre-existing application on Kubernetes and configuring it for a production-like environment, with a focus on the infrastructure and deployment process.

## How to Run and Deploy the App Locally

To run and deploy the app on your local machine, you need to have a Kubernetes cluster running. This project uses **Kind** (Kubernetes in Docker) as a local cluster provider, but you can use any Kubernetes provider of your choice.

### 1. Install Prerequisites 
**Install Kind (Kubernetes in Docker)**
1. First, install **Kind** on your machine by following the instructions from the [official Kind installation guide](https://kind.sigs.k8s.io/docs/user/quick-start/).

2. Once **Kind** is installed, use the provided **kind-config.yml** file to create your local Kubernetes cluster. If you haven't done this yet, run the following command:
```bash
$ kind create cluster --config kind-config.yml
```

**Install kubectl**
1. **kubectl** is required to interact with your Kubernetes cluster. You can install it by following the instructions from [the official kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

2. Once installed, ensure kubectl is configured to use your Kind cluster.

**Install Docker**
Since the app relies on Docker for building container images, you will need Docker installed on your local machine. You can download Docker from [here](https://docs.docker.com/engine/install/).

**Expose Ports for Master Node**
Ensure the master node of your Kubernetes cluster exposes **ports 80 and 443**. This is required for routing traffic through your application’s services.

**Before starting**, check that no other services (like Nginx or another web app) are running on these ports.

**Install Ingress Controller for Kind**
Kind doesn't come with an ingress controller by default. To install it, follow these steps:

1. Apply the official **Ingress controller** for Kind by running:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

2. This will install the Ingress controller in your Kind cluster, enabling ingress functionality for routing external traffic to your services.

### 2. Create Self-Signed Certificates
The application requires **self-signed certificates** for secure communication. You can generate them using **OpenSSL** by running the following commands:
```bash
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout tls.key -out tls.crt -subj "/CN=web-app.com" -days 365
```
This command creates a new RSA private key and a self-signed certificate. The ```tls.key``` is the private key, and the ```tls.crt``` is the certificate file, valid for 365 days. The ```-subj``` flag sets the subject (CN) to ```web-app.com```, which you can change as needed.
```bash
openssl x509 -in tls.crt -noout -issuer -subject
```
This command displays the issuer and subject of the certificate to verify its contents.

### 3. Deploy the Application
Once the cluster is ready, follow these steps to deploy the application:

1. **Clone the repository**: Clone the repo to your local machine if you haven’t already.
```bash
git clone https://github.com/Ma-Eltohamy/3tier-app-in-k8s.git
cd 3tier-app-in-k8s
```

2. **Create the Kubernetes Cluster** (if you haven't done it already): If you haven’t created the Kind cluster yet, apply the ```kind-config.yml``` file to set up the cluster:
```bash
cd k8s-setup
kind create cluster --config kind-config.yml
```

3. **Deploy the Database**: Navigate to the ```k8s-setup/database``` directory and apply the database configuration first:
```bash
kubectl apply -f database/
```
Wait until the database pod is fully running and healthy. You can check the pod status with:
```bash
kubectl get pods
```
Make sure the database pod is in the ```Running``` state before proceeding.

4. **Deploy Backend and Frontend**: Once the database is running, apply the backend, frontend, and ingress configuration files:
```bash
kubectl apply -f backend/ -f frontend/ -f ingress/
```

5. **Update** ```/etc/hosts```: Finally, to ensure proper domain resolution on your local machine, add the following line to your ```/etc/hosts``` file:
```bash
127.0.0.1 web-app.com
```
This maps ```web-app.com``` to your local machine's IP, allowing you to access the application.

### 4. Verify the Development
After applying the configurations, verify that all pods are running correctly with:
```bash
kubectl get pods
```
Check the services with:
```bash
kubectl get svc
```
Once everything is running, you can access the app through ```http://web-app.com``` in your browser.

## How I Built the App

This section details the steps and challenges I faced while setting up the app for deployment on Kubernetes.

### 1.Setting Up the Database (MySQL)

The first part of the app's setup involved creating the **MySQL StatefulSet**. The ```statefulset.yml``` file was written to ensure persistent storage for MySQL using ```PersistentVolumeClaim``` and ```VolumeMounts```. Here's the breakdown:

- **Volume Mounts**:

  - ```mysql-pvc```: Ensures persistent storage for MySQL data.

  - ```schema-init```: Mounts the volume containing the database schema (```lms.sql```) for initialization.

- **Schema Initialization**:

  - Used a **ConfigMap** to inject the ```lms.sql``` schema into the MySQL container at the ```/docker-entrypoint-initdb.d``` directory. This ensures the database is initialized with the correct schema on startup.

- **Headless Service**:

  - Created a headless service for MySQL, allowing internal Kubernetes communication without an external IP. This helps maintain stateful and dynamic pod communication for databases.

### 2. Verifying the Database
Once the MySQL StatefulSet is deployed and the schema has been initialized, we need to verify that the database is set up correctly and the schema has been loaded successfully.

#### Accessing the Database Pod

1. **Exec into the MySQL Pod**: To ensure that the database is running correctly, execute the following command to access the MySQL pod:
```bash
kubectl exec -it <mysql-pod-name> -- /bin/bash
```

2. **Login to MySQL**: Once inside the pod, log in to MySQL using the following command:

```bash
mysql -u root -p
```
You will be prompted to enter the password for the root user. This password is stored in the secrets.yml file and is base64 encoded. You can decode it using:
```bash
echo <base64-encoded-password> | base64 --decode
```

3. **Verify the Database Schema**: After logging in, check that the database and tables were correctly initialized by running:
```sql
SHOW DATABASES;
USE <your-database-name>;
SHOW TABLES;
```
This will confirm that the required tables and schema were successfully loaded into the MySQL database.

### 3. Backend Configuration
After setting up the database, the next step was to **containerize the backend** and make it ready for deployment on Kubernetes.

1. Dynamic Endpoints with Environment Variables
The first key change to the backend was making the application’s endpoints **dynamic**. Originally, the backend was hardcoded to use localhost for various endpoints, but since Kubernetes will be managing multiple services (frontend, backend, and database), we needed a way to configure the endpoints dynamically.

  - **What I Learned**: This was the first lesson in making the application flexible by utilizing **environment variables**. By replacing ```localhost``` with environment variable-driven endpoints, I ensured that the backend can connect to other services in the Kubernetes cluster based on the values set in ```.env``` files (e.g., ```BACKEND_API_URL```, ```DATABASE_URL```).

2. Ensuring Continuous Connection to the Database
Another important change was to ensure the backend doesn't just attempt to connect to the database once. In Kubernetes, services may take some time to start up, especially databases like MySQL, which might need some time to initialize and load the schema.

  - **Continuous Database Connection**: I implemented logic that allows the backend to **continuously try to connect** to the MySQL database until it successfully establishes a connection. This prevents a scenario where the backend would fail to connect if the database was still initializing when the backend first tried to connect.

3. Updating MySQL Version Compatibility
Since the database is running **MySQL 8** in a Kubernetes StatefulSet, I needed to ensure the backend was compatible with this version. The backend was initially using an older MySQL package, so I updated the ```package.json``` to use mysql2, which is fully compatible with MySQL 8.

**mysql2**: This is the officially supported MySQL client for Node.js, and it ensures smooth communication between the backend and the MySQL database running in the Kubernetes cluster.

### 4. Frontend Configuration
Similar to the backend, the frontend also required some adjustments to make it suitable for deployment in Kubernetes, particularly when using Ingress to forward traffic.

1. Dynamic Endpoints for Development and Production
The frontend was originally configured to hit **localhost** endpoints (e.g., ```localhost:4000``` for the backend). To ensure proper functionality in a Kubernetes environment, I needed to update the frontend to use **dynamic endpoints** that would change based on the environment (development or production).

- Development and Production Environments:

  - I created two different configurations for the frontend to support both development and production environments. The backend endpoint would switch between ```localhost:4000``` (for local development) and the appropriate Kubernetes service endpoint (e.g., ```/api```) when deployed in a Kubernetes cluster.

  - This ensures that, when using **Ingress** to route traffic, the frontend correctly makes requests to the backend’s ```/api``` path rather than to ```localhost:4000```.

2. Using Ingress for API Routing
With **Ingress** configured in Kubernetes, the app’s frontend will forward API requests to the backend. Specifically, Ingress will route requests to the ```/api``` path, avoiding the need to use ```localhost``` directly.

This setup allows the app to scale and operate properly in a Kubernetes environment without relying on local URLs, enabling seamless interaction between the frontend and backend.

#### 📚 Personal Learning – A Dive into Frontend Concepts
While working on containerizing and deploying this app, I initially treated the frontend as just a part of the stack that needed to be configured. But as I began modifying endpoints and preparing it for production, I found myself exploring deeper frontend concepts that modern web development revolves around.

I came across different frontend rendering strategies, such as:

- **SSR (Server-Side Rendering)**: Rendering pages on the server at request time, useful for SEO and performance.

- **SSG (Static Site Generation)**: Building static HTML at build time, great for speed and scalability.

- **ASP (Application Server Pages)**: A more traditional model where HTML is generated dynamically on the server.

- **Hybrid Rendering**: A mix of the above strategies, allowing parts of the app to be server-rendered while others are static.

This led me to understand the **hydration process**—where static HTML delivered from the server is "activated" on the client-side to become interactive using JavaScript.

I also began learning about **XSS (Cross-Site Scripting)** and the importance of protecting user inputs and outputs to prevent malicious scripts from executing in the browser. These are all things I didn’t expect to dive into but naturally encountered as I worked on preparing the frontend for production.

It was a great reminder that even if the focus is DevOps or backend, understanding the frontend helps make better deployment and architectural decisions.

### Deploying the Frontend and Backend + Ingress Configuration

Once both the **backend and frontend** were containerized and configured to work with Kubernetes, the next steps were:

1. Creating Deployment Manifests
I wrote separate deployment YAML files for both:

```frontend/frontend-deployment.yml```

```backend/backend-deployment.yml```

These define the desired state for each application inside the cluster — the number of replicas, container image source (from Docker Hub), environment variables, and ports.

2. Writing the Ingress Rules
The final piece was setting up **Ingress**, which acts as an entry point to the cluster. Instead of exposing each service manually, I defined **Ingress** rules in ```ingress/app-path-based.yml``` to:

Route ```/``` to the frontend

Route ```/api``` to the backend

This is where the earlier work of adjusting frontend endpoints really paid off — it now properly forwards requests via the path-based routing of Ingress, creating a clean and production-like environment even locally.




