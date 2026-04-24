<div align="center">
    <h1>RolloutJS</h1>
    <p>Feature flags and gradual rollout, powered by your app. Open-source, full-stack and framework-agnostic.</p>
</div>
<br />

> **Note:** The project is in a very early stage of development. Expect instability and breaking changes.

RolloutJS is a feature management library that lives in your app and uses your database. Release features without pushing code, and roll out gradually or to specific user groups. Turn your backend into its own feature management platform with a built-in admin dashboard and REST API. Use feature flags everywhere with web and mobile clients supported out of the box.

## Features

- **Feature flags:** Control releases by hiding new features behind flags. Toggle on and off and change variables without pushing code.
- **Segmentation:** Roll out gradually and target specific user groups with your own rules.
- **Full control:** Flags and rules live in your database. Evaluation runs in your backend, protected by your auth.
- **Free and open:** Built on the OpenFeature standard and OpenFeature Remote Evaluation Protocol (OFREP). No vendor lock-in.
- **Full-stack:** Web and mobile clients with proper caching work out of the box via OFREP. All the endpoints are set up for you, just point the OpenFeature SDK to your backend.
- **Framework- and database-agnostic:** Plugs right into your existing JavaScript backend and SQL database.
- **Feature management:** Use the built-in dashboard to manage features or build your own backoffice with the REST API and admin SDK.

## Getting Started - Express.js + PostgreSQL Example

### 1. Install on the Server

Install RolloutJS for your framework and database

```sh
npm install rolloutjs @rolloutjs/express @rolloutjs/postgres
```

### 2. Migrate the Database

```sh
npx @rolloutjs/postgres migrate --db-url \
`# Add your database URL here` \
postgresql://postgres:postgres@localhost/postgres
```

### 3. Setup the Server

```typescript
import express from "express";
import cookieParser from "cookie-parser";
import { Rollout } from "rolloutjs";
import { RolloutExpress } from "@rolloutjs/express";
import { PostgresStore } from "@rolloutjs/postgres";

const app = express();

const rollout = Rollout(
  // Add your database URL here
  PostgresStore("postgresql://postgres:postgres@localhost/postgres"),
);

app.use(cookieParser());

app.use(
  RolloutExpress(rollout, {
    adminMiddleware: (req, res, next) => {
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
  if (await rollout.getFlagValue("new-greeting", false)) {
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

Install the appropriate [OpenFeature Client SDK](https://openfeature.dev/docs/reference/sdks/) and plug in your backend.

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

Authenticate according to your middleware, and visit `http://localhost:3000/rolloutjs/admin` in your browser to start managing your feature flags.

<img src="./screenshots/flags.png" width="50%"><img src="./screenshots/segments.png" width="50%">

## License

RolloutJS is a free and open-source project licensed under the MIT License.
