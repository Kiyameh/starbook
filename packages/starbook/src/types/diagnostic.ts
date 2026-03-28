export interface CatalogDiagnostic {
  type: 'error' | 'warning';
  filePath: string;
  message: string;
}
