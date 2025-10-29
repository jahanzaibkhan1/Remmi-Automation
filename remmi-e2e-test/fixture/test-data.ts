export const LoginUsers = {
  /**
   * Use plain values or fallback for each user. Do not throw or process anything that would skip/abort tests if values are undefined.
   * This helps ensure that if a user is logged out (or has invalid creds), only login or the current test fails, not all remaining tests.
   * Upstream code/tests should handle login errors gracefully.
   */
  sales: {
    email: process.env.E2E_SALES_EMAIL ?? "",
    password: process.env.E2E_SALES_PASSWORD ?? "",
    otpSecret: process.env.E2E_SALES_OTP_SECRET ?? "",
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? "",
    password: process.env.E2E_ADMIN_PASSWORD ?? "",
    otpSecret: process.env.E2E_ADMIN_OTP_SECRET ?? "",
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL ?? "",
    password: process.env.E2E_MANAGER_PASSWORD ?? "",
    otpSecret: process.env.E2E_MANAGER_OTP_SECRET ?? "",
  },
};
