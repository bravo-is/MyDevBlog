/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type HardcoverEnv = {
  readonly HARDCOVER_API_TOKEN?: string;
};

interface ImportMetaEnv extends HardcoverEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
