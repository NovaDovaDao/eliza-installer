import { invoke } from "@tauri-apps/api/core";
import { platform } from "@tauri-apps/plugin-os";
import { ref, onMounted } from "vue";

export function useCheckWsl2Installed() {
  const isWindows = ref<boolean>(false);
  const isWSL2Installed = ref<boolean | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(false);

  async function checkWSL() {
    isLoading.value = true;
    error.value = null;
    isWSL2Installed.value = null;
    try {
      const currentPlatform = await platform();
      isWindows.value = currentPlatform === "windows";
      if (isWindows.value) {
        const result = (await invoke("check_wsl2_installed")) as boolean;
        isWSL2Installed.value = result;
      } else {
        // On non-Windows, WSL2 is not a concern
        isWSL2Installed.value = true;
      }
    } catch (e: any) {
      error.value = e;
      isWSL2Installed.value = false; // Assume not installed on error
      console.error("Error checking WSL2 installation:", e);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(checkWSL);

  return { isWindows, isWSL2Installed, error, isLoading };
}
