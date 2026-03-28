export interface CatalogPhase {
  name: string;
  slug: string;
  args: unknown;
}

export interface CatalogStar {
  title: string;
  slug: string;
  filePath: string;
  componentPath: string;
  phases: CatalogPhase[];
}

export interface CatalogConstellation {
  name: string;
  slug: string;
  stars: CatalogStar[];
}

export interface StarCatalog {
  constellations: CatalogConstellation[];
}
