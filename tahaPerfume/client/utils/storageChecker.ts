import { supabase } from "../lib/supabase";

export class StorageChecker {
  static BUCKET = "product-images";

  static async checkStorageSetup(): Promise<{
    bucketExists: boolean;
    canUpload: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    if (!supabase) {
      return {
        bucketExists: false,
        canUpload: false,
        errors: ["Supabase client is not initialized"],
      };
    }

    // ✅ must be logged in (authenticated role) to upload/delete
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!session?.user) {
      return {
        bucketExists: true, // unknown, but don’t block on “exists” checks
        canUpload: false,
        errors: ["Not authenticated. Please login first."],
      };
    }

    // ✅ Real test: upload + remove a tiny file
    const testPath = `healthchecks/test-${Date.now()}.txt`;
    const testFile = new File(["ok"], "test.txt", { type: "text/plain" });

    const { error: uploadErr } = await supabase.storage
      .from(this.BUCKET)
      .upload(testPath, testFile, { upsert: true });

    if (uploadErr) {
      // If the bucket truly doesn't exist, Supabase will say so here
      errors.push(uploadErr.message);

      return {
        bucketExists: !uploadErr.message.toLowerCase().includes("bucket"),
        canUpload: false,
        errors,
      };
    }

    // cleanup (best-effort)
    await supabase.storage.from(this.BUCKET).remove([testPath]);

    return {
      bucketExists: true,
      canUpload: true,
      errors: [],
    };
  }

  static getSetupInstructions(): string[] {
    return [
      `1) Create bucket: "${this.BUCKET}"`,
      "2) Add policies:",
      "- Public SELECT (read)",
      "- Authenticated INSERT/UPDATE/DELETE (write)",
    ];
  }
}
