/// <reference types="vite/client" />

// (optional) be explicit
interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_PRESET: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
