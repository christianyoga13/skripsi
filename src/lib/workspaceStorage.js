// ─── Workspace Storage (localStorage) ─────────────────────────────────────────
// Shape setiap workspace:
// {
//   id: string,
//   name: string,
//   createdAt: string (ISO),
//   objects: [
//     {
//       modelId: string,
//       x: number, y: number, z: number,   // world position saat disimpan
//       scale: number,
//       rotationY: number,
//       frameId: string | null,
//       cushionId: string | null,
//     }
//   ]
// }

const STORAGE_KEY = "ar_workspaces_v1";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadWorkspaces() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getWorkspaceById(id) {
  return loadWorkspaces().find((w) => w.id === id) ?? null;
}

export function createWorkspace({ name, objects }) {
  const ws = {
    id: uid(),
    name,
    createdAt: new Date().toISOString(),
    objects,
  };
  const list = loadWorkspaces();
  list.unshift(ws);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function deleteWorkspace(id) {
  const list = loadWorkspaces().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function renameWorkspace(id, newName) {
  const list = loadWorkspaces().map((w) => (w.id === id ? { ...w, name: newName } : w));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
