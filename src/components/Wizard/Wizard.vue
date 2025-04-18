<script setup lang="ts">
// import { Field, ErrorMessage } from "vee-validate";
import { computed } from "vue";
import "vue3-form-wizard/dist/style.css";
import { useCheckWsl2Installed } from "../../hooks/useCheckWsl2Installed";
import { useCheckNodeVersion } from "../../hooks/useCheckNodeVersion";
import { useCheckElizaInitiated } from "../../hooks/useCheckElizaInitiated";
import { selectInstallDirectory, startEliza } from "../../utils";

const {
  isElizaInitiated,
  error: errorCheckingElizaInitiated,
  isLoading: isCheckingElizaInitiated,
} = useCheckElizaInitiated();
const {
  installedVersion,
  isCorrectVersion,
  requiredVersion,
  error: errorCheckingNodeVersion,
  isLoading: isCheckingNodeVersion,
} = useCheckNodeVersion();
const {
  isWindows,
  isWSL2Installed,
  error: errorCheckingWsl2,
  isLoading: isCheckingWsl2,
} = useCheckWsl2Installed();

const stats = computed(() => ({
  isElizaInitiated,
  requiredVersion,
  installedVersion,
  isCorrectVersion,
  isWindows,
  isWSL2Installed,
}));

const errors = computed(() => [
  errorCheckingElizaInitiated.value,
  errorCheckingNodeVersion.value,
  errorCheckingWsl2.value,
]);
const isLoading = computed(
  () =>
    isCheckingElizaInitiated.value ||
    isCheckingNodeVersion.value ||
    isCheckingWsl2.value
);

async function installEliza() {
  const directoryPath = await selectInstallDirectory();
  if (directoryPath) startEliza(Boolean(isElizaInitiated.value), directoryPath);
}
</script>

<template>
  <section class="space-y-4">
    <p v-if="isLoading">loading...</p>
    <table v-else class="text-xs">
      <tr v-for="key of Object.keys(stats)">
        <td class="py-1 pr-2 text-right">
          {{ key }}
        </td>
        <td class="text-sm">
          {{ stats[key as keyof typeof stats] }}
        </td>
      </tr>
    </table>
    <ul v-if="errors">
      <li v-for="err of errors">
        {{ err }}
      </li>
    </ul>

    <button
      @click="installEliza"
      :disabled="isLoading"
      class="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
    >
      Install Agents
    </button>
  </section>
</template>
