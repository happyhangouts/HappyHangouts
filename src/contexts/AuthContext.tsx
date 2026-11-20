import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ADMIN_EMAILS,
  FIELD_LIMITS,
  OperationType,
  auth,
  clampString,
  db,
  googleProvider,
  handleFirestoreError,
  normalizeDocId,
} from "../lib/firebase";

export type UserRole = "seeker" | "partner";
export type UserGender = "female" | "male" | "other";
export type GovtIdType = "Aadhaar" | "PAN" | "Passport" | "Driving License";
export type ActivityCategoryId = "running" | "rackets" | "hike" | "games_cafe" | "photowalk";

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  gender: UserGender;
  city: "Gurugram" | "Delhi";
  preferredHub: string;
  govtIdType: GovtIdType;
  govtIdLast4: string;
  emergencyContact: string;
  interests: string[];
  kycVerified: boolean;
  freeHangoutUsed: boolean;
  upiId?: string;
  bio?: string;
  suspended?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PartnerSignupExtra {
  activityCategory: ActivityCategoryId;
  experienceTitle: string;
  bio: string;
  upiHandleMasked: string;
  availableSlots: string[];
}

export interface ProfileFormSubmission {
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  gender: UserGender;
  city: "Gurugram" | "Delhi";
  preferredHub: string;
  govtIdType: GovtIdType;
  govtIdLast4: string;
  emergencyContact: string;
  interests: string[];
  partnerExtra?: PartnerSignupExtra;
}

interface AuthContextValue {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  authReady: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<{ user: User; hasProfile: boolean }>;
  saveProfileAfterAuth: (
    user: User,
    data: ProfileFormSubmission
  ) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const isAdmin = Boolean(
    firebaseUser?.emailVerified &&
      firebaseUser.email &&
      ADMIN_EMAILS.includes(firebaseUser.email.toLowerCase())
  );

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (!user) {
        setUserProfile(null);
        setAuthReady(true);
        return;
      }

      const userPath = `users/${user.uid}`;
      unsubProfile = onSnapshot(
        doc(db, "users", user.uid),
        (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
          setAuthReady(true);
        },
        (error) => {
          setAuthReady(true);
          handleFirestoreError(error, OperationType.GET, userPath);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const uid = cred.user.uid;
    const path = `users/${uid}`;
    try {
      const existingSnap = await getDoc(doc(db, "users", uid));
      if (existingSnap.exists()) {
        const profile = existingSnap.data() as UserProfile;
        setUserProfile(profile);
        return { user: cred.user, hasProfile: true };
      }
      return { user: cred.user, hasProfile: false };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  const saveProfileAfterAuth = async (
    user: User,
    form: ProfileFormSubmission
  ): Promise<UserProfile> => {
    const uid = user.uid;
    const userPath = `users/${uid}`;
    const cleanPhone = form.phone.replace(/[^\d+]/g, "").slice(0, FIELD_LIMITS.PHONE_MAX);
    const cleanEmergency = form.emergencyContact
      .replace(/[^\d+]/g, "")
      .slice(0, FIELD_LIMITS.PHONE_MAX);
    const cleanLast4 = form.govtIdLast4.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
    const safeInterests = (form.interests.length > 0 ? form.interests : ["Running buddy"])
      .slice(0, 5)
      .map((item) => clampString(item, 60));

    let existingData: UserProfile | null = null;
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) existingData = snap.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, userPath);
    }

    const basePayload = {
      uid,
      role: form.role,
      name: clampString(form.name, FIELD_LIMITS.NAME_MAX),
      email: clampString(user.email || form.email, FIELD_LIMITS.EMAIL_MAX),
      phone: cleanPhone.length >= 10 ? cleanPhone : "9876543210",
      gender: form.gender,
      city: form.city,
      preferredHub: clampString(form.preferredHub, FIELD_LIMITS.HUB_MAX),
      govtIdType: form.govtIdType,
      govtIdLast4: FIELD_LIMITS.LAST4_REGEX.test(cleanLast4) ? cleanLast4 : "0000",
      emergencyContact: cleanEmergency.length >= 10 ? cleanEmergency : "9876543211",
      interests: safeInterests,
      kycVerified: existingData ? existingData.kycVerified : false,
      freeHangoutUsed: existingData ? existingData.freeHangoutUsed : false,
      ...(form.partnerExtra?.upiHandleMasked
        ? { upiId: clampString(form.partnerExtra.upiHandleMasked, FIELD_LIMITS.UPI_MAX) }
        : {}),
      ...(form.partnerExtra?.bio
        ? { bio: clampString(form.partnerExtra.bio, FIELD_LIMITS.BIO_MAX) }
        : {}),
      updatedAt: serverTimestamp(),
    };

    try {
      if (existingData) {
        await updateDoc(doc(db, "users", uid), {
          role: basePayload.role,
          name: basePayload.name,
          phone: basePayload.phone,
          gender: basePayload.gender,
          city: basePayload.city,
          preferredHub: basePayload.preferredHub,
          govtIdType: basePayload.govtIdType,
          govtIdLast4: basePayload.govtIdLast4,
          emergencyContact: basePayload.emergencyContact,
          interests: basePayload.interests,
          ...(basePayload.upiId ? { upiId: basePayload.upiId } : {}),
          ...(basePayload.bio ? { bio: basePayload.bio } : {}),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "users", uid), {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(
        error,
        existingData ? OperationType.UPDATE : OperationType.CREATE,
        userPath
      );
    }

    // If user applied as a Hangout Partner, register/sync their /partners/{partnerId} document
    if (form.role === "partner") {
      const partnerId = normalizeDocId(`partner_${uid}`);
      const partnerPath = `partners/${partnerId}`;
      const extra = form.partnerExtra || {
        activityCategory: "rackets",
        experienceTitle: `${form.city} ${safeInterests[0] || "Curated Hangout"} Session`,
        bio: "Verified NCR Hangout Partner hosting small structured offline experiences.",
        upiHandleMasked: "",
        availableSlots: ["Weekday evenings", "Saturday morning"],
      };

      try {
        const existingPartner = await getDoc(doc(db, "partners", partnerId));
        if (existingPartner.exists()) {
          await updateDoc(doc(db, "partners", partnerId), {
            hub: clampString(form.preferredHub, FIELD_LIMITS.HUB_MAX),
            experienceTitle: clampString(extra.experienceTitle, FIELD_LIMITS.EXPERIENCE_MAX),
            bio: clampString(extra.bio, FIELD_LIMITS.BIO_MAX),
            availableSlots: extra.availableSlots.slice(0, 5),
            upiHandleMasked: clampString(extra.upiHandleMasked, FIELD_LIMITS.UPI_MAX),
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(doc(db, "partners", partnerId), {
            partnerId,
            ownerUid: uid,
            displayName: clampString(form.name, FIELD_LIMITS.NAME_MAX),
            gender: form.gender,
            city: form.city,
            hub: clampString(form.preferredHub, FIELD_LIMITS.HUB_MAX),
            activityCategory: extra.activityCategory,
            experienceTitle: clampString(extra.experienceTitle, FIELD_LIMITS.EXPERIENCE_MAX),
            bio: clampString(extra.bio, FIELD_LIMITS.BIO_MAX),
            rating: 5.0,
            totalSessions: 0,
            womenOnlyEligible: form.gender === "female",
            kycStatus: "pending",
            active: false,
            availableSlots: extra.availableSlots.slice(0, 5),
            upiHandleMasked: clampString(extra.upiHandleMasked, FIELD_LIMITS.UPI_MAX),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, partnerPath);
      }
    }

    // Read fresh snapshot for immediate state availability
    try {
      const refreshed = await getDoc(doc(db, "users", uid));
      const profile = refreshed.data() as UserProfile;
      setUserProfile(profile);
      return profile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, userPath);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        authReady,
        isAdmin,
        signInWithGoogle,
        saveProfileAfterAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
