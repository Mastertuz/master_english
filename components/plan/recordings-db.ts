"use client";

/**
 * Записи речи хранятся в IndexedDB этого браузера: они не уходят на сервер
 * и не попадают в базу, их видите только вы на этом устройстве.
 */

export type Take = {
  id: string;
  taskId: string;
  at: string;
  durationSec: number;
  mime: string;
  blob: Blob;
};

const DB_NAME = "self-study-recordings";
const STORE = "takes";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("taskId", "taskId");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function done<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listTakes(taskId: string): Promise<Take[]> {
  const db = await open();
  const index = db.transaction(STORE).objectStore(STORE).index("taskId");
  const takes = await done(index.getAll(taskId));
  db.close();
  return takes.sort((a, b) => b.at.localeCompare(a.at));
}

export async function saveTake(take: Take): Promise<void> {
  const db = await open();
  await done(db.transaction(STORE, "readwrite").objectStore(STORE).put(take));
  db.close();
}

export async function deleteTake(id: string): Promise<void> {
  const db = await open();
  await done(db.transaction(STORE, "readwrite").objectStore(STORE).delete(id));
  db.close();
}
