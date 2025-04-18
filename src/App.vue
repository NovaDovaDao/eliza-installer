<script setup lang="ts">
import AppLogo from "./components/AppLogo.vue";
import Wizard from "./components/Wizard/Wizard.vue";
</script>

<template>
  <div class="flex flex-col h-screen w-screen">
    <header class="p-4">
      <AppLogo class="w-16" />
    </header>
    <main class="flex-1 flex flex-col items-center justify-center gap-2">
      <Wizard />
    </main>
    <footer class="p-4 text-center">
      <p class="text-xs">
        Nova Dova 2025.
        <a
          href="https://discord.gg/mwqBKMXy48"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join us on Discord </a
        >.
      </p>
    </footer>
  </div>
</template>
