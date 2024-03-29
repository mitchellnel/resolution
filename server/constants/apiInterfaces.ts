import { object, string, boolean, number, ObjectSchema } from "yup";

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
  nTimesToAchieve: number;
  completed: boolean;
}

const goalSchema: ObjectSchema<Goal> = object({
  description: string().required(),
  nTimesToAchieve: number().required(),
  completed: boolean().required(),
});

// /api/create-goal
interface APICreateGoalArguments {
  user_id: string;
  resolution_key: string;
  description: string;
  nTimesToAchieve: number;
}

const apiCreateGoalArgumentsSchema: ObjectSchema<APICreateGoalArguments> =
  object({
    user_id: string().required(),
    resolution_key: string().required(),
    description: string().required(),
    nTimesToAchieve: number().required(),
  }).noUnknown(true);

interface APICreateGoalReturn {
  success: boolean;
  goal_key?: string;
  reason?: string;
}

const apiCreateGoalReturnSchema: ObjectSchema<APICreateResolutionReturn> =
  object({
    success: boolean().required(),
    goal_key: string().optional(),
    reason: string().optional(),
  });

// /api/read-goal
interface APIReadGoalArguments {
  user_id: string;
  resolution_key: string;
}

const apiReadGoalArgumentsSchema: ObjectSchema<APIReadGoalArguments> = object({
  user_id: string().required(),
  resolution_key: string().required(),
}).noUnknown(true);

interface APIReadGoalReturn {
  success: boolean;
  goals?: { [key: string]: Goal | undefined };
  reason?: string;
}

// /api/assign-event-to-goal
interface APIAssignEventToGoalArguments {
  user_id: string;
  resolution_key: string;
  goal_key: string;
  event_id: string;
}

const apiAssignEventToGoalArgumentsSchema: ObjectSchema<APIAssignEventToGoalArguments> =
  object({
    user_id: string().required(),
    resolution_key: string().required(),
    goal_key: string().required(),
    event_id: string().required(),
  }).noUnknown(true);

interface APIAssignEventToGoalReturn {
  success: boolean;
  reason?: string;
}

// /api/achieve-goal
interface APIAchieveGoalArguments {
  user_id: string;
  resolution_key: string;
  goal_key: string;
}

const apiAchieveGoalArgumentsSchema: ObjectSchema<APIAchieveGoalArguments> =
  object({
    user_id: string().required(),
    resolution_key: string().required(),
    goal_key: string().required(),
  }).noUnknown(true);

interface APIAchieveGoalReturn {
  success: boolean;
  reason?: string;
}

// /api/complete-goal
interface APICompleteGoalArguments {
  user_id: string;
  resolution_key: string;
  goal_key: string;
  completed: boolean;
}

const apiCompleteGoalArgumentsSchema: ObjectSchema<APICompleteGoalArguments> =
  object({
    user_id: string().required(),
    resolution_key: string().required(),
    goal_key: string().required(),
    completed: boolean().required(),
  }).noUnknown(true);

interface APICompleteGoalReturn {
  success: boolean;
  reason?: string;
}

// /api/update-goal-description
interface APIUpdateGoalDescriptionArguments {
  user_id: string;
  resolution_key: string;
  goal_key: string;
  new_description: string;
}

const apiUpdateGoalDescriptionArgumentsSchema: ObjectSchema<APIUpdateGoalDescriptionArguments> =
  object({
    user_id: string().required(),
    resolution_key: string().required(),
    goal_key: string().required(),
    new_description: string().required(),
  }).noUnknown(true);

interface APIUpdateGoalDescriptionReturn {
  success: boolean;
  reason?: string;
}

// /api/delete-goal
interface APIDeleteGoalArguments {
  user_id: string;
  resolution_key: string;
  goal_key: string;
}

const apiDeleteGoalArgumentsSchema: ObjectSchema<APIDeleteGoalArguments> =
  object({
    user_id: string().required(),
    resolution_key: string().required(),
    goal_key: string().required(),
  }).noUnknown(true);

interface APIDeleteGoalReturn {
  success: boolean;
  reason?: string;
}

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
  APICreateGoalArguments,
  apiCreateGoalArgumentsSchema,
  APICreateGoalReturn,
  apiCreateGoalReturnSchema,
  APIReadGoalArguments,
  apiReadGoalArgumentsSchema,
  APIReadGoalReturn,
  APIAssignEventToGoalArguments,
  apiAssignEventToGoalArgumentsSchema,
  APIAssignEventToGoalReturn,
  APIAchieveGoalArguments,
  apiAchieveGoalArgumentsSchema,
  APIAchieveGoalReturn,
  APICompleteGoalArguments,
  apiCompleteGoalArgumentsSchema,
  APICompleteGoalReturn,
  APIUpdateGoalDescriptionArguments,
  apiUpdateGoalDescriptionArgumentsSchema,
  APIUpdateGoalDescriptionReturn,
  APIDeleteGoalArguments,
  apiDeleteGoalArgumentsSchema,
  APIDeleteGoalReturn,
};
