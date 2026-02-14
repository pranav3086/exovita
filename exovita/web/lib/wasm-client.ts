import init, {
  version,
  init_body,
  compute_orbit_step,
} from "../wasm/exovita_sim_core.js";

let initialized = false;

export async function initWasm() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export { version, init_body, compute_orbit_step };
