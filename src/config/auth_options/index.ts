import { VendureConfig } from "@vendure/core";
import { getEnvs } from "../../getEnvs";

const { SUPERADMIN_PASSWORD, SUPERADMIN_USERNAME, COOKIE_SECRET, APP_ENV } = getEnvs();

export const authOptions: VendureConfig["authOptions"] = {
  tokenMethod: ["bearer", "cookie"],
  superadminCredentials: {
    identifier: SUPERADMIN_USERNAME,
    password: SUPERADMIN_PASSWORD,
  },
  cookieOptions: {
    secret: COOKIE_SECRET,
    domain: "gutricious.store",
    sameSite: "none",
    // secure: true,
    secureProxy: true,
    httpOnly: false,
    // ...(APP_ENV !== "dev" && { domain: ".aexol.com", sameSite: "lax" }), // Use APP_ENV directly from destructured getEnvs()
  },
};
