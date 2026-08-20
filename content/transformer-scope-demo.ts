export const transformerScopeDemo = {
  status: {
    model: "GPT-2-small",
    parameters: "124.4M",
    layers: 12,
    headsPerLayer: 12,
    execution: "Precomputed static portfolio sample"
  },
  prompt: "The capital of France is",
  predictions: [
    { token: " the", probability: 0.084593 },
    { token: " now", probability: 0.047945 },
    { token: " a", probability: 0.046158 },
    { token: " France", probability: 0.032377 },
    { token: " Paris", probability: 0.032245 }
  ],
  attention: {
    layer: 3,
    head: 11,
    queryToken: " is",
    peakAttention: 0.824079,
    sources: [
      { token: "The", weight: 0.086535 },
      { token: " capital", weight: 0.824079 },
      { token: " of", weight: 0.058495 },
      { token: " France", weight: 0.00726 },
      { token: " is", weight: 0.023631 }
    ],
    note: "Attention weights show where a head reads, not whether that read caused the output."
  },
  logitLens: [
    { stage: 0, token: " destro", probability: 0.532703 },
    { stage: 1, token: " not", probability: 0.332223 },
    { stage: 2, token: " now", probability: 0.270868 },
    { stage: 3, token: " now", probability: 0.366201 },
    { stage: 4, token: " now", probability: 0.514926 },
    { stage: 5, token: " now", probability: 0.626903 },
    { stage: 6, token: " now", probability: 0.551665 },
    { stage: 7, token: " now", probability: 0.572369 },
    { stage: 8, token: " now", probability: 0.689096 },
    { stage: 9, token: " now", probability: 0.422659 },
    { stage: 10, token: " France", probability: 0.621242 },
    { stage: 11, token: " France", probability: 0.242425 },
    { stage: 12, token: " the", probability: 0.084591 }
  ],
  ablation: {
    layer: 11,
    head: 2,
    target: " Paris",
    baselineProbability: 0.032245,
    ablatedProbability: 0.024848,
    probabilityDelta: -0.007397,
    logitDelta: -0.258545,
    note: "This is one fixed intervention result, not evidence of a universal component function."
  }
};
