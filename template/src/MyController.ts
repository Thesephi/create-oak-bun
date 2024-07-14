import { Controller, ControllerMethodArgs, Get, z, type zInfer } from "@dklab/oak-routing-ctrl";
import type { Context, RouteContext } from "@oak/oak";

const HelloNamePathParamsSchema = z.object({ name: z.string() });
const OpenApiSpecForHelloName = {
  request: { params: HelloNamePathParamsSchema },
  responses: {
    "200": {
      description: "Success",
      content: { "text/html": { schema: z.string() } },
    },
  },
}

@Controller("/v1")
export class MyController {
  @Get("/hello/:name", /* API spec is entirely optional */ OpenApiSpecForHelloName)
  @ControllerMethodArgs("param")
  hello(
    param: zInfer<typeof HelloNamePathParamsSchema>, // or type it however else you like
    ctx: Context & RouteContext<"/hello/:name">
  ) {
    console.log(`${ctx.params.name} is the same as ${param.name}`);
    return `hello, ${param.name}`;
  }
}
