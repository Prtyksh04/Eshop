export interface Country {
  name: string;
  code: string;      // ISO 3166-1 alpha-2 code
  dial_code: string; // International dialing code
}

export const countries: Country[] = [
  { name: "India", code: "IN", dial_code: "+91" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "Canada", code: "CA", dial_code: "+1" },
  { name: "Australia", code: "AU", dial_code: "+61" },
  { name: "Germany", code: "DE", dial_code: "+49" },
  { name: "France", code: "FR", dial_code: "+33" },
  { name: "Brazil", code: "BR", dial_code: "+55" },
  { name: "Japan", code: "JP", dial_code: "+81" },
  { name: "China", code: "CN", dial_code: "+86" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "Mexico", code: "MX", dial_code: "+52" },
  { name: "Russia", code: "RU", dial_code: "+7" },
  { name: "Italy", code: "IT", dial_code: "+39" },
  { name: "Netherlands", code: "NL", dial_code: "+31" },
  { name: "Singapore", code: "SG", dial_code: "+65" },
  { name: "Spain", code: "ES", dial_code: "+34" },
  { name: "Indonesia", code: "ID", dial_code: "+62" },
  { name: "Pakistan", code: "PK", dial_code: "+92" },
  { name: "Bangladesh", code: "BD", dial_code: "+880" },
  // Add more countries as needed
];
