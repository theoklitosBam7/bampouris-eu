const routeSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const RESERVED_ROUTE_SEGMENTS = new Set([
  "glossary",
  "index",
  "resources",
]);

export const isSafeRouteSegment = (segment: string) =>
  routeSegmentPattern.test(segment) && !RESERVED_ROUTE_SEGMENTS.has(segment);

export const getRouteSegmentError = (segment: string) =>
  RESERVED_ROUTE_SEGMENTS.has(segment)
    ? `Route segment "${segment}" is reserved.`
    : `Route segment "${segment}" must contain only lower-case letters, numbers, and single hyphens.`;
