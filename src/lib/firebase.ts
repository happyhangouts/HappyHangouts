import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

export const OFFICIAL_PHONE = "7217813236";
export const OFFICIAL_WHATSAPP_PHONE = "917217813236";
export const OFFICIAL_EMAIL = "happyhangouts.life@gmail.com";
export const ADMIN_EMAIL = "happyhangouts.life@gmail.com";
export const ADMIN_EMAILS = ["happyhangouts.life@gmail.com", "mubaarqaan@gmail.com"];

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Startup connectivity verification per firebase-integration-rpc reference
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Strict volumetric bounds synced with firebase-blueprint.json & firestore.rules
export const FIELD_LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 120,
  PHONE_MAX: 20,
  HUB_MAX: 120,
  BIO_MAX: 300,
  UPI_MAX: 80,
  EXPERIENCE_MAX: 140,
  VENUE_MAX: 160,
  CANCEL_REASON_MAX: 200,
  ID_REGEX: /^[a-zA-Z0-9_\-]+$/,
  LAST4_REGEX: /^[0-9]{4}$/,
};

export function clampString(val: string, maxLen: number): string {
  return val.trim().slice(0, maxLen);
}

export function normalizeDocId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_\-]/g, "_").slice(0, 120);
  return cleaned.length >= 2 ? cleaned : `id_${Date.now()}`;
}

export type DurationKey = "30m" | "1h" | "2h";

export function getPricingBreakdown(durationKey: DurationKey, _isTrialEligible: boolean = false) {
  const map: Record<
    DurationKey,
    { label: "30 min" | "1 hr" | "2 hrs"; standardPriceInr: number; partnerShare: number; platformFee: number }
  > = {
    "30m": { label: "30 min", standardPriceInr: 99, partnerShare: 79, platformFee: 20 },
    "1h": { label: "1 hr", standardPriceInr: 199, partnerShare: 159, platformFee: 40 },
    "2h": { label: "2 hrs", standardPriceInr: 449, partnerShare: 359, platformFee: 90 },
  };
  const cfg = map[durationKey];
  return {
    durationKey,
    durationLabel: cfg.label,
    standardPriceInr: cfg.standardPriceInr,
    isFirstFreeApplied: false,
    chargedPriceInr: cfg.standardPriceInr,
    partnerPayoutInr: cfg.partnerShare,
    platformFeeInr: cfg.platformFee,
  };
}
