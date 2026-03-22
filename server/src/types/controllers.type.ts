import { Request } from 'express';

// Generic type helper for controllers
export type ControllerRequest<
  Params extends object = object,
  Body extends object = object,
  Query extends object = object,
> = Request<Params, unknown, Body, Query>;
