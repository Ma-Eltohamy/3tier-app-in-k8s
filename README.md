# 📦 Project Overview
This project, **3tier-app-in-k8s**, is focused on the **deployment of a full-stack application on Kubernetes** using a 3-tier architecture: frontend, backend, and a MySQL database. While the application itself is not the focus (borrowed from a prebuilt app), the main goal is to gain hands-on experience in containerizing and deploying multi-tier applications with Kubernetes.

The main challenges tackled during this project include:

- Writing Dockerfiles for both frontend and backend to make them production-ready and compatible with Kubernetes services.

- Modifying application endpoints and environment configurations to enable seamless communication between tiers.

- Orchestrating deployments using Kubernetes manifests for deployments, services, config maps, secrets, persistent volumes, and ingress.

- Generating self-signed certificates using OpenSSL to ensure secure communication within the app. The certificates are created and used for encrypting traffic between services deployed within the cluster.

In short, this project is all about deploying a pre-existing application on Kubernetes and configuring it for a production-like environment, with a focus on the infrastructure and deployment process.

# How to Run and Deploy the App Locally

To run and deploy the app on your local machine, you need to have a Kubernetes cluster running. This project uses **Kind** (Kubernetes in Docker) as a local cluster provider, but you can use any Kubernetes provider of your choice.

## 1. Install Prerequisites 
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

## 2. Create Self-Signed Certificates
The application requires **self-signed certificates** for secure communication. You can generate them using **OpenSSL** by running the following commands:
```bash
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout tls.key -out tls.crt -subj "/CN=web-app.com" -days 365
```
This command creates a new RSA private key and a self-signed certificate. The ```tls.key``` is the private key, and the ```tls.crt``` is the certificate file, valid for 365 days. The ```-subj``` flag sets the subject (CN) to ```web-app.com```, which you can change as needed.
```bash
openssl x509 -in tls.crt -noout -issuer -subject
```
This command displays the issuer and subject of the certificate to verify its contents.

## 3. Deploy the Application
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

## 4. Verify the Development
After applying the configurations, verify that all pods are running correctly with:
```bash
kubectl get pods
```
Check the services with:
```bash
kubectl get svc
```
Once everything is running, you can access the app through ```http://web-app.com``` in your browser.




