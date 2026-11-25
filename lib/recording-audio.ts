/**
 * Записи из MediaRecorder: браузер пишет файл «на лету» и не знает, сколько он
 * продлится, поэтому длительности в заголовке нет. Safari для такого файла
 * показывает 00:00, а ползунок двигает наугад. Перекодируем запись в WAV —
 * там длительность точная, и перемотка работает во всех браузерах.
 */

/** Для речи достаточно; минута в WAV — около 3 МБ, и только в памяти вкладки */
const SAMPLE_RATE = 24000;

/** Только что записанные ответы: скачивать их обратно с сервера незачем */
const fresh = new Map<string, Blob>();

export function rememberRecording(key: string, blob: Blob) {
  fresh.set(key, blob);
}

/** Запись целиком одним запросом — вместо серии запросов по кускам */
export async function fetchRecording(
  key: string,
  url: string,
  signal: AbortSignal,
): Promise<Blob> {
  const own = fresh.get(key);
  if (own) return own;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Запись не загрузилась: ${response.status}`);
  return response.blob();
}

async function decode(blob: Blob): Promise<AudioBuffer> {
  // Старые Safari принимают только обычные частоты дискретизации
  for (const rate of [SAMPLE_RATE, 44100]) {
    try {
      // decodeAudioData забирает буфер себе, поэтому читаем его каждый раз заново
      return await new OfflineAudioContext(1, 1, rate).decodeAudioData(
        await blob.arrayBuffer(),
      );
    } catch (error) {
      if (rate === 44100) throw error;
    }
  }
  throw new Error("Запись не декодируется");
}

export function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const view = new DataView(new ArrayBuffer(44 + samples.length * 2));
  const text = (at: number, value: string) =>
    [...value].forEach((char, i) => view.setUint8(at + i, char.charCodeAt(0)));

  text(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  text(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // моно
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, Math.round(value * 32767), true);
  }
  return new Blob([view.buffer], { type: "audio/wav" });
}

/** WAV с точной длительностью; если браузер не умеет декодировать — запись как есть */
export async function toPlayable(
  blob: Blob,
): Promise<{ blob: Blob; duration: number | null }> {
  try {
    const buffer = await decode(blob);
    return {
      blob: encodeWav(buffer.getChannelData(0), buffer.sampleRate),
      duration: buffer.duration,
    };
  } catch {
    return { blob, duration: null };
  }
}
