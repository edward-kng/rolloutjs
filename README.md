<div align="center">
    <h1>LibreFlag.js</h1>
    <p>Feature flags that live in your app and your database. Open source. Ready in minutes.</p>
</div>
<br />

LibreFlag.js is a full stack feature flag framework that gives you incremental feature rollout, segmentation and feature management APIs without ever leaving your app. Plug it into your backend and bring your own database. No SaaS fees. No self-hosting headaches.

> **Note:** The project is in a very early stage of development. Expect instability and breaking changes.

## Features

- **Full control:** Evaluation runs in your backend. Flags, segments and rules are stored in your database.
- **Framework- and database-agnostic:** Plugs right into your existing Node backend and SQL database. If your stack isn't supported already, you can easily build a simple adapter yourself.
- **Feature management:** Use the built-in dashboard to manage features and rollout or build your own backoffice with the included admin REST API and SDK.
- **Free and open:** Built on the OpenFeature standard and OpenFeature Remote Evaluation Protocol (OFREP) API specification. Automatically compatible with clients in several languages. No vendor lock-in.
- **Security:** Resolve user context server-side, keeping your evaluation and segmentation rules safe. Plug in your own authentication middleware for management features.

## Getting Started - Express.js + PostgreSQL Example

### 1. Install on the Server

Install LibreFlag.js for your framework and database

```sh
npm install libreflag @libreflag/express @libreflag/postgres
```

### 2. Migrate the Database

```sh
npx @libreflag/postgres migrate --db-url \
`# Add your database URL here` \
postgresql://postgres:postgres@localhost/postgres
```

### 3. Setup the Server

```typescript
import express from "express";
import cookieParser from "cookie-parser";
import { LibreFlag } from "libreflag";
import { LibreFlagExpress } from "@libreflag/express";
import { PostgresAdapter } from "@libreflag/postgres";

const app = express();

const libreFlag = LibreFlag(
  // Add your database URL here
  PostgresAdapter("postgresql://postgres:postgres@localhost/postgres"),
);

app.use(cookieParser());

app.use(
  LibreFlagExpress(libreFlag, {
    adminAuthMiddleware: (req, res, next) => {
      // Add your custom admin auth here
      if (req.cookies["secretAdminToken"] == "1234") {
        next();
      } else {
        res.status(403).send();
      }
    },
  }),
);

app.get("/greeting", async (req, res) => {
  // Use feature flags anywhere in your backend
  if (await libreFlag.getFlagValue("new-greeting", false)) {
    res.send("Hello universe!");
  } else {
    res.send("Hello world!");
  }
});

app.listen(3000, () => {
  ...
});
```

### 4. Install on the Client

Install the appropriate [OpenFeature Client SDK](https://openfeature.dev/docs/reference/sdks/) and plug in your new [OFREP API](https://openfeature.dev/docs/reference/other-technologies/ofrep/openapi).

```sh
npm install @openfeature/web-sdk @openfeature/ofrep-web-provider
```

### 5. Setup the Client

```typescript
import { OpenFeature } from "@openfeature/web-sdk";
import { OFREPWebProvider } from "@openfeature/ofrep-web-provider";

OpenFeature.setProvider(
  new OFREPWebProvider({
    baseUrl: `http://localhost:3000`,
  }),
);

...

const client = OpenFeature.getClient();

// Use feature flags anywhere in your frontend
if (client.getBooleanValue("new-greeting", false)) {
  alert("Hello universe!");
} else {
  alert("Hello world!");
}
```

### 6. Manage Features

Authenticate according to your middleware, and visit `http://localhost:3000/libreflag/admin` in your browser to start managing your feature flags.

<img src="./screenshot.png">

## License

LibreFlag.js is a free and open source project licensed under the MIT License.
