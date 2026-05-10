
const KEYWORD_RULES = [

  // cybersecurity
  {
    keyword: "breach",
    category: "cybersecurity",
    weight: 9
  },

  {
    keyword: "ransomware",
    category: "cybersecurity",
    weight: 10
  },

  {
    keyword: "exploit",
    category: "cybersecurity",
    weight: 8
  },

  // finance
  {
    keyword: "funding",
    category: "finance",
    weight: 7
  },

  {
    keyword: "acquisition",
    category: "finance",
    weight: 8
  },

  {
    keyword: "bankruptcy",
    category: "finance",
    weight: 9
  },

  // market stress
  {
    keyword: "layoffs",
    category: "market",
    weight: 8
  },

  {
    keyword: "lawsuit",
    category: "legal",
    weight: 7
  }
];

export function analyzeSignals(
  content: string
) {

  const lower =
    content.toLowerCase();

  let category =
    "general";

  let importance = 1;

  const matchedTags:
    string[] = [];

  for (const rule of KEYWORD_RULES) {

    if (
      lower.includes(
        rule.keyword
      )
    ) {

      matchedTags.push(
        rule.keyword
      );

      category =
        rule.category;

      importance +=
        rule.weight;
    }
  }

  return {
    category,
    importance,
    tags: matchedTags
  };
}

