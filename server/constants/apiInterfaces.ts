import { object, string, boolean, ObjectSchema } from "yup";

// Resolution
interface Resolution {
  title: string;
  description: string;
  goals: { [key: string]: Goal | undefined };
}

const resolutionSchema: ObjectSchema<Resolution> = object({
  title: string().required(),
  description: string().defined(),
  goals: object().defined(),
});

// /api/create-resolution
interface APICreateResolutionArguments {
  user_id: string;
  title: string;
  description: string;
}

const apiCreateResolutionArgumentsSchema: ObjectSchema<APICreateResolutionArguments> =
  object({
    user_id: string().required(),
    title: string().required(),
    description: string().defined(),
  }).noUnknown(true);

interface APICreateResolutionReturn {
  success: boolean;
  reason?: string;
}

const apiCreateResolutionReturnSchema: ObjectSchema<APICreateResolutionReturn> =
  object({ success: boolean().required(), reason: string().optional() });

// /api/read-resolution
interface APIReadResolutionArguments {
  user_id: string;
}

const apiReadResolutionArgumentsSchema: ObjectSchema<APIReadResolutionArguments> =
  object({ user_id: string().defined() }).noUnknown(true);

interface APIReadResolutionReturn {
  success: boolean;
  resolutions?: { [key: string]: Resolution | undefined };
  reason?: string;
}

// /api/update-resolution
interface APIUpdateResolutionArguments {
  user_id: string;
  firebase_key: string;
  new_title: string;
  new_description: string;
  goals: { [key: string]: Goal | undefined };
}

const apiUpdateResolutionArgumentsSchema: ObjectSchema<APIUpdateResolutionArguments> =
  object({
    user_id: string().required(),
    firebase_key: string().required(),
    new_title: string().required(),
    new_description: string().defined(),
    goals: object().required(),
  }).noUnknown(true);

interface APIUpdateResolutionReturn {
  success: boolean;
  reason?: string;
}

const apiUpdateResolutionReturnSchema: ObjectSchema<APIUpdateResolutionReturn> =
  object({ success: boolean().required(), reason: string().optional() });

// /api/delete-resolution
interface APIDeleteResolutionArguments {
  user_id: string;
  firebase_key: string;
}

const apiDeleteResolutionArgumentsSchema: ObjectSchema<APIDeleteResolutionArguments> =
  object({
    user_id: string().required(),
    firebase_key: string().required(),
  }).noUnknown(true);

interface APIDeleteResolutionReturn {
  success: boolean;
  reason?: string;
}

const apiDeleteResolutionReturnSchema: ObjectSchema<APIDeleteResolutionReturn> =
  object({ success: boolean().required(), reason: string().optional() });

// Goal
interface Goal {
  description: string;
  complete: boolean;
}

const goalSchema: ObjectSchema<Goal> = object({
  description: string().required(),
  complete: boolean().required(),
});

export {
  // Resolution CRUD
  Resolution,
  resolutionSchema,
  APICreateResolutionArguments,
  apiCreateResolutionArgumentsSchema,
  APICreateResolutionReturn,
  apiCreateResolutionReturnSchema,
  APIReadResolutionArguments,
  apiReadResolutionArgumentsSchema,
  APIReadResolutionReturn,
  APIUpdateResolutionArguments,
  apiUpdateResolutionArgumentsSchema,
  APIUpdateResolutionReturn,
  apiUpdateResolutionReturnSchema,
  APIDeleteResolutionArguments,
  apiDeleteResolutionArgumentsSchema,
  APIDeleteResolutionReturn,
  apiDeleteResolutionReturnSchema,

  // Goal CRUD
  Goal,
  goalSchema,
};
