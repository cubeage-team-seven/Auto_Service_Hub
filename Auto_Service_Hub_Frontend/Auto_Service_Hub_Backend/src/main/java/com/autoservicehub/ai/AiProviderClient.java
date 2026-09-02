package com.autoservicehub.ai;

/**
 * Abstraction boundary for the external AI provider (SRS 2.1, 7, 18).
 * The React frontend never calls a provider directly; only this backend
 * service does, keeping provider keys and prompts server-side.
 * Implementations (e.g. AnthropicAiProviderClient, OpenAiProviderClient)
 * are selected via `app.ai.provider` (see application.yml).
 */
public interface AiProviderClient {
    AiResult invoke(AiRequest request);
}
