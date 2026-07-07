export interface BankEntry {
  code: string;
  name: string;
}

// Hardcoded list matching backend src/config/banks.ts — sorted alphabetically
// This avoids a network round-trip and works regardless of auth state.
const BANKS: BankEntry[] = [
  { name: "Access Bank",                      code: "044"    },
  { name: "Citibank Nigeria",                 code: "023"    },
  { name: "Ecobank Nigeria",                  code: "050"    },
  { name: "Fidelity Bank",                    code: "070"    },
  { name: "First Bank of Nigeria",            code: "011"    },
  { name: "First City Monument Bank (FCMB)",  code: "214"    },
  { name: "Guaranty Trust Bank",              code: "058"    },
  { name: "Heritage Bank",                    code: "030"    },
  { name: "Jaiz Bank",                        code: "301"    },
  { name: "Keystone Bank",                    code: "082"    },
  { name: "Kuda Bank",                        code: "090267" },
  { name: "Moniepoint Microfinance Bank",     code: "090405" },
  { name: "Nomba",                            code: "100002" },
  { name: "OPay Digital Services",            code: "999992" },
  { name: "PalmPay",                          code: "999991" },
  { name: "Polaris Bank",                     code: "076"    },
  { name: "Providus Bank",                    code: "101"    },
  { name: "Stanbic IBTC Bank",               code: "221"    },
  { name: "Standard Chartered Bank",          code: "068"    },
  { name: "Sterling Bank",                    code: "232"    },
  { name: "SunTrust Bank",                    code: "100"    },
  { name: "Titan Trust Bank",                 code: "102"    },
  { name: "Union Bank of Nigeria",            code: "032"    },
  { name: "United Bank for Africa (UBA)",     code: "033"    },
  { name: "Unity Bank",                       code: "215"    },
  { name: "VFD Microfinance Bank",            code: "090110" },
  { name: "Wema Bank",                        code: "035"    },
  { name: "Zenith Bank",                      code: "057"    },
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Returns the full list of Nigerian banks with their Nomba bank codes.
 * No network request — instantaneous, works offline.
 */
export function useBanks() {
  return { banks: BANKS, isLoading: false };
}
