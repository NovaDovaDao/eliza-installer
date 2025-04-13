import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";

export function useCheckNodeVersion() {
  const installedVersion = ref<string | null>(null);
  const isCorrectVersion = ref<boolean | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const requiredVersion = "23";

  async function checkVersion() {
    isLoading.value = true;
    error.value = null;
    installedVersion.value = null;
    isCorrectVersion.value = null;
    try {
      const version: string | null = await invoke("check_node_version");
      installedVersion.value = version;
      if (version) {
        // Basic check if the major version matches
        const majorVersion = version.split(".")[0];
        isCorrectVersion.value = majorVersion === requiredVersion;
      } else {
        isCorrectVersion.value = false; // Node.js not found
      }
    } catch (e: any) {
      error.value = e;
      isCorrectVersion.value = false; // Assume incorrect or not found on error
      console.error("Error checking Node.js version:", e);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(checkVersion);

  return {
    installedVersion,
    isCorrectVersion,
    error,
    isLoading,
    requiredVersion,
  };
}
