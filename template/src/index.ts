import { Application } from "@oak/oak";
import { useOakServer } from "@dklab/oak-routing-ctrl";
import { MyController } from "./MyController.ts";

const app = new Application();
useOakServer(app, [MyController]);
await app.listen({ port: 1993 });
