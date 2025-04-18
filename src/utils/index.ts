import { open } from "@tauri-apps/plugin-dialog";
import { Command } from "@tauri-apps/plugin-shell";

export async function startEliza(isElizaInitiated: boolean, directory: string) {
  let npmCommand = "";
  if (isElizaInitiated) {
    npmCommand = "[different npm command for initiated case]"; // Replace with the actual command
  } else {
    npmCommand = "npx --yes @elizaos/cli@beta start";
  }

  try {
    const command = Command.create(
      "install-agents",
      ["--yes", "@elizaos/cli@beta", "start"],
      {
        cwd: directory,
      }
    );
    command.on("close", (data) => {
      console.log(
        `command finished with code ${data.code} and signal ${data.signal}`
      );
    });

    command.on("error", (error) => console.error(`command error: "${error}"`));
    command.stdout.on("data", (line) =>
      console.log(`command stdout: "${line}"`)
    );
    command.stderr.on("data", (line) =>
      console.log(`command stderr: "${line}"`)
    );

    const child = await command.execute();
    console.log(child);
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
