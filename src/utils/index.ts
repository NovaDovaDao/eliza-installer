import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export async function startEliza(isElizaInitiated: boolean, directory: string) {
  let npmCommand = "";
  if (isElizaInitiated) {
    npmCommand = "[different npm command for initiated case]"; // Replace with the actual command
  } else {
    npmCommand = "npx --yes @elizaos/cli@beta start -c";
  }

  try {
    await invoke("execute_npm_command_in_dir", {
      command: npmCommand,
      directory,
    });
    console.log(`Successfully started Eliza with command: ${npmCommand}`);
    // Proceed to the next step in your wizard (e.g., data transmission)
  } catch (error) {
    console.error("Failed to execute npm command:", error);
    // Handle the error in your UI
  }
}

export async function selectInstallDirectory() {
  const selected = await open({
    directory: true,
    multiple: false, // Only allow selecting one directory
    title: "Choose Eliza Installation Directory",
  });

  const value = Array.isArray(selected) ? selected[0] : selected;
  console.log("Selected installation directory:", value);

  return typeof value === "string" ? value : null;
}
