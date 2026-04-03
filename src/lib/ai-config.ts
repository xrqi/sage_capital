export interface AIConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  isConfigured: boolean;  // 是否已配置（url 和 key 都不为空）
}

export function getAIConfig(): AIConfig {
  const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || '';
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
  const model = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-3.5-turbo';
  
  return {
    apiUrl,
    apiKey,
    model,
    isConfigured: !!(apiUrl && apiKey),
  };
}
