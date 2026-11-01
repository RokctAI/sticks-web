/**
 * Host-owned platform constants seam. Named in auth_sdk's manifest
 * `requires`; read by its `components/custom/auth-form.tsx`
 * (`PLATFORM_NAME`, `VOUCHER_OFFSET_Y`) and re-exported wholesale by
 * `app/config/platform.ts`, the way RokctAI/rokctai_frontend's copy is.
 *
 * Deliberately NEUTRAL. rokctai_frontend hardcodes its product name here;
 * this shell derives it from `app/site.ts`, the single source of truth it
 * already ships (NEXT_PUBLIC_SITE_NAME, else the app_type), so composing
 * SDKs cannot change what the public site calls itself. Everything the
 * PRODUCT says about itself - the <title>, the description, the cards - is
 * the home SDK's, registered into base_sdk's site-metadata registry at
 * compose time. No product copy lives in this shell.
 *
 * The layout numbers keep rokctai_frontend's values: nothing in this shell
 * renders the country superscript they position (the neutral
 * `components/custom/branding.tsx` prints the plain wordmark), so they are
 * here only so SDK code that imports them by name resolves.
 */
import { SITE_NAME } from "@/app/site";

export const PLATFORM_NAME = SITE_NAME;
export const LEGAL_COMPANY_NAME = "ROKCT INTELLIGENCE (PTY) LTD";

/**
 * UI Configuration for the "Use Voucher" banner.
 */
export const VOUCHER_OFFSET_Y = "6";

/**
 * Branding Configuration for the Country Code.
 * Centralize all "Position" adjustments here:
 */
export const BRANDING_COUNTRY_INDEX = PLATFORM_NAME.length; // Insertion position (0=prefix, name length=suffix)
export const BRANDING_COUNTRY_Y_OFFSET = "-0.2em"; // Sits at cap-height, not above
export const BRANDING_COUNTRY_SCALE = "0.28em"; // Noticeably small superscript
