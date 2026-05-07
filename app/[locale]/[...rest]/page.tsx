import { notFound, permanentRedirect } from "next/navigation";

// Override layout's force-static. Catch-all needs to run server-side
// per request to evaluate the legacy-pattern check.
export const dynamic = "force-dynamic";

// Legacy thermik.net URL patterns. thermik.net is forwarded via Plesk to
// gleitschirm-tandemflug.com/de/<path>; these paths don't exist on KOFLY,
// so we 308 them to /de to preserve the authority transfer of a 24-year-old
// domain. Anything else stays a 404.
const LEGACY_THERMIK_PATTERNS = [
  /^archives(\/.*)?$/,
  /^abenteuer-tandemfliegen-/,
  /^page\/\d+\/?$/,
  /^links(\/.*)?$/,
  /^\d{4,}\/?$/,
];

type Props = {
  params: Promise<{ locale: string; rest: string[] }>;
};

export default async function CatchAll({ params }: Props) {
  const { rest } = await params;
  const path = rest.join("/");
  if (LEGACY_THERMIK_PATTERNS.some((p) => p.test(path))) {
    permanentRedirect("/de");
  }
  notFound();
}
