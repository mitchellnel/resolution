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
  resolutions: Resolution[];
}

// /api/update-resolution
interface APIUpdateResolutionArguments {
  user_id: string;
  current_title: string;
  new_title: string;
  new_description: string;
}

interface APIUpdateResolutionReturn {
  success: boolean;
}

// /api/delete-resolution
interface APIDeleteResolutionArguments {
  user_id: string;
  title_to_delete: string;
}

interface APIDeleteResolutionReturn {
  success: boolean;
}

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
  APIUpdateResolutionReturn,
  APIDeleteResolutionArguments,
  APIDeleteResolutionReturn,
};
