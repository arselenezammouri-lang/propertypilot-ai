import type { MetadataRoute } from 'next';
import { buildRobotsMetadata } from '@/lib/seo/build-robots';

export default function robots(): MetadataRoute.Robots {
  return buildRobotsMetadata();
}
