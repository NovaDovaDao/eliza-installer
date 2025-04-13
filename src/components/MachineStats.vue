<script setup lang="ts">
import { computed } from "vue";
import { useCheckElizaInitiated } from "../hooks/useCheckElizaInitiated";
import { useCheckNodeVersion } from "../hooks/useCheckNodeVersion";
import { useCheckWsl2Installed } from "../hooks/useCheckWsl2Installed";

const { isElizaInitiated } = useCheckElizaInitiated();
const { installedVersion, isCorrectVersion, requiredVersion } =
  useCheckNodeVersion();
const { isWindows, isWSL2Installed } = useCheckWsl2Installed();

const stats = computed(() => ({
  isElizaInitiated,
  requiredVersion,
  installedVersion,
  isCorrectVersion,
  isWindows,
  isWSL2Installed,
}));
</script>

<template>
  <section class="text-xs text-neutral-400">
    <table>
      <tr v-for="key of Object.keys(stats)" class="">
        <td class="pr-2 text-right font-light">
          {{ key }}
        </td>
        <td class="font-medium">{{ stats[key as keyof typeof stats] }}</td>
      </tr>
    </table>
  </section>
</template>
