import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  DurationKey,
  FIELD_LIMITS,
  OperationType,
  clampString,
  db,
  getPricingBreakdown,
  handleFirestoreError,
  normalizeDocId,
} from "./firebase";
import { ActivityCategoryId, UserGender } from "../contexts/AuthContext";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "expired";

export interface BookingRecord {
  bookingId: string;
  seekerUid: string;
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  seekerGender: UserGender;
  partnerId: string;
  partnerUid: string;
  partnerName: string;
  activityId: ActivityCategoryId;
  experienceTitle: string;
  venue: string;
  dayLabel: string;
  startHour: string;
  slotLabel: string;
  durationKey: DurationKey;
  durationLabel: "30 min" | "1 hr" | "2 hrs";
  standardPriceInr: number;
  chargedPriceInr: number;
  isFirstFree: boolean;
  partnerPayoutInr: number;
  platformFeeInr: number;
  womenOnly: boolean;
  womenOnlyConfirmed: boolean;
  advanceRuleAck: boolean;
  happyKeyPin: string;
  status: BookingStatus;
  cancelReason?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PartnerRecord {
  partnerId: string;
  ownerUid: string;
  displayName: string;
  gender: UserGender;
  city: "Gurugram" | "Delhi";
  hub: string;
  activityCategory: ActivityCategoryId;
  experienceTitle: string;
  bio?: string;
  rating: number;
  totalSessions: number;
  womenOnlyEligible: boolean;
  kycStatus: "pending" | "verified" | "suspended";
  active: boolean;
  availableSlots: string[];
  upiHandleMasked?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function createBookingRecord(input: {
  seekerUid: string;
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  seekerGender: UserGender;
  partnerId: string;
  partnerUid: string;
  partnerName: string;
  activityId: ActivityCategoryId;
  experienceTitle: string;
  venue: string;
  dayLabel: string;
  startHour: string;
  slotLabel: string;
  durationKey: DurationKey;
  isFirstFree: boolean;
  womenOnly: boolean;
  womenOnlyConfirmed: boolean;
}): Promise<BookingRecord> {
  const bookingId = normalizeDocId(`bk_${Date.now()}_${Math.floor(100 + Math.random() * 899)}`);
  const pricing = getPricingBreakdown(input.durationKey, false);
  const happyKeyPin = `HH-${Math.floor(1000 + Math.random() * 9000)}`;

  const payload = {
    bookingId,
    seekerUid: input.seekerUid,
    seekerName: clampString(input.seekerName, FIELD_LIMITS.NAME_MAX),
    seekerPhone: clampString(input.seekerPhone.replace(/[^\d+]/g, ""), FIELD_LIMITS.PHONE_MAX) || "9876543210",
    seekerEmail: clampString(input.seekerEmail, FIELD_LIMITS.EMAIL_MAX),
    seekerGender: input.seekerGender,
    partnerId: normalizeDocId(input.partnerId),
    partnerUid: normalizeDocId(input.partnerUid),
    partnerName: clampString(input.partnerName, FIELD_LIMITS.NAME_MAX),
    activityId: input.activityId,
    experienceTitle: clampString(input.experienceTitle, FIELD_LIMITS.EXPERIENCE_MAX),
    venue: clampString(input.venue, FIELD_LIMITS.VENUE_MAX),
    dayLabel: clampString(input.dayLabel, 60),
    startHour: clampString(input.startHour, 30),
    slotLabel: clampString(input.slotLabel, 60),
    durationKey: pricing.durationKey,
    durationLabel: pricing.durationLabel,
    standardPriceInr: pricing.standardPriceInr,
    chargedPriceInr: pricing.chargedPriceInr,
    isFirstFree: pricing.isFirstFreeApplied,
    partnerPayoutInr: pricing.partnerPayoutInr,
    platformFeeInr: pricing.platformFeeInr,
    womenOnly: input.womenOnly,
    womenOnlyConfirmed: input.womenOnlyConfirmed,
    advanceRuleAck: true,
    happyKeyPin,
    status: "pending" as BookingStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const path = `bookings/${bookingId}`;
  try {
    await setDoc(doc(db, "bookings", bookingId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  return {
    ...payload,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  cancelReason?: string
) {
  const path = `bookings/${bookingId}`;
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (cancelReason !== undefined) {
    updateData.cancelReason = clampString(cancelReason, FIELD_LIMITS.CANCEL_REASON_MAX);
  }
  try {
    await updateDoc(doc(db, "bookings", bookingId), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeSeekerBookings(
  seekerUid: string,
  onData: (rows: BookingRecord[]) => void
) {
  const q = query(
    collection(db, "bookings"),
    where("seekerUid", "==", seekerUid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => d.data() as BookingRecord));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "bookings");
    }
  );
}

export function subscribePartnerBookings(
  partnerUid: string,
  onData: (rows: BookingRecord[]) => void
) {
  const q = query(
    collection(db, "bookings"),
    where("partnerUid", "==", partnerUid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => d.data() as BookingRecord));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "bookings");
    }
  );
}
