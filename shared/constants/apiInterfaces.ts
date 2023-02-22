interface Resolution {
  title: string;
  description: string;
}

// /api/create-resolution
interface APICreateResolutionArguments {
  user_id: string;
  title: string;
  description: string;
}

interface APICreateResolutionReturn {
  success: boolean;
}

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
