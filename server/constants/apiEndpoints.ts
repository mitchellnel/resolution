/**
 * Creates a resolution and adds it to the database under the path resolutions/user_id.

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APICreateResolutionArguments, and the return object is interfaces as APICreateResolutionReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

A sample Goal for the newly created Resolution will be created when this endpoint is called.

@body
user_id (string)

title (string)

description (string)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Resolution CRUD Endpoints
 */

const API_CREATE_RESOLUTION_ENDPOINT = "/api/create-resolution";

/**
 * Reads all of the resolutions that belong to a user -- these are located in the database under the path resolutions/user_id

This API must be called by making a GET request on this endpoint to the server (using HTTP). The arguments for the request will be sent as query parameters.

If the the request has extra query parameters than those defined above, an error will not be thrown. If the request lacks any of the query parameters defined above, an error will be thrown.

Note that since Goals are part of a single Resolution object, calling this endpoint will also return the list of Goals associated with each Resolution.

@parameters
user_id (string)

@usage
/api/read-resolution?user_id=\<user_id\>

@returns
A JSON object with a Boolean field indicating read success. If the read failed, then a reason field will be defined with an error message. If the read succeeded, then a resolutions field will be populated with what is essentially map of Firebase RTDB keys to resolution objects -- objects that have a title and description field representing the fields of a resolution.

@group Resolution CRUD Endpoints
*/
const API_READ_RESOLUTION_ENDPOINT = "/api/read-resolution";

/**
 * Updates a specific resolution that belongs to the user -- these are located in the database under the path resolutions/user_id/firebase_key

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APIUpdateResolutionArguments, and the return object is interfaces as APIUpdateResolutionReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

A new_title and a new_description must both be passed to make the update. This should be somewhat trivial to implement on the front-end using the received resolution data.

@body
user_id (string)

firebase_key (string)

new_title (string)

new_description (string)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Resolution CRUD Endpoints
*/
const API_UPDATE_RESOLUTION_ENDPOINT = "/api/update-resolution";

/**
 * Deletes a specific resolution that belongs to the user -- these are located in the database under the path resolutions/user_id

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APIDeleteResolutionArguments, and the return object is interfaces as APIDeleteResolutionReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

@body
user_id (string)

firebase_key (string)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Resolution CRUD Endpoints
*/
const API_DELETE_RESOLUTION_ENDPOINT = "/api/delete-resolution";

//GOAL CRUD

/**
 * Creates a Goal and adds it to the database under the path resolutions/user_id/resolution_key/goals.

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APICreateGoalArguments, and the return object is interfaces as APICreateGoalReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

The description field is required to create a Goal. It cannot be an empty string.

@body
user_id (string)

resolution_key (string)

description (string)

nTimesToAchieve (integer)

@returns
 A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Goal CRUD Endpoints
 */
const API_CREATE_GOAL_ENDPOINT = "/api/create-goal";

/**
 * Reads all of the Goals that belong to a user's Resolution -- these are located in the database under the path resolutions/user_id/resolution_key/goals

This API must be called by making a GET request on this endpoint to the server (using HTTP). The arguments for the request will be sent as query parameters.

If the the request has extra query parameters than those defined above, an error will not be thrown. If the request lacks any of the query parameters defined above, an error will be thrown.

@parameters
user_id (string)

resolution_key (string)

@usage
/api/read-goal?user_id=\<user_id\>&resolution_key=\<resolution_key\>

@returns
A JSON object with a Boolean field indicating read success. If the read failed, then a reason field will be defined with an error message. If the read succeeded, then a goals field will be populated with what is essentially map of Firebase RTDB keys to Goal objects -- objects that have a description and complete field that represent the Goal's description and whether it has been completed, respectively.

@group Goal CRUD Endpoints
*/
const API_READ_GOAL_ENDPOINT = "/api/read-goal";

/**
 * Assigns a Google Calendar Event ID to a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path resolutions/user_id/resolution_key/goals/goal_key/event_id

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APIAssignEventToGoalArguments, and the return object is interfaces as APIAssignEventToGoalReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

@body
user_id (string)

resolution_key (string)

goal_key (string)

event_id (string)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Goal CRUD Endpoints
*/
const API_ASSIGN_EVENT_TO_GOAL_ENDPOINT = "/api/assign-event-to-goal";

/**
 * Decrements the nTimesToAchieve field on a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path resolutions/user_id/resolution_key/goals/goal_key/nTimesToAchieve

This endpoint is only designed to reduce nTimesToAchieve by 1. If the nTimesToAchieve field is already 1, then the endpoint will return an error.

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APIAchieveGoalArguments, and the return object is interfaces as APIAchieveGoalReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

@body
user_id (string)

resolution_key (string)

goal_key (string)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Goal CRUD Endpoints
*/
const API_ACHIEVE_GOAL_ENDPOINT = "/api/achieve-goal";

/**
 * Updates the complete field on a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path resolutions/user_id/resolution_key/goals/goal_key/completed

This endpoint will only work when the nTimesToAchieve field is 1. If the nTimesToAchieve field is not 1, then the endpoint will return an error.

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APICompleteGoalArguments, and the return object is interfaces as APICompleteGoalReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

The completed field must be passed to make the update. It can either be true or false. The API will not automatically flip the Boolean -- the desired completion state must be passed via the arguments.

@body
user_id (string)

resolution_key (string)

goal_key (string)

completed (Boolean)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Goal CRUD Endpoints
*/
const API_COMPLETE_GOAL_ENDPOINT = "/api/complete-goal";

/**
 * Updates the description field on a specific Goal that belongs to a user's Resolution -- this field is located in the database under the path resolutions/user_id/resolution_key/goals/goal_key/description

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

The argument object is interfaced as APIUpdateGoalDescriptionArguments, and the return object is interfaces as APIUpdateGoalDescriptionReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

The new_description field must be passed to make the update. It cannot be an empty string.

@body
user_id (string)

resolution_key (string)

goal_key (string)

new_description (Boolean)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

@group Goal CRUD Endpoints
*/
const API_UPDATE_GOAL_DESCRIPTION_ENDPOINT = "/api/update-goal-description";

/**
 * Deletes a specific Goal that belongs a user's Resolution -- these are located in the database under the path resolutions/user_id/resolution_key/goals

This API must be called by making a POST request on this endpoint to the server (using HTTP). The body of the request will contain the arguments in JSON format.

Returns: a JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.

The argument object is interfaced as APIDeleteGoalArguments, and the return object is interfaces as APIDeleteGoalReturn.

If the body of the request has extra fields than those defined above, an error will not be thrown. If the body of the request lacks any of the fields defined above, an error will be thrown.

@body
user_id (string)

resolution_key (string)

goal_key (string)

@returns
A JSON object with a Boolean field indicating creation success. If the create operation failed, then a reason field will be defined with an error message. If the read succeeded, then this field will not exist.
 
@group Goal CRUD Endpoints
*/
const API_DELETE_GOAL_ENDPOINT = "/api/delete-goal";

export {
  API_CREATE_RESOLUTION_ENDPOINT,
  API_READ_RESOLUTION_ENDPOINT,
  API_UPDATE_RESOLUTION_ENDPOINT,
  API_DELETE_RESOLUTION_ENDPOINT,
  API_CREATE_GOAL_ENDPOINT,
  API_READ_GOAL_ENDPOINT,
  API_ASSIGN_EVENT_TO_GOAL_ENDPOINT,
  API_COMPLETE_GOAL_ENDPOINT,
  API_ACHIEVE_GOAL_ENDPOINT,
  API_UPDATE_GOAL_DESCRIPTION_ENDPOINT,
  API_DELETE_GOAL_ENDPOINT,
};
