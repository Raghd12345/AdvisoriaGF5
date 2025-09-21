export const USE_MOCKS = !process.env.NEXT_PUBLIC_CORE_API || !process.env.NEXT_PUBLIC_AI_API;

export const isConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_CORE_API && process.env.NEXT_PUBLIC_AI_API);
};

export const config = {
  coreApi: process.env.NEXT_PUBLIC_CORE_API || '',
  aiApi: process.env.NEXT_PUBLIC_AI_API || '',
  useMocks: USE_MOCKS,
};