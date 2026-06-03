import BaseExportedImage from 'next-image-export-optimizer';
import type { ComponentProps } from 'react';

// next-image-export-optimizer's <ExportedImage> takes the deployment basePath as
// a *prop* (defaulting to '') — it does NOT read it from next.config or the
// nextImageExportOptimizer_basePath env var at runtime. Without it, optimised
// image URLs omit the project subpath and 404 on GitHub Pages
// (https://…/flowsha/). This wrapper injects NEXT_PUBLIC_BASE_PATH for every
// image so the whole app uses the correct prefix in one place. Import this
// instead of 'next-image-export-optimizer' directly.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

type Props = ComponentProps<typeof BaseExportedImage>;

export default function ExportedImage(props: Props) {
  return <BaseExportedImage basePath={basePath} {...props} />;
}
