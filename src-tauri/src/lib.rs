use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(status: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", status)
}

#[tauri::command]
fn is_eliza_initiated() -> bool {
    // Replace this with the actual logic to check for Eliza initiation
    // For example, checking if a specific directory exists:
    std::path::Path::new(".eliza").is_dir()
}

#[tauri::command]
fn check_node_version() -> Result<Option<String>, String> {
    match Command::new("node").arg("-v").output() {
        Ok(output) => {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
                // Remove the leading 'v' if present
                let version_string = stdout.strip_prefix('v').unwrap_or(&stdout).to_string();
                Ok(Some(version_string))
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
                Err(format!("Failed to execute 'node -v': {}", stderr))
            }
        }
        Err(e) => Err(format!("Error running 'node -v': {}", e)),
    }
}

#[cfg(target_os = "windows")]
#[tauri::command]
fn check_wsl2_installed() -> Result<bool, String> {
    match Command::new("wsl").arg("--list").arg("--verbose").output() {
        Ok(output) => {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                // Look for lines containing "WSL 2" in the output
                Ok(stdout.contains("WSL 2"))
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
                Err(format!("Failed to execute 'wsl --list --verbose': {}", stderr))
            }
        }
        Err(e) => Err(format!("Error running 'wsl --list --verbose': {}", e)),
    }
}

#[cfg(not(target_os = "windows"))]
#[tauri::command]
fn check_wsl2_installed() -> Result<bool, String> {
    // On non-Windows systems, WSL2 is not relevant, so we return Ok(true)
    Ok(true)
}

#[tauri::command]
fn execute_npm_command_in_dir(command: String, directory: String) -> Result<(), String> {
    let parts: Vec<&str> = command.split_whitespace().collect();
    if parts.is_empty() {
        return Err("Empty command provided".into());
    }
    let program = parts[0];
    let args = &parts[1..];
    let install_path = std::path::Path::new(&directory);

    match Command::new(program).args(args).current_dir(install_path).spawn() {
        Ok(mut _child) => {
            println!("Spawned command: {} in directory: {}", command, directory);
            Ok(())
        }
        Err(e) => Err(format!("Failed to execute command '{}' in directory '{}': {}", command, directory, e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, is_eliza_initiated, check_node_version, check_wsl2_installed, execute_npm_command_in_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
