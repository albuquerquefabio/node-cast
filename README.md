# NodeCast

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/q8tQzojLOn)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve node-cast
```

To create a production bundle:

```sh
npx nx build node-cast
```

To see all available targets to run for a project, run:

```sh
npx nx show project node-cast
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Docker

To deploy your application using Docker, follow these steps:

1. **Local registry**:
   ```sh
   docker run -d -p 5001:5000 --name registry registry:2
   ```
2. **Build the Backend Image**:
   ```sh
   docker build -f Dockerfile.dev -t node-cast-backend:latest .
   docker tag node-cast-backend:latest localhost:5001/node-cast-backend:latest
   ```
3. **Push image to local registry**:
   ```sh
   docker push localhost:5001/node-cast-backend:latest
   ```
4. **Run the Docker Container**:
   ```sh
   docker run -d -p 3000:3000 --name node-cast-backend localhost:5001/node-cast-backend:latest
   ```

## Deploy using kubernetes

To deploy your application using Kubernetes with a blue/green deployment strategy, follow these steps:

### Create Kubernetes Secrets

1. **Create secrets from environment file:**
   ```sh
   kubectl create secret generic app-secrets --from-env-file=.env
   ```

### Simple deployment

1. **Create Deployment and Service Files:** Ensure you have the following files in your k8s directory:

   - `deployment.yaml`
   - `service.yaml`

2. **Apply the Deployment and Service:**
   ```sh
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

### Blue/Green deployment

1. **Create Blue and Green deployment:** Ensure you have the following files in your k8s directory:

   - `deployment-blue.yaml`
   - `deployment-green.yaml`
   - `service.yaml`

2. **Apply the Deployment and Service:**
   ```sh
   kubectl apply -f k8s/deployment-blue.yaml
   kubectl apply -f k8s/deployment-green.yaml
   kubectl apply -f k8s/service.yaml
   ```
3. **Switch Traffic to Green Deployment:** When you are ready to switch traffic to the green deployment, update the service selector:
   ```sh
   kubectl patch service node-cast-service -p '{"spec":{"selector":{"version":"green"}}}'
   ```
4. **Switch Traffic to Blue Deployment:** When you are ready to switch traffic to the blue deployment, update the service selector:
   ```sh
   kubectl patch service node-cast-service -p '{"spec":{"selector":{"version":"blue"}}}'
   ```

### Extras

1. **Get Pods:**
   ```sh
   kubectl get pods
   ```
2. ** Get service details:**
   ```sh
   kubectl get service node-cast-service -o yaml
   ```

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
