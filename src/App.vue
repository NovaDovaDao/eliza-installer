<script setup lang="ts">
import AppLogo from "./components/AppLogo.vue";
import MachineStats from "./components/MachineStats.vue";
import { useCheckElizaInitiated } from "./hooks/useCheckElizaInitiated";
import { selectInstallDirectory, startEliza } from "./utils";
// import Wizard from "./components/Wizard/Wizard.vue";

const { isElizaInitiated, isLoading } = useCheckElizaInitiated();

async function installEliza() {
  const directoryPath = await selectInstallDirectory();
  if (directoryPath) startEliza(Boolean(isElizaInitiated.value), directoryPath);
}
</script>

<template>
  <div class="flex flex-col h-screen w-screen">
    <header class="p-4">
      <AppLogo class="w-16" />
    </header>
    <main class="flex-1 flex flex-col items-center justify-center gap-2">
      <!-- <Wizard /> -->
      <MachineStats class="absolute top-4 right-4" />
      <button
        @click="installEliza"
        :disabled="isLoading"
        class="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
      >
        Install ElizaOS
      </button>
    </main>
    <footer class="p-4 text-center">
      <p class="text-xs">Nova Dova 2025. Join us on Discord.</p>
    </footer>
  </div>
</template>
