import { object, string, boolean, ObjectSchema } from "yup";

interface Resolution {
  title: string;
  description: string;
}

const resolutionSchema: ObjectSchema<Resolution> = object({
  title: string().required(),
  description: string().defined(),
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
}

const apiCreateResolutionReturnSchema: ObjectSchema<APICreateResolutionReturn> =
  object({ success: boolean().required() });

// /api/read-resolution
interface APIReadResolutionArguments {
  user_id: string;
}

interface APIReadResolutionReturn {
  [key: string]: Resolution | undefined;
}

// /api/update-resolution
interface APIUpdateResolutionArguments {
  user_id: string;
  firebase_key: string;
  new_title: string;
  new_description: string;
}

const apiUpdateResolutionArgumentsSchema: ObjectSchema<APIUpdateResolutionArguments> =
  object({
    user_id: string().required(),
    firebase_key: string().required(),
    new_title: string().required(),
    new_description: string().defined(),
  }).noUnknown(true);

interface APIUpdateResolutionReturn {
  success: boolean;
}

const apiUpdateResolutionReturnSchema: ObjectSchema<APICreateResolutionReturn> =
  object({ success: boolean().required() });

// /api/delete-resolution
interface APIDeleteResolutionArguments {
  user_id: string;
  firebase_key: string;
}

const apiDeleteResolutionArgumentsSchema: ObjectSchema<APIDeleteResolutionArguments> =
  object({ user_id: string().required(), firebase_key: string().required() });

interface APIDeleteResolutionReturn {
  success: boolean;
}

const apiDeleteResolutionReturnSchema: ObjectSchema<APIUpdateResolutionReturn> =
  object({ success: boolean().required() });

export {
  Resolution,
  resolutionSchema,
  APICreateResolutionArguments,
  apiCreateResolutionArgumentsSchema,
  APICreateResolutionReturn,
  apiCreateResolutionReturnSchema,
  APIReadResolutionArguments,
  APIReadResolutionReturn,
  APIUpdateResolutionArguments,
  apiUpdateResolutionArgumentsSchema,
  APIUpdateResolutionReturn,
  apiUpdateResolutionReturnSchema,
  APIDeleteResolutionArguments,
  apiDeleteResolutionArgumentsSchema,
  APIDeleteResolutionReturn,
  apiDeleteResolutionReturnSchema,
};
