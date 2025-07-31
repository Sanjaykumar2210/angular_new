# AngularNew

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Authentication Flow

This application uses Auth0 for authentication with the following features:

### Login
- Users are redirected to the login page (`/login`) when not authenticated
- The login page automatically redirects authenticated users to the dashboard
- All protected routes require authentication

### Logout
- Users can logout using the logout button in the header
- Upon logout, users are automatically redirected to the login page
- The logout process includes a loading state for better UX

### Route Protection
- All main routes (dashboard, appointments, patients, doctors) are protected by the `authGuard`
- Unauthenticated users are automatically redirected to `/login`
- The default route (`/`) redirects to `/login` for unauthenticated users
- Any undefined routes (`**`) redirect to `/login`

### Authentication State Management
- The app component subscribes to authentication state changes
- The header component only shows when the user is authenticated
- Authentication state is managed globally through the `AuthService`

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
