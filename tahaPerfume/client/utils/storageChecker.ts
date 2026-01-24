import { supabase, isSupabaseConfigured } from "../lib/supabase";

export class StorageChecker {
  static async checkStorageSetup(): Promise<{
    isConfigured: boolean;
    bucketExists: boolean;
    canUpload: boolean;
    errors: string[];
  }> {
    const result = {
      isConfigured: isSupabaseConfigured,
      bucketExists: false,
      canUpload: false,
      errors: [] as string[],
    };

    if (!isSupabaseConfigured || !supabase) {
      result.errors.push("Supabase not configured");
      return result;
    }

    try {
      // Check if bucket exists
      const { data: buckets, error: bucketError } =
        await supabase.storage.listBuckets();

      if (bucketError) {
        result.errors.push(`Failed to list buckets: ${bucketError.message}`);
        return result;
      }

      const bucket = buckets?.find((b) => b.name === "product-images");
      if (bucket) {
        result.bucketExists = true;
        console.log('✅ Storage bucket "product-images" exists');
      } else {
        result.errors.push('❌ Storage bucket "product-images" does not exist');
        return result;
      }

      // Test upload capability with a small test file
      const testFile = new File(["test"], "test.txt", { type: "text/plain" });
      const testPath = `test-${Date.now()}.txt`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(testPath, testFile);

      if (uploadError) {
        result.errors.push(`Upload test failed: ${uploadError.message}`);

        // Provide specific guidance based on error
        if (
          uploadError.message.includes(
            "new row violates row-level security policy",
          )
        ) {
          result.errors.push(
            "💡 Fix: Set up storage policies in Supabase Dashboard → Storage → Policies",
          );
        } else if (uploadError.message.includes("Bucket not found")) {
          result.errors.push(
            '💡 Fix: Create "product-images" bucket in Supabase Dashboard → Storage',
          );
        }
      } else {
        result.canUpload = true;
        console.log("✅ Storage upload test successful");

        // Clean up test file
        await supabase.storage.from("product-images").remove([testPath]);
      }
    } catch (error) {
      result.errors.push(
        `Storage check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    return result;
  }

  static getSetupInstructions(): string[] {
    return [
      "1. Go to your Supabase Dashboard → Storage",
      "2. Click 'Create a new bucket'",
      "3. Bucket name: 'product-images'",
      "4. Public bucket: ✅ Check this box",
      "5. Click 'Create bucket'",
      "6. Go to Storage → Policies",
      "7. Create policy for 'Objects in product-images':",
      "   - Allow SELECT for everyone",
      "   - Allow INSERT/UPDATE/DELETE for authenticated users",
    ];
  }
}
