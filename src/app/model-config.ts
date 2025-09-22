// Frontend model feature flag and hint
// Note: This is a client-side feature flag placeholder. There is no backend API in this project
// that selects an OpenAI model today. To actually use a different model (for example gpt-5-mini),
// your server-side API client must read a server config / environment variable and pass the
// model name to the OpenAI call. Use this file as a single import point in the frontend so
// UI code can display which model is intended or send it to a backend endpoint when implemented.

export const MODEL_CONFIG = {
  // When true, UI and clients should prefer gpt-5-mini where supported.
  enableGpt5Mini: true,
  // The model name to use when the flag is enabled.
  modelName: 'gpt-5-mini',
  // Short guidance for maintainers.
  notes:
    'Frontend flag only. Implement server-side reading of an env/config value and use that when calling OpenAI.'
};


