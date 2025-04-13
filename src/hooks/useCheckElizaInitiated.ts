import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";

export function useCheckElizaInitiated() {
  const isElizaInitiated = ref<boolean | null>(null); // Use null for initial loading state
  const error = ref<any | null>(null);
  const isLoading = ref<boolean>(false);

  async function checkInitiation() {
    isLoading.value = true;
    error.value = null;
    try {
      const result = (await invoke("is_eliza_initiated")) as boolean;
      isElizaInitiated.value = result;
    } catch (e) {
      error.value = e;
      console.error("Error checking Eliza initiation:", e);
      isElizaInitiated.value = false; // Assume not initiated on error
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(checkInitiation); // Run the check when the component using the hook is mounted

  return { isElizaInitiated, error, isLoading };
}
