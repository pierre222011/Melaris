export const MAX_COINS_PER_EURO = 300;

export const AI_ACTIONS_COST = {
  CHAT_SIMPLE: 2,
  REPONSE_LONGUE: 4,
  GEN_CODE: 5,
  ANALYSE_FICHIER: 8,
  GEN_IMAGE: 25,
};

export const SUBSCRIPTION_PLANS = {
  free: { priceEur: 0, coinsPerMonth: 50 },
  pro: { priceEur: 9.99, coinsPerMonth: 800 },
  premium: { priceEur: 19.99, coinsPerMonth: 2000 }
};

export const PACKS = {
  starter: { priceEur: 4.99, coins: 300 },
  basic: { priceEur: 9.99, coins: 650 },
  plus: { priceEur: 19.99, coins: 1500 },
  large: { priceEur: 39.99, coins: 3500 }
};

/**
 * Validates that no product violates the maximum coins per euro rule.
 * This runs at build time or when explicitly called to ensure profitability.
 */
export function validateProfitabilityRules() {
  const check = (price: number, coins: number, name: string) => {
    if (price === 0) return; // Free plans are exempt
    const ratio = coins / price;
    if (ratio > MAX_COINS_PER_EURO) {
      throw new Error(`CRITICAL: Profitability rule broken for ${name}. Ratio is ${ratio.toFixed(2)} coins/€. Limit is ${MAX_COINS_PER_EURO}.`);
    }
  };

  Object.entries(SUBSCRIPTION_PLANS).forEach(([key, plan]) => {
    check(plan.priceEur, plan.coinsPerMonth, `Subscription ${key}`);
  });

  Object.entries(PACKS).forEach(([key, pack]) => {
    check(pack.priceEur, pack.coins, `Pack ${key}`);
  });
}

// Call validation immediately to ensure backend crashes if misconfigured
validateProfitabilityRules();
