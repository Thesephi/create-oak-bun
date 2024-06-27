import { Controller, Get } from "@dklab/oak-routing-ctrl";
import type { Context, RouteContext } from "@oak/oak";

@Controller("/v1")
export class MyController {
  @Get("/hello/:name")
  hello(ctx: Context & RouteContext<"/hello/:name">) {
    return `hello, ${ctx.params.name}`;
  }
}
