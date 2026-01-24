import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";
import { TestTube, CheckCircle, XCircle } from "lucide-react";

const BUCKET = "product-images";

const StorageTest = () => {
  const { isRTL } = useLanguage();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runStorageTest = async () => {
    setTesting(true);
    setResults([]);
    const logs: string[] = [];

    try {
      if (!supabase) {
        logs.push("❌ Supabase client is null (not configured)");
        setResults(logs);
        setTesting(false);
        return;
      }

      // 1) Auth check
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        logs.push(`❌ Session error: ${sessionError.message}`);
        setResults(logs);
        setTesting(false);
        return;
      }

      if (!session?.user) {
        logs.push("❌ Not authenticated - please log in first");
        logs.push("💡 Your admin login must sign in with Supabase Auth (signInWithPassword).");
        setResults(logs);
        setTesting(false);
        return;
      }

      logs.push(`✅ Authenticated as: ${session.user.email}`);

      // 2) Bucket access check (correct way: list objects, NOT listBuckets)
      logs.push(`🔍 Checking bucket access via list() on '${BUCKET}'...`);
      const { data: listData, error: listError } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 3 });

      if (listError) {
        logs.push(`❌ Bucket list failed: ${listError.message}`);

        const msg = listError.message.toLowerCase();
        if (msg.includes("not found")) {
          logs.push("💡 This usually means:");
          logs.push("   1) Bucket name is different (dash/underscore mismatch), OR");
          logs.push("   2) You're connected to a different Supabase project.");
        } else if (msg.includes("jwt") || msg.includes("auth")) {
          logs.push("💡 Auth/token issue. Try logging out and logging in again.");
        } else if (msg.includes("row-level security")) {
          logs.push("💡 Policy/RLS issue on storage.objects.");
        }

        setResults(logs);
        setTesting(false);
        return;
      }

      logs.push(`✅ Bucket accessible. Found ${listData?.length ?? 0} item(s) in root`);

      // 3) Upload test
      logs.push(`🧪 Testing upload to '${BUCKET}'...`);
      const testFile = new File(["test content"], "test.txt", { type: "text/plain" });
      const testPath = `tests/test-${Date.now()}.txt`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(testPath, testFile, { upsert: true });

      if (uploadError) {
        logs.push(`❌ Upload test failed: ${uploadError.message}`);

        const msg = uploadError.message.toLowerCase();
        if (msg.includes("not found")) {
          logs.push(`💡 Bucket '${BUCKET}' not found from client. Check bucket name + project URL in .env`);
        } else if (msg.includes("row-level security")) {
          logs.push("💡 Upload blocked by RLS/policies. You need an INSERT policy for authenticated.");
        } else if (msg.includes("not authorized") || msg.includes("permission")) {
          logs.push("💡 Permission issue. Confirm policies and that you're authenticated.");
        }

        setResults(logs);
        setTesting(false);
        return;
      }

      logs.push("✅ Upload test successful - bucket is working!");

      // 4) Cleanup
      logs.push("🧹 Cleaning up test file...");
      const { error: deleteError } = await supabase.storage.from(BUCKET).remove([testPath]);

      if (deleteError) {
        logs.push(`⚠️ Cleanup warning: ${deleteError.message}`);
      } else {
        logs.push("✅ Test cleanup completed");
      }
    } catch (error) {
      logs.push(
        `❌ Test failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    setResults(logs);
    setTesting(false);
  };

  if (!isSupabaseConfigured) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-blue-800 ${isRTL ? "font-arabic" : "font-sans"}`}>
          {isRTL ? "اختبار تخزين الصور" : "Storage Test"}
        </h3>

        <button
          onClick={runStorageTest}
          disabled={testing}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {testing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <TestTube size={16} />
          )}
          <span>
            {testing ? (isRTL ? "جاري الاختبار..." : "Testing...") : isRTL ? "اختبار" : "Test"}
          </span>
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-1">
          {results.map((result, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 rtl:space-x-reverse text-sm"
            >
              {result.startsWith("✅") ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : result.startsWith("❌") ? (
                <XCircle size={14} className="text-red-600" />
              ) : (
                <div className="w-3.5 h-3.5" />
              )}
              <span
                className={`${result.startsWith("❌")
                    ? "text-red-700"
                    : result.startsWith("✅")
                      ? "text-green-700"
                      : "text-blue-700"
                  }`}
              >
                {result.replace(/^[✅❌💡🧪🔍🧹]\s*/, "")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorageTest;
