import { Application } from "@oak/oak";
import { useOakServer, useOas } from "@dklab/oak-routing-ctrl";
import { MyController } from "./MyController.ts";

const app = new Application();
useOakServer(app, [MyController]);
useOas(app);
await app.listen({ port: 1993 });
