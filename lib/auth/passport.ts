import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

let isPassportConfigured = false;

export function getPassport() {
  if (isPassportConfigured) return passport;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${APP_URL}/api/auth/google/callback`,
        },
        async (
          _accessToken: string,
          _refreshToken: string,
          profile: Profile,
          done: VerifyCallback
        ) => {
          try {
            const email = profile.emails?.[0]?.value || "";
            const name = profile.displayName || "Google User";
            const image = profile.photos?.[0]?.value;

            // Determine role: official if email contains gov / official domains or specific list
            const isOfficial =
              email.endsWith(".gov") ||
              email.endsWith(".gov.in") ||
              email.endsWith("@govtrace.internal") ||
              email.includes("official");

            const user = {
              userId: `google_${profile.id}`,
              name,
              email,
              image,
              role: isOfficial ? ("official" as const) : ("citizen" as const),
            };

            return done(null, user);
          } catch (err) {
            return done(err as Error);
          }
        }
      )
    );
  }

  isPassportConfigured = true;
  return passport;
}

export { passport };
